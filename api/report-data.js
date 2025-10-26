// Build a report from Supabase for one assessment_id (UUID).
// ENV in Vercel: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Optional: DATRIX_ANNUAL_COST_BASE (e.g., 120000000 = ₹12 Cr)

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

    const headers = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };

    async function sbSelect(table, paramsObj) {
      const qs = new URLSearchParams(paramsObj).toString();
      const r = await fetch(`${SB_URL}/rest/v1/${table}?${qs}`, { headers });
      const text = await r.text();
      let json; try { json = JSON.parse(text); } catch { json = null; }
      if (!r.ok) throw new Error(`REST ${table} ${r.status}: ${text}`);
      return json;
    }

    // 1) Assessment meta (select all to avoid column-name 400s)
    const metaRows = await sbSelect(TB.assessments, {
      select: "*",
      id: `eq.${assessmentId}`,
      limit: "1"
    });
    const assess = metaRows?.[0];
    if (!assess) return res.status(404).json({ error: "Assessment not found" });

    // Map meta fields safely
    const company = assess.company || assess.org_name || assess.business || "Unknown";
    const assessed_at =
      assess.assessed_at || assess.completed_at || assess.created_at || new Date().toISOString();

    // 2) Answers (no joins; just pull raw)
    const rawAnswers = await sbSelect(TB.answers, {
      select: "question_id,score,answer_value",
      assessment_id: `eq.${assessmentId}`
    });

    // 3) Questions + Categories (small tables; fetch once)
    const questRows = await sbSelect(TB.questions, {
      select: "id,text,question,category_key,category"
    });
    const catRows = await sbSelect(TB.categories, { select: "key,name" });

    // Build maps
    const qMap = new Map(
      questRows.map(q => [
        q.id,
        {
          id: q.id,
          text: q.text || q.question || "Question",
          category_key: q.category_key || q.category || "misc"
        }
      ])
    );
    const cMap = new Map(catRows.map(c => [c.key, c.name || c.key]));

    // --- Aggregate
    const MAX_PER_Q = 4;
    let red = 0, amber = 0, green = 0, total = 0;
    const byCat = new Map();
    const questions = [];

    for (const a of rawAnswers) {
      const q = qMap.get(a.question_id);
      if (!q) continue;

      const catKey = q.category_key || "misc";
      const catName = cMap.get(catKey) || (typeof q.category_key === "string" ? q.category_key : "Misc");

      const scoreNum = Number(a.score ?? a.answer_value ?? 0);
      const score = Number.isFinite(scoreNum) ? scoreNum : 0;

      // Distribution
      if (score <= 1) red += 1;
      else if (score === 2) amber += 1;
      else green += 1;

      total += score;

      // Per category
      if (!byCat.has(catKey)) byCat.set(catKey, { key: catKey, name: catName, sum: 0, n: 0, worst: { score: 999, text: "" } });
      const c = byCat.get(catKey);
      c.sum += score; c.n += 1;
      if (score < c.worst.score) c.worst = { score, text: q.text };

      questions.push({
        id: q.id,
        text: q.text,
        cat: catKey,
        cat_name: catName,
        score
      });
    }

    const categories = Array.from(byCat.values()).map(c => ({
      key: c.key,
      name: c.name,
      avg: c.n ? c.sum / c.n : 0,
      max: MAX_PER_Q,
      top_issue: c.worst.text || ""
    }));

    const overall = { score: total, max: questions.length * MAX_PER_Q };
    const distribution = { red, amber, green };

    // Savings model: gap × weight × annual base
    const annualBase = Number(process.env.DATRIX_ANNUAL_COST_BASE || 120000000);
    const weights = { quality: 0.25, production: 0.20, ie: 0.15, planning: 0.15, hr: 0.10, compliance: 0.05, costing: 0.10, misc: 0.00 };

    const savings = categories.map(c => {
      const gap = Math.max(0, 4 - c.avg) / 4;
      const w = weights[c.key] ?? 0.05;
      const value = Math.round(annualBase * gap * w);
      return { key: c.key, name: c.name, value, gap };
    });

    res.status(200).json({
      company, assessed_at, overall, distribution, categories, questions, savings,
      debug: { metaKeys: Object.keys(assess).slice(0, 20) }
    });
  } catch (e) {
    res.status(200).json({ demo: true, reason: String(e) });
  }
}
