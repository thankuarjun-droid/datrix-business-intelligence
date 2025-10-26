import React, { useEffect, useMemo, useState } from "react";

const BRAND = {
  blue: "#0B3B8C", yellow: "#F5B301",
  red: "#EF4444", orange: "#F97316", amber: "#F59E0B",
  green: "#16A34A", greenLite: "#22C55E"
};

function pct(n,d){return d===0?0:Math.round((n/d)*100)}
function money(n){return "₹ "+Number(n||0).toLocaleString("en-IN")}
function gradeFromPercent(p){if(p>=85)return"A";if(p>=70)return"B";if(p>=55)return"C";if(p>=40)return"D";return"E"}
function riskFromPercent(p){if(p>=70)return"Low";if(p>=55)return"Medium";return"High"}
function bandColor(s){if(s>=3.5)return BRAND.green; if(s>=3.0)return BRAND.greenLite; if(s>=2.0)return BRAND.amber; if(s>=1.0)return BRAND.orange; return BRAND.red}
function labelFromScore(s){ if(s<=1) return "Critical/Weak"; if(s===2) return "Needs Work"; return "OK/Strong" }
function diagnosisFromAvg(a){ if(a<=1) return "Urgent gaps. No stable system."; if(a<=2) return "Exists but weak. Needs control."; if(a<3) return "Satisfactory. Improve consistency."; return "Strong. Maintain and audit." }

export default function ResultsComprehensive(){
  const [data,setData]=useState(null);
  const [aiText,setAiText]=useState(""); const [loadingAI,setLoadingAI]=useState(false);

  useEffect(()=>{
    (async ()=>{
      const id=new URLSearchParams(window.location.search).get("assessment_id");
      const r=id?await fetch(`/api/report-data?assessment_id=${id}`):null;
      const j=r?await r.json():null;
      setData(j && !j.demo ? j : demoFallback);
    })();
  },[]);

  const d=data;
  const k=useMemo(()=>{
    if(!d) return null;
    const p=pct(d.overall.score,d.overall.max);
    const grade=gradeFromPercent(p), risk=riskFromPercent(p);
    const totalQs=(d.distribution.red+d.distribution.amber+d.distribution.green)||1;
    const totalSavings=(d.savings||[]).reduce((s,x)=>s+x.value,0);
    return {p,grade,risk,totalQs,conservative:Math.round(totalSavings*0.65),stretch:Math.round(totalSavings)};
  },[d]);

  async function handleAI(){
    try{
      setLoadingAI(true); setAiText("");
      const res=await fetch("/api/generate-report",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({company:d.company,overall:{overallPct:k.p,grade:k.grade,risk:k.risk,conservative:k.conservative,stretch:k.stretch},categories:d.categories})});
      const j=await res.json(); setAiText(j.text||"");
    }catch{ setAiText("AI summary not available right now.") }finally{ setLoadingAI(false) }
  }

  if(!d||!k) return <div className="min-h-screen grid place-items-center text-slate-600">Loading…</div>;

  const donutStyle={background:`conic-gradient(${BRAND.red} 0 ${Math.round((d.distribution.red/k.totalQs)*360)}deg, ${BRAND.amber} 0 ${Math.round(((d.distribution.red+d.distribution.amber)/k.totalQs)*360)}deg, ${BRAND.green} 0 360deg)`};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <style>{`@media print{.no-print{display:none!important}.page-break{page-break-before:always}} .btn{padding:.375rem .75rem;border:1px solid #e2e8f0;border-radius:.5rem;background:#fff} .btn:hover{background:#f8fafc}`}</style>

      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center gap-4">
        <img src="/datrix-logo.svg" alt="Datrix" className="h-10"/>
        <div className="text-xl font-bold" style={{color:BRAND.blue}}>Datrix™ Assessment Report</div>
        <div className="ml-auto no-print flex gap-2">
          <button onClick={()=>window.print()} className="btn">Print / PDF</button>
          <button onClick={()=>navigator.clipboard.writeText(window.location.href)} className="btn">Copy Link</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Kpi title="Overall Score" value={`${d.overall.score} / ${d.overall.max}`} sub={`${k.p}%`}/>
          <Kpi title="Grade" value={k.grade} sub={`${k.risk} Risk`} pill={k.grade==="A"?BRAND.green:k.grade==="B"?BRAND.greenLite:k.grade==="C"?BRAND.amber:BRAND.red}/>
          <Kpi title="Savings (90 days)" value={`${money(k.conservative)} – ${money(k.stretch)}`} sub="Potential range"/>
          <Kpi title="Assessed On" value={new Date(d.assessed_at).toLocaleString()} sub={d.company}/>
        </div>
      </div>

      {/* Charts row: Donut + Snapshot + Radar */}
      <div className="mx-auto max-w-6xl px-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Title>Question Status</Title>
          <div className="flex items-center gap-6">
            <div className="relative h-36 w-36 rounded-full" style={donutStyle}>
              <div className="absolute inset-4 bg-white rounded-full grid place-items-center">
                <div className="text-center">
                  <div className="text-xl font-bold">{k.totalQs}</div>
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

        <Card className="md:col-span-1">
          <Title>Category Snapshot (Achieved vs Gap)</Title>
          <div className="space-y-3">
            {d.categories.map(c=>{
              const achieved=(c.avg/4)*100, gap=100-achieved;
              return (
                <div key={c.key}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-slate-500">{c.avg.toFixed(1)} / 4</div>
                  </div>
                  <div className="h-3 w-full rounded bg-slate-100 overflow-hidden">
                    <div className="h-3 inline-block" style={{width:`${achieved}%`,background:BRAND.greenLite}}/>
                    <div className="h-3 inline-block" style={{width:`${gap}%`,background:"#E5E7EB"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <Title>Category Radar</Title>
          <Radar values={d.categories.map(c=>Math.max(0,Math.min(1,c.avg/4)))} labels={d.categories.map(c=>c.name)}/>
        </Card>
      </div>

      {/* Category tiles (clean margins) */}
      <div className="mx-auto max-w-6xl px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {d.categories.map(c=>(
          <Card key={c.key}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">{c.name}</div>
              <span className="px-2 py-0.5 rounded text-xs text-white" style={{background:bandColor(c.avg)}}>
                {c.avg.toFixed(1)} / 4
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500">Top issue (from your answers)</div>
            <div className="text-sm">{c.top_issue || diagnosisFromAvg(c.avg)}</div>
          </Card>
        ))}
      </div>

      {/* Savings bars */}
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
                  <div className="h-2" style={{width:`${Math.min(100,s.gap*100)}%`,background:BRAND.blue}}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Compact question view with interpretation */}
      <div className="mx-auto max-w-6xl px-4 mt-8">
        <Card>
          <Title>Question-Level View (compact)</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {d.questions.map(q=>(
              <div key={q.id} className="flex items-start gap-2 p-2 rounded border border-slate-200">
                <span className="h-2.5 w-2.5 mt-1 rounded-full" style={{background:bandColor(q.score)}}/>
                <div className="flex-1">
                  <div className="text-[13px] leading-snug">{q.text}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {labelFromScore(q.score)} • Score {q.score}/4 • {q.cat_name}
                    {" — "}
                    {q.score<=1?"Start basics now.":q.score===2?"Stabilize process.":q.score===3?"Make it consistent.":"Keep auditing."}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 mt-3">Legend: 0–1 = Critical/Weak, 2 = Needs Work, 3–4 = OK/Strong</div>
        </Card>
      </div>

      {/* AI summary */}
      <div className="mx-auto max-w-6xl px-4 mt-8">
        <Card>
          <div className="flex items-center justify-between">
            <Title>Personalized Summary</Title>
            <button onClick={handleAI} disabled={loadingAI} className="no-print btn">{loadingAI?"Generating…":"Generate with AI"}</button>
          </div>
          <div className="mt-3 text-sm whitespace-pre-line">
            {aiText || `Score ${k.p}% (Grade ${k.grade}, ${k.risk} risk). Savings in 90 days: ${money(k.conservative)} – ${money(k.stretch)}.`}
          </div>
        </Card>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-6xl px-4 my-10">
        <div className="rounded-2xl p-6 text-white" style={{background:"linear-gradient(90deg,#F5B301,#FF7E3E)"}}>
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

/* UI helpers */
function Card({children,className}){return <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 ${className||""}`}>{children}</div>}
function Title({children}){return <div className="text-sm font-semibold mb-3">{children}</div>}
function Kpi({title,value,sub,pill}){return(
  <Card>
    <div className="text-xs text-slate-500">{title}</div>
    <div className="mt-1 text-xl font-extrabold">{value}</div>
    {sub&&<div className="mt-1 inline-flex text-[11px] px-2 py-0.5 rounded-full text-white" style={{background:pill||BRAND.blue}}>{sub}</div>}
  </Card>
)}

/* Simple SVG radar (no library) */
function Radar({values=[],labels=[]}){
  const N=values.length; const R=80; const CX=120, CY=100;
  function point(i,scale=1){
    const a=(-Math.PI/2)+(2*Math.PI*i/N);
    return [CX+R*scale*Math.cos(a), CY+R*scale*Math.sin(a)];
  }
  const rings=[0.25,0.5,0.75,1];
  const poly=values.map((v,i)=>point(i,Math.max(0,Math.min(1,v)))).map(([x,y])=>`${x},${y}`).join(" ");
  return (
    <svg viewBox="0 0 240 200" className="w-full">
      {/* grid rings */}
      {rings.map((r,idx)=>(
        <polygon key={idx} points={Array.from({length:N}).map((_,i)=>point(i,r)).map(([x,y])=>`${x},${y}`).join(" ")}
                 fill="none" stroke="#E5E7EB" strokeWidth="1"/>
      ))}
      {/* axes */}
      {labels.map((lab,i)=>{
        const [x,y]=point(i,1); return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#E5E7EB" strokeWidth="1"/>; })}
      {/* data */}
      <polygon points={poly} fill="#0B3B8C22" stroke="#0B3B8C" strokeWidth="2"/>
      {/* labels */}
      {labels.map((lab,i)=>{const [x,y]=point(i,1.15); return <text key={i} x={x} y={y} textAnchor="middle" fontSize="10" fill="#334155">{lab}</text>;})}
    </svg>
  );
}

/* Demo fallback only if API/env missing */
const demoFallback={
  company:"Demo Factory",assessed_at:new Date().toISOString(),
  overall:{score:112,max:240},distribution:{red:18,amber:26,green:16},
  categories:[
    {key:"quality",name:"Quality",avg:2.1,max:4,top_issue:"Inline DHU is missing"},
    {key:"production",name:"Production",avg:2.4,max:4,top_issue:"No hourly review"},
    {key:"ie",name:"IE",avg:1.9,max:4,top_issue:"No OB/SMV discipline"},
    {key:"planning",name:"Planning",avg:2.0,max:4,top_issue:"Fabric lead time high"},
    {key:"hr",name:"HR & Culture",avg:2.3,max:4,top_issue:"No performance rhythm"},
    {key:"compliance",name:"Compliance",avg:3.2,max:4,top_issue:"Audits can tighten"},
    {key:"costing",name:"Costing/Finance",avg:1.8,max:4,top_issue:"Poor BOM control"},
  ],
  questions:Array.from({length:24}).map((_,i)=>({id:i+1,text:`Sample question ${i+1}`,cat:"quality",cat_name:"Quality",score:[0,1,2,3,4][i%5]})),
  savings:[
    {key:"quality",name:"Quality",value:4500000,gap:0.48},
    {key:"production",name:"Production",value:3000000,gap:0.40},
    {key:"ie",name:"IE",value:2200000,gap:0.53},
    {key:"planning",name:"Planning",value:2000000,gap:0.50},
    {key:"hr",name:"HR & Culture",value:1500000,gap:0.43},
    {key:"costing",name:"Costing/Finance",value:1000000,gap:0.55},
    {key:"compliance",name:"Compliance",value:800000,gap:0.20},
  ]
};
