// /frontend/api/generate-report.js
export default async function handler(req, res) {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
    const { company, overall, categories } = body;

    // If no API key, return safe fallback text.
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        text:
`Summary for ${company}:
Your score is ${overall.overallPct}%, Grade ${overall.grade}, Risk ${overall.risk}.
We can save ${fmt(overall.conservative)} – ${fmt(overall.stretch)} in 90 days.

Top focus next:
1) Fix rework and rejects with daily inline checks.
2) Balance lines with OB/SMV and hourly review.
3) Cut fabric lead time and improve planning rhythm.

Let us start with a 45-min audit call.`,
      });
    }

    // ---- Call OpenAI (use "gpt-4o-mini" or your model) ----
    const prompt =
`Act as a senior Tirupur garment factory consultant.
Write a 150-200 word, simple 5th-grade, MD-friendly summary.
Facts (do not change numbers):
- Company: ${company}
- Score: ${overall.overallPct}% (Grade ${overall.grade}, Risk ${overall.risk})
- 90-day savings range: ${fmt(overall.conservative)} – ${fmt(overall.stretch)}
- Categories: ${categories.map(c=>`${c.name} ${c.avg}/4`).join(", ")}

Style:
- Positive but direct.
- 3 short bullet "Next 30 days" at end.
- No jargon.`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    }).then(r => r.json());

    const text = resp?.choices?.[0]?.message?.content?.trim() || "AI text not available.";
    res.status(200).json({ text });
  } catch (e) {
    res.status(200).json({ text: "AI summary not available right now." });
  }
}

function fmt(n){ return "₹ " + Number(n||0).toLocaleString("en-IN"); }
