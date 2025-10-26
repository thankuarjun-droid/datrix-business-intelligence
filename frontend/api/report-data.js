// /api/report-data.js
// Build a report from Supabase answers for one assessment_id.
// ENV needed in Vercel: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Optional: DATRIX_ANNUAL_COST_BASE (default ₹12 Cr = 120000000)

const TB = {
  assessments: "assessments",
  answers: "assessment_answers",
  questions: "questions",
  categories: "categories",
};

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const assessmentId = url.searchParams.get("assessment_id");
    if (!assessmentId) return res.status(400).json({ error: "assessment_id is required" });

    const SB_URL = process.env.SUPABASE_URL;
    const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SB_URL || !SB_KEY) return res.status(200).json({ demo: true, reason: "ENV_NOT_SET" });

    async function sb(path) {
      const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      });
      if (!r.ok) throw new Error(`${path} -> ${r.status}`);
      return r.json();
    }

    // 1) Assessment meta
    const meta = await sb(`${TB.assessments}?id=eq.${assessmentId}&select=id,company,assessed_at,user_email&limit=1`);
    const assess = meta?.[0];
    if (!assess) return res.status(404).json({ error: "Assessment not found" });

    // 2) Answers + join question + category
    const answers = await sb(
      `${TB.answers}?assessment_id=eq.${assessmentId}&select=question_id,score,question:${TB.questions}(id,text,category_key,category:${TB.categories}(key,name))`
    );

    if (!answers?.length) {
      return res.status(200).json({
        company: assess.company || "Unknown",
        assessed_at: assess.assessed_at,
        overall: { score: 0, max: 0 },
        distribution: { red: 0, amber: 0, green: 0 },
        categories: [],
        questions: [],
        savings: [],
      });
    }

    // ---- Aggregate
    const MAX_PER_Q = 4;
    let red = 0, amber = 0, green = 0;
    const byCat = new Map();
    let total = 0;

    const questions = answers.map((a) => {
      const catKey = a.question?.category?.key || a.question?.category_key || "misc";
      const catName = a.question?.category?.name || "Misc";
      const score = Number(a.score ?? 0);
      const q = { id: a.question_id, text: a.question?.text || "Question", cat: catKey, cat_name: catName, score };

      // distribution
      if (score <= 1) red += 1;
      else if (score === 2) amber += 1;
      else green += 1;

      total += score;

      // per-category stats
      if (!byCat.has(catKey)) byCat.set(catKey, { key: catKey, name: catName, sum: 0, n: 0, worst: { score: 999, text: "" } });
      const c = byCat.get(catKey);
      c.sum += score; c.n += 1;
      if (score < c.worst.score) c.worst = { score, text: q.text };
      return q;
    });

    const categories = Array.from(byCat.values()).map((c) => ({
      key: c.key,
      name: c.name,
      avg: c.n ? c.sum / c.n : 0,
      max: MAX_PER_Q,
      top_issue: c.worst.text || "", // lowest-scoring question text from user input
    }));

    const overall = { score: total, max: questions.length * MAX_PER_Q };
    const distribution = { red, amber, green };

    // Savings model: gap × weight × annual base
    const annualBase = Number(process.env.DATRIX_ANNUAL_COST_BASE || 120000000);
    const weights = { quality: 0.25, production: 0.20, ie: 0.15, planning: 0.15, hr: 0.10, compliance: 0.05, costing: 0.10, misc: 0.00 };
    const savings = categories.map((c) => {
      const gap = Math.max(0, 4 - c.avg) / 4; // 0..1
      const w = weights[c.key] ?? 0.05;
      const value = Math.round(annualBase * gap * w);
      return { key: c.key, name: c.name, value, gap };
    });

    res.status(200).json({
      company: assess.company || "Unknown",
      assessed_at: assess.assessed_at,
      overall, distribution, categories, questions, savings
    });
  } catch (e) {
    res.status(200).json({ demo: true, reason: String(e) });
  }
}
