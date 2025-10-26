// /api/report-data.js
/** Build a full report JSON from Supabase for one assessment_id (UUID). */
const TB = {
  assessments: "assessments",
  answers: "assessment_answers",
  questions: "questions",
  categories: "categories"
};

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const assessmentId = url.searchParams.get("assessment_id");
    if (!assessmentId) return res.status(400).json({ error: "assessment_id is required" });

    const SB = {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_SERVICE_ROLE_KEY
    };
    if (!SB.url || !SB.key) {
      return res.status(200).json({ demo: true, reason: "ENV_NOT_SET" });
    }

    async function sb(path, qs="") {
      const r = await fetch(`${SB.url}/rest/v1/${path}${qs}`, {
        headers: { apikey: SB.key, Authorization: `Bearer ${SB.key}` }
      });
      if (!r.ok) throw new Error(`${path} ${r.status}`);
      return r.json();
    }

    // 1) meta
    const [assess] = await sb(`${TB.assessments}?id=eq.${assessmentId}&select=id,company,assessed_at,user_email`);
    if (!assess) return res.status(404).json({ error: "Assessment not found" });

    // 2) answers + join question & category info
    const answers = await sb(
      `${TB.answers}?assessment_id=eq.${assessmentId}&select=question_id,score,question:${TB.questions}(*,category:categories(*))`
    );

    if (!answers?.length) return res.status(200).json({
      company: assess.company || "Unknown",
      assessed_at: assess.assessed_at,
      overall: { score: 0, max: 0 },
      distribution: { red: 0, amber: 0, green: 0 },
      categories: [],
      questions: []
    });

    // ---- math & aggregation (deterministic) ----
    const maxPerQ = 4;
    const byCat = new Map();
    let red=0, amber=0, green=0, total = 0;

    const questions = answers.map(a => {
      const catKey = a.question?.category?.key || a.question?.category_key || "misc";
      const catName = a.question?.category?.name || a.question?.category || "Misc";
      const q = {
        id: a.question_id,
        text: a.question?.text || a.question?.question || "Question",
        cat: catKey,
        cat_name: catName,
        score: Number(a.score ?? 0)
      };

      total += q.score;
      if (q.score <= 1) red += 1; else if (q.score === 2) amber += 1; else green += 1;

      if (!byCat.has(catKey)) byCat.set(catKey, { key: catKey, name: catName, sum:0, n:0 });
      const c = byCat.get(catKey); c.sum += q.score; c.n += 1;
      return q;
    });

    const categories = Array.from(byCat.values()).map(c => ({
      key: c.key, name: c.name,
      avg: c.n ? c.sum / c.n : 0, max: maxPerQ,
      top_issue: "" // filled by UI/AI later
    }));

    const overall = { score: total, max: questions.length * maxPerQ };
    const distribution = { red, amber, green };

    // Savings by category (gap model)
    const annualBase = Number(process.env.DATRIX_ANNUAL_COST_BASE || 120000000); // ₹12 Cr default
    const weights = { // must sum ~1.0 (rough)
      quality: 0.25, production: 0.20, ie: 0.15, planning: 0.15,
      hr: 0.10, compliance: 0.05, costing: 0.10, misc: 0.00
    };
    const savings = categories.map(c => {
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
