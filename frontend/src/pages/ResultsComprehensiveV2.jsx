import React, { useEffect, useMemo, useState } from "react";

const BRAND = {
  blue: "#0B3B8C",
  blueDark: "#0A1E44",
  yellow: "#F5B301",
  yellowLite: "#FFD666",
  red: "#EF4444",
  orange: "#F97316",
  amber: "#F59E0B",
  green: "#16A34A",
  greenLite: "#22C55E",
};

const demo = {
  company: "Greenway Clothing",
  assessed_at: "2025-10-22T16:10:00Z",
  overall: { score: 112, max: 240 },
  distribution: { red: 18, amber: 26, green: 16 },
  categories: [
    { key: "quality", name: "Quality", avg: 2.1, max: 4, top_issue: "RCA loop weak; no inline DHU board" },
    { key: "production", name: "Production", avg: 2.4, max: 4, top_issue: "Unbalanced lines; no hourly review" },
    { key: "ie", name: "IE", avg: 1.9, max: 4, top_issue: "No OB/SMV discipline" },
    { key: "planning", name: "Planning", avg: 2.0, max: 4, top_issue: "Fabric lead time 30–40 days" },
    { key: "hr", name: "HR & Culture", avg: 2.3, max: 4, top_issue: "No performance review rhythm" },
    { key: "compliance", name: "Compliance", avg: 3.2, max: 4, top_issue: "Docs OK; audits can tighten" },
    { key: "costing", name: "Costing/Finance", avg: 1.8, max: 4, top_issue: "Poor piece weight/BOM control" },
  ],
  priority_actions: [
    { title: "Cut rework from 15% → 7%", impact: 4500000, effort: "Medium", owner: "QA Manager", due: "30 days" },
    { title: "Fix plan → fabric lead time 30 → 20 days", impact: 3000000, effort: "High", owner: "Merch Head", due: "60 days" },
    { title: "Daily hourly review boards on lines", impact: 1800000, effort: "Low", owner: "Prod Head", due: "7 days" },
    { title: "OB/SMV update + line balancing", impact: 2200000, effort: "Medium", owner: "IE Lead", due: "21 days" },
  ],
  questions: [
    { id: 1, cat: "hr", text: "Do you manage employee performance and productivity?", score: 2,
      diagnosis: "Practice exists but weak.", reco: ["Action plan", "Train supervisors", "Monthly review"] },
    { id: 2, cat: "hr", text: "What is your retention strategy?", score: 2,
      diagnosis: "Gaps in engagement and growth.", reco: ["Gap analysis", "Plan", "Targets"] },
    { id: 3, cat: "hr", text: "Workplace safety standards?", score: 3,
      diagnosis: "OK. Can improve.", reco: ["Benchmark", "Small improvements"] },
  ],
};

function pct(n, d) { return d === 0 ? 0 : Math.round((n / d) * 100); }
function money(n) { return "₹ " + (n).toLocaleString("en-IN"); }

function gradeFromPercent(p) {
  if (p >= 85) return "A";
  if (p >= 70) return "B";
  if (p >= 55) return "C";
  if (p >= 40) return "D";
  return "E";
}
function riskFromPercent(p) {
  if (p >= 70) return "Low";
  if (p >= 55) return "Medium";
  return "High";
}
function bandColor(score) {
  if (score >= 3.5) return BRAND.green;
  if (score >= 3.0) return BRAND.greenLite;
  if (score >= 2.0) return BRAND.amber;
  if (score >= 1.0) return BRAND.orange;
  return BRAND.red;
}
function savingsEstimate(overallPct, annualBase = 120000000) {
  const gap = 100 - overallPct;
  const wastePct = Math.min(0.25 * gap / 100, 0.25);
  const conservative = Math.round(annualBase * wastePct * 0.35);
  const stretch = Math.round(annualBase * wastePct * 0.55);
  return { conservative, stretch };
}
async function loadReportData() {
  return new Promise((r) => setTimeout(() => r(demo), 150));
}

export default function ResultsComprehensive() {
  const [data, setData] = useState(null);
  const [aiText, setAiText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => { (async () => setData(await loadReportData()))(); }, []);

  const derived = useMemo(() => {
    if (!data) return null;
    const overallPct = pct(data.overall.score, data.overall.max);
    const grade = gradeFromPercent(overallPct);
    const risk = riskFromPercent(overallPct);
    const { conservative, stretch } = savingsEstimate(overallPct);
    const totalQs = (data.distribution.red + data.distribution.amber + data.distribution.green) || 1;
    return { overallPct, grade, risk, conservative, stretch, totalQs };
  }, [data]);

  async function handleGenerateAI() {
    try {
      setLoadingAI(true); setAiText("");
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: data.company, overall: derived, categories: data.categories }),
      });
      const j = await res.json();
      setAiText(j.text || "AI summary is not available now.");
    } catch {
      setAiText("AI summary failed. We will use the basic summary.");
    } finally { setLoadingAI(false); }
  }

  if (!data || !derived) return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading Report…</div>;

  const donutStyle = {
    background: `conic-gradient(${BRAND.red} 0 ${Math.round((data.distribution.red/derived.totalQs)*360)}deg, ${BRAND.amber} 0 ${Math.round(((data.distribution.red+data.distribution.amber)/derived.totalQs)*360)}deg, ${BRAND.green} 0 360deg)`,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <style>{`@media print { .no-print { display: none !important; } .page-break { page-break-before: always; } }`}</style>

      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center gap-4">
        <img src="/datrix-logo.svg" alt="Datrix logo" className="h-10 w-auto" />
        <div className="text-xl font-semibold" style={{color: BRAND.blue}}>Datrix™ Assessment Report</div>
        <div className="ml-auto no-print flex gap-2">
          <button onClick={() => window.print()} className="px-3 py-1.5 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50">Print / PDF</button>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="px-3 py-1.5 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50">Copy Link</button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard title="Overall Score" value={`${data.overall.score} / ${data.overall.max}`} sub={`${derived.overallPct}%`} />
          <KpiCard title="Grade" value={derived.grade} pillColor={derived.grade === "A" ? BRAND.green : derived.grade === "B" ? BRAND.greenLite : derived.grade === "C" ? BRAND.amber : BRAND.red} sub={`${derived.risk} Risk`} />
          <KpiCard title="Savings (90 days)" value={`${money(derived.conservative)} – ${money(derived.stretch)}`} sub="Potential range" />
          <KpiCard title="Assessed On" value={new Date(data.assessed_at).toLocaleString()} sub={data.company} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-sm font-semibold mb-3">Question Status</div>
          <div className="flex items-center gap-6">
            <div className="relative h-36 w-36 rounded-full" style={donutStyle}>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold">{derived.totalQs}</div>
                  <div className="text-xs text-slate-500">Questions</div>
                </div>
              </div>
            </div>
            <div>
              <Legend color={BRAND.red} label="Critical/Weak" value={data.distribution.red}/>
              <Legend color={BRAND.amber} label="Needs Work" value={data.distribution.amber}/>
              <Legend color={BRAND.green} label="OK/Strong" value={data.distribution.green}/>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:col-span-2">
          <div className="text-sm font-semibold mb-3">Category Snapshot</div>
          <div className="space-y-3">
            {data.categories.map((c) => (
              <div key={c.key} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3 md:col-span-2 text-sm font-medium">{c.name}</div>
                <div className="col-span-7 md:col-span-9">
                  <div className="h-2 rounded bg-slate-100">
                    <div className="h-2 rounded" style={{ width: `${(c.avg / c.max) * 100}%`, backgroundColor: bandColor(c.avg) }}></div>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1 text-right text-xs text-slate-500">{c.avg.toFixed(1)} / {c.max}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.categories.map((c) => (
          <div key={c.key} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{c.name}</div>
              <span className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: bandColor(c.avg) }}>
                {c.avg.toFixed(1)} / {c.max}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500">Top issue</div>
            <div className="text-sm">{c.top_issue}</div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Top Actions (Impact first)</div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-3">Action</th>
                  <th className="py-2 pr-3">Impact</th>
                  <th className="py-2 pr-3">Effort</th>
                  <th className="py-2 pr-3">Owner</th>
                  <th className="py-2">Due</th>
                </tr>
              </thead>
              <tbody>
                {data.priority_actions.slice().sort((a,b)=>b.impact-a.impact).map((a, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-2 pr-3">{a.title}</td>
                    <td className="py-2 pr-3 font-medium">{money(a.impact)}</td>
                    <td className="py-2 pr-3">{a.effort}</td>
                    <td className="py-2 pr-3">{a.owner}</td>
                    <td className="py-2">{a.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-8 space-y-4">
        {data.categories.map((c) => (
          <Accordion key={c.key} title={`${c.name} – Diagnosis & Actions`} defaultOpen={false}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard title="Diagnosis">
                <ul className="list-disc ml-4 text-sm">
                  <li>{c.top_issue}</li>
                  <li>Process exists but not stable.</li>
                  <li>Improve review rhythm.</li>
                </ul>
              </InfoCard>
              <InfoCard title="Recommendations">
                <ul className="list-disc ml-4 text-sm">
                  <li>Define SOP and teach team.</li>
                  <li>Weekly review with owner.</li>
                  <li>Measure and display results.</li>
                </ul>
              </InfoCard>
              <InfoCard title="Target (30–60–90 days)">
                <ul className="list-disc ml-4 text-sm">
                  <li>30d: Start; 60d: Stabilize; 90d: Audit.</li>
                  <li>Assign owner and budget.</li>
                </ul>
              </InfoCard>
            </div>
          </Accordion>
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Personalized Summary</div>
            <button onClick={handleGenerateAI} disabled={loadingAI}
              className="no-print px-3 py-1.5 rounded-md text-white"
              style={{backgroundColor: BRAND.blue}}>
              {loadingAI ? "Generating…" : "Generate with AI"}
            </button>
          </div>
          <div className="mt-3 text-sm whitespace-pre-line">
            {aiText || "Click “Generate with AI” to create a short MD-friendly summary and next steps."}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 my-10">
        <div className="rounded-2xl p-6 text-white" style={{background: "linear-gradient(90deg, #F5B301, #FF7E3E)"}}>
          <div className="text-2xl font-extrabold mb-2">Save ₹8+ Crores Annually — Start in 90 Days</div>
          <div className="text-sm opacity-95">Free 45-min audit • No risk • Custom plan</div>
          <div className="mt-4 flex gap-3">
            <a href="mailto:arjunm@navvicorp.com" className="px-4 py-2 bg-black/20 rounded-md backdrop-blur">Book a Call</a>
            <button onClick={()=>window.print()} className="px-4 py-2 bg-black/20 rounded-md backdrop-blur">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, sub, pillColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="mt-1 text-xl font-extrabold">{value}</div>
      {sub && (
        <div className="mt-1 inline-flex text-[11px] px-2 py-0.5 rounded-full text-white" style={{backgroundColor: pillColor || BRAND.blue}}>
          {sub}
        </div>
      )}
    </div>
  );
}
function Legend({ color, label, value }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="h-3 w-3 rounded" style={{backgroundColor: color}}></span>
      <span className="text-sm">{label}</span>
      <span className="text-xs text-slate-500 ml-1">({value})</span>
    </div>
  );
}
function Accordion({ title, children, defaultOpen=false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <button onClick={()=>setOpen(!open)} className="w-full text-left px-5 py-3 flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <span className="text-slate-500">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}
function InfoCard({ title, children }) {
  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="text-xs text-slate-500 mb-1">{title}</div>
      {children}
    </div>
  );
}
