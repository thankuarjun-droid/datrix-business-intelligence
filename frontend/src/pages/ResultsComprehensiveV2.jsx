import React, { useEffect, useMemo, useState } from "react";

const BRAND = {
  blue: "#0B3B8C", yellow: "#F5B301",
  red: "#EF4444", orange: "#F97316", amber: "#F59E0B",
  green: "#16A34A", greenLite: "#22C55E"
};

function pct(n, d) { return d === 0 ? 0 : Math.round((n / d) * 100); }
function money(n) { return "₹ " + Number(n||0).toLocaleString("en-IN"); }
function gradeFromPercent(p){ if(p>=85)return"A"; if(p>=70)return"B"; if(p>=55)return"C"; if(p>=40)return"D"; return"E"; }
function riskFromPercent(p){ if(p>=70)return"Low"; if(p>=55)return"Medium"; return"High"; }
function bandColor(score){ if(score>=3.5)return BRAND.green; if(score>=3.0)return BRAND.greenLite; if(score>=2.0)return BRAND.amber; if(score>=1.0)return BRAND.orange; return BRAND.red; }

export default function ResultsComprehensive(){
  const [data, setData] = useState(null);
  const [aiText, setAiText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(()=>{
    (async ()=>{
      const params = new URLSearchParams(window.location.search);
      const id = params.get("assessment_id");
      const r = id ? await fetch(`/api/report-data?assessment_id=${id}`) : null;
      const j = r ? await r.json() : null;
      if(j && !j.demo) setData(j);
      else setData(demoFallback); // last resort demo
    })();
  },[]);

  const d = data;
  const derived = useMemo(()=>{
    if(!d) return null;
    const p = pct(d.overall.score, d.overall.max);
    const grade = gradeFromPercent(p);
    const risk = riskFromPercent(p);
    const totalQs = (d.distribution.red + d.distribution.amber + d.distribution.green) || 1;
    // simple savings range from API's category values (conservative 65%, stretch 100% of sum)
    const totalSavings = (d.savings||[]).reduce((s,x)=>s+x.value,0);
    return { p, grade, risk, totalQs,
      conservative: Math.round(totalSavings*0.65),
      stretch: Math.round(totalSavings*1.00)
    };
  },[d]);

  async function handleGenerateAI(){
    try{
      setLoadingAI(true); setAiText("");
      const res = await fetch("/api/generate-report",{
        method:"POST", headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ company:d.company, overall:{
          overallPct:derived.p, grade:derived.grade, risk:derived.risk,
          conservative: derived.conservative, stretch: derived.stretch
        }, categories:d.categories })
      });
      const j = await res.json(); setAiText(j.text||"");
    }catch{ setAiText("AI summary not available right now."); }
    finally{ setLoadingAI(false); }
  }

  if(!d || !derived) return <div className="min-h-screen grid place-items-center text-slate-600">Loading…</div>;

  const donutStyle = {
    background: `conic-gradient(${BRAND.red} 0 ${Math.round((d.distribution.red/derived.totalQs)*360)}deg, ${BRAND.amber} 0 ${Math.round(((d.distribution.red+d.distribution.amber)/derived.totalQs)*360)}deg, ${BRAND.green} 0 360deg)`
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <style>{`@media print { .no-print{display:none!important;} .page-break{page-break-before:always;} }`}</style>

      {/* Top bar */}
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center gap-4">
        <img src="/datrix-logo.svg" alt="Datrix" className="h-10" />
        <div className="text-xl font-bold" style={{color:BRAND.blue}}>Datrix™ Assessment Report</div>
        <div className="ml-auto no-print flex gap-2">
          <button onClick={()=>window.print()} className="btn">Print / PDF</button>
          <button onClick={()=>navigator.clipboard.writeText(window.location.href)} className="btn">Copy Link</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard title="Overall Score" value={`${d.overall.score} / ${d.overall.max}`} sub={`${derived.p}%`} />
          <KpiCard title="Grade" value={derived.grade} sub={`${derived.risk} Risk`}
                   pillColor={derived.grade==="A"?BRAND.green:derived.grade==="B"?BRAND.greenLite:derived.grade==="C"?BRAND.amber:BRAND.red}/>
          <KpiCard title="Savings (90 days)" value={`${money(derived.conservative)} – ${money(derived.stretch)}`} sub="Potential range" />
          <KpiCard title="Assessed On" value={new Date(d.assessed_at).toLocaleString()} sub={d.company}/>
        </div>
      </div>

      {/* Charts row */}
      <div className="mx-auto max-w-6xl px-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Donut */}
        <Card>
          <Title>Question Status</Title>
          <div className="flex items-center gap-6">
            <div className="relative h-36 w-36 rounded-full" style={donutStyle}>
              <div className="absolute inset-4 bg-white rounded-full grid place-items-center">
                <div className="text-center">
                  <div className="text-xl font-bold">{derived.totalQs}</div>
                  <div className="text-xs text-slate-500">Questions</div>
                </div>
              </div>
            </div>
            <div>
              <Legend color={BRAND.red} label="Critical/Weak" value={d.distribution.red}/>
              <Legend color={BRAND.amber} label="Needs Work" value={d.distribution.amber}/>
              <Legend color={BRAND.green} label="OK/Strong" value={d.distribution.green}/>
            </div>
          </div>
        </Card>

        {/* Category Snapshot (Achieved vs Gap bars) */}
        <Card className="md:col-span-2">
          <Title>Category Snapshot (Achieved vs Gap)</Title>
          <div className="space-y-3">
            {d.categories.map(c=>{
              const achieved = (c.avg/4)*100, gap = 100-achieved;
              return (
                <div key={c.key}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-slate-500">{c.avg.toFixed(1)} / 4</div>
                  </div>
                  <div className="h-3 w-full rounded bg-slate-100 overflow-hidden">
                    <div className="h-3 inline-block" style={{width:`${achieved}%`, background:BRAND.greenLite}}/>
                    <div className="h-3 inline-block" style={{width:`${gap}%`, background:"#E5E7EB"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Category Tiles */}
      <div className="mx-auto max-w-6xl px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {d.categories.map(c=>(
          <Card key={c.key}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">{c.name}</div>
              <span className="px-2 py-0.5 rounded text-xs text-white" style={{background:bandColor(c.avg)}}>
                {c.avg.toFixed(1)} / 4
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500">Diagnosis</div>
            <div className="text-sm">{diagnosisFromAvg(c.avg)}</div>
          </Card>
        ))}
      </div>

      {/* Savings by Category */}
      <div className="mx-auto max-w-6xl px-4 mt-8">
        <Card>
          <Title>Estimated Savings by Category (90 days)</Title>
          <div className="space-y-3">
            {(d.savings||[]).slice().sort((a,b)=>b.value-a.value).map(s=>(
              <div key={s.key}>
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">{s.name}</div>
                  <div className="font-semibold">{money(s.value)}</div>
                </div>
                <div className="h-2 w-full rounded bg-slate-100 overflow-hidden">
                  <div className="h-2" style={{width:`${Math.min(100, s.gap*100)}%`, background:BRAND.blue}}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Compact Question View */}
      <div className="mx-auto max-w-6xl px-4 mt-8">
        <Card>
          <Title>Question-Level View (compact)</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {d.questions.slice(0, 60).map(q=>(
              <div key={q.id} className="flex items-start gap-2 p-2 rounded border border-slate-200">
                <span className="h-2.5 w-2.5 mt-1 rounded-full" style={{background:bandColor(q.score)}}/>
                <div className="flex-1">
                  <div className="text-[13px] leading-snug">{q.text}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {labelFromScore(q.score)} • Score {q.score}/4 • {q.cat_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 mt-3">
            Legend: 0–1=Critical/Weak, 2=Needs work, 3–4=OK/Strong
          </div>
        </Card>
      </div>

      {/* AI Summary */}
      <div className="mx-auto max-w-6xl px-4 mt-8">
        <Card>
          <div className="flex items-center justify-between">
            <Title>Personalized Summary</Title>
            <button className="no-print btn" onClick={handleGenerateAI} disabled={loadingAI}>
              {loadingAI ? "Generating…" : "Generate with AI"}
            </button>
          </div>
          <div className="mt-3 text-sm whitespace-pre-line">
            {aiText || defaultSummary(d, derived)}
          </div>
        </Card>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-6xl px-4 my-10">
        <div className="rounded-2xl p-6 text-white" style={{background:"linear-gradient(90deg, #F5B301, #FF7E3E)"}}>
          <div className="text-2xl font-extrabold mb-2">Save ₹8+ Crores Annually — Start in 90 Days</div>
          <div className="text-sm opacity-95">Free 45-min audit • No risk • Custom plan</div>
          <div className="mt-4 flex gap-3">
            <a href="mailto:arjunm@navvicorp.com" className="px-4 py-2 bg-black/20 rounded-md">Book a Call</a>
            <button onClick={()=>window.print()} className="px-4 py-2 bg-black/20 rounded-md">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI bits ---------- */
function Card({children,className}){return <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 ${className||""}`}>{children}</div>;}
function Title({children}){return <div className="text-sm font-semibold mb-3">{children}</div>;}
function KpiCard({ title, value, sub, pillColor }) {
  return (
    <Card>
      <div className="text-xs text-slate-500">{title}</div>
      <div className="mt-1 text-xl font-extrabold">{value}</div>
      {sub && <div className="mt-1 inline-flex text-[11px] px-2 py-0.5 rounded-full text-white"
            style={{backgroundColor: pillColor || BRAND.blue}}>{sub}</div>}
    </Card>
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

/* ---------- deterministic copy helpers ---------- */
function diagnosisFromAvg(avg){
  if(avg <= 1) return "Urgent gaps. No stable system.";
  if(avg <= 2) return "Practice exists but weak. Needs control.";
  if(avg < 3)  return "Satisfactory. Improve consistency.";
  return "Strong. Maintain and audit.";
}
function labelFromScore(s){
  if(s<=1) return "Critical/Weak";
  if(s===2) return "Needs Work";
  return "OK/Strong";
}
function defaultSummary(d, k){
  return `Summary for ${d.company}:
Score ${k.p}%, Grade ${k.grade}, Risk ${k.risk}.
Potential savings in 90 days: ${money(k.conservative)} – ${money(k.stretch)}.

Focus next 30 days:
• Fix top RED items in Quality/Production.
• Start daily hourly review on lines with OB/SMV.
• Tighten planning rhythm to cut delays.`;
}

/* --------- last-resort demo if API not ready --------- */
const demoFallback = {
  company:"Demo Factory", assessed_at:new Date().toISOString(),
  overall:{score:112,max:240},
  distribution:{red:18,amber:26,green:16},
  categories:[
    {key:"quality",name:"Quality",avg:2.1,max:4},
    {key:"production",name:"Production",avg:2.4,max:4},
    {key:"ie",name:"IE",avg:1.9,max:4},
    {key:"planning",name:"Planning",avg:2.0,max:4},
    {key:"hr",name:"HR & Culture",avg:2.3,max:4},
    {key:"compliance",name:"Compliance",avg:3.2,max:4},
    {key:"costing",name:"Costing/Finance",avg:1.8,max:4}
  ],
  questions: Array.from({length:24}).map((_,i)=>({
    id:i+1, text:`Sample question ${i+1}`, cat:"quality", cat_name:"Quality", score:[0,1,2,3,4][i%5]
  })),
  savings:[
    {key:"quality",name:"Quality",value:4500000,gap:0.48},
    {key:"production",name:"Production",value:3000000,gap:0.40},
    {key:"ie",name:"IE",value:2200000,gap:0.53},
    {key:"planning",name:"Planning",value:2000000,gap:0.50},
    {key:"hr",name:"HR & Culture",value:1500000,gap:0.43},
    {key:"compliance",name:"Compliance",value:800000,gap:0.20},
    {key:"costing",name:"Costing/Finance",value:1000000,gap:0.55}
  ]
};
