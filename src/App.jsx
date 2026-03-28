import { useState, useEffect } from "react";

const translations = {
  title: "FitKalkulator",
  subtitle: "Tvoj lični zdravstveni asistent",
  darkMode: "Tamni",
  lightMode: "Svetli",
  gender: "Pol",
  male: "Muški",
  female: "Ženski",
  age: "Godine",
  height: "Visina (cm)",
  weight: "Težina (kg)",
  activity: "Nivo aktivnosti",
  activities: [
    { value: 1.2, label: "Sedentaran (bez vežbanja)" },
    { value: 1.375, label: "Lako aktivan (1–3 dana/ned.)" },
    { value: 1.55, label: "Umereno aktivan (3–5 dana/ned.)" },
    { value: 1.725, label: "Jako aktivan (6–7 dana/ned.)" },
    { value: 1.9, label: "Ekstremno aktivan (fizički posao)" },
  ],
  calculate: "Izračunaj",
  results: "Rezultati",
  bmi: "BMI Indeks",
  calories: "Dnevne kalorije",
  steps: "Preporučeni koraci",
  perDay: "/ dan",
  perDayKcal: "kcal / dan",
  reset: "Resetuj",
};

const getBMICategory = (bmi, gender) => {
  if (bmi < 18.5) return { label: "Pothranjenost", color: "#3b82f6", emoji: "⚠️" };
  if (bmi < 25) return { label: "Normalna težina", color: "#22c55e", emoji: "✅" };
  if (bmi < 30) return { label: "Prekomerna težina", color: "#f59e0b", emoji: "⚠️" };
  return { label: "Gojaznost", color: "#ef4444", emoji: "🔴" };
};

const getAnalysis = (bmi, calories, steps, gender, age, activity) => {
  const bmiCat = getBMICategory(bmi, gender);
  const tips = [];

  if (bmi < 18.5) {
    tips.push({ type: "bad", text: "Tvoja telesna masa je ispod preporučene norme. Povećaj unos hranljivih namirnica bogatih proteinima i zdravim mastima." });
    tips.push({ type: "tip", text: "Konzultuj se sa nutricionistom da napraviš plan ishrane koji ti odgovara." });
  } else if (bmi < 25) {
    tips.push({ type: "good", text: "Odlično! Tvoja telesna masa je u idealnom opsegu. Nastavi sa trenutnim stilom života." });
    tips.push({ type: "tip", text: "Fokusiraj se na održavanje ove ravnoteže kroz redovnu fizičku aktivnost i uravnoteženu ishranu." });
  } else if (bmi < 30) {
    tips.push({ type: "bad", text: "Telesna masa je malo iznad preporučene. Pokušaj da postepeno smanjiš unos kalorija za 200–300 kcal dnevno." });
    tips.push({ type: "tip", text: "Uvedi šetnju od barem 30 minuta dnevno i smanjiti procesiranu hranu." });
  } else {
    tips.push({ type: "bad", text: "BMI ukazuje na gojaznost. Preporučuje se konsultacija sa lekarom ili nutricionistom." });
    tips.push({ type: "bad", text: "Gojaznost povećava rizik od dijabetesa tipa 2, srčanih bolesti i problema sa zglobovima." });
    tips.push({ type: "tip", text: "Mali koraci su važni – počni sa dnevnim šetnjama i postepeno smanjuj porcije." });
  }

  if (activity === 1.2) {
    tips.push({ type: "bad", text: "Sedentaran način života negativno utiče na zdravlje. Pokušaj da uneseš barem 20–30 min kretanja dnevno." });
  }

  if (age > 50) {
    tips.push({ type: "tip", text: "Sa godinama je važno uključiti vežbe snage i istezanja za zdravlje kostiju i zglobova." });
  }

  if (steps >= 10000) {
    tips.push({ type: "good", text: "Preporučenih 10.000 koraka dnevno je u dosegu! Ovaj cilj pomiruje kardiovaskularno zdravlje." });
  }

  return tips;
};

export default function App() {
  const [dark, setDark] = useState(true);
  const [form, setForm] = useState({ gender: "male", age: "", height: "", weight: "", activity: 1.55 });
  const [results, setResults] = useState(null);
  const [animating, setAnimating] = useState(false);

  const theme = {
    bg: dark ? "#0a0a0a" : "#f5f5f0",
    card: dark ? "#111111" : "#ffffff",
    cardBorder: dark ? "#1a2a1a" : "#e0ede0",
    text: dark ? "#e8f5e8" : "#0d1a0d",
    textMuted: dark ? "#6b8f6b" : "#4a6b4a",
    accent: "#22c55e",
    accentDark: "#16a34a",
    accentGlow: dark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.08)",
    input: dark ? "#0d1a0d" : "#f0faf0",
    inputBorder: dark ? "#1e3a1e" : "#c8e6c8",
    inputFocus: "#22c55e",
    badBg: dark ? "#1a0a0a" : "#fff0f0",
    badColor: "#ef4444",
    goodBg: dark ? "#0a1a0a" : "#f0fff0",
    goodColor: "#22c55e",
    tipBg: dark ? "#0a120f" : "#f0f9f4",
    tipColor: dark ? "#6ee7b7" : "#047857",
    toggleBg: dark ? "#1a2a1a" : "#e8f5e8",
  };

  const calculate = () => {
    const { gender, age, height, weight, activity } = form;
    if (!age || !height || !weight) return;

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);
    const act = parseFloat(activity);

    const bmi = w / ((h / 100) * (h / 100));

    let bmr;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }
    const calories = Math.round(bmr * act);

    let steps;
    if (act <= 1.2) steps = 6000;
    else if (act <= 1.375) steps = 8000;
    else if (act <= 1.55) steps = 10000;
    else if (act <= 1.725) steps = 12000;
    else steps = 15000;

    setAnimating(true);
    setTimeout(() => {
      setResults({ bmi: bmi.toFixed(1), calories, steps, gender, age: a, activity: act });
      setAnimating(false);
    }, 300);
  };

  const valid = form.age && form.height && form.weight;
  const bmiCat = results ? getBMICategory(parseFloat(results.bmi)) : null;
  const tips = results ? getAnalysis(parseFloat(results.bmi), results.calories, results.steps, results.gender, results.age, results.activity) : [];

  const bmiPercent = results ? Math.min(Math.max(((parseFloat(results.bmi) - 10) / 30) * 100, 0), 100) : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: theme.text,
      transition: "all 0.4s ease",
      padding: "0 0 60px 0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select { outline: none; }
        input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .card { transition: all 0.3s ease; }
        .card:hover { transform: translateY(-2px); }
        .btn-calc {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 16px 40px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          letter-spacing: 0.5px;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-calc:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 8px 30px rgba(34,197,94,0.35); }
        .btn-calc:disabled { opacity: 0.4; cursor: not-allowed; }
        .result-card { animation: slideUp 0.4s ease forwards; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tip-item { animation: fadeIn 0.3s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .toggle-btn {
          border: none;
          cursor: pointer;
          border-radius: 20px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.3px;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .toggle-btn:hover { transform: scale(1.05); }
        label { font-size: 13px; font-weight: 500; letter-spacing: 0.3px; opacity: 0.75; display: block; margin-bottom: 6px; }
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          transition: all 0.2s ease;
          appearance: none;
        }
        .input-field:focus { box-shadow: 0 0 0 2px #22c55e; }
        .gender-btn {
          flex: 1;
          padding: 11px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.2px;
        }
        .bmi-bar-track {
          height: 8px;
          border-radius: 100px;
          background: linear-gradient(to right, #3b82f6 0%, #22c55e 40%, #f59e0b 70%, #ef4444 100%);
          position: relative;
          margin-top: 10px;
        }
        .bmi-marker {
          position: absolute;
          top: -4px;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          border: 3px solid;
          transform: translateX(-50%);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .stat-number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 38px;
          font-weight: 700;
          line-height: 1;
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: dark ? "linear-gradient(180deg, #0d1a0d 0%, #0a0a0a 100%)" : "linear-gradient(180deg, #e8f5e8 0%, #f5f5f0 100%)",
        borderBottom: `1px solid ${theme.cardBorder}`,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(10px)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>💪</div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: theme.accent }}>
              FitKalkulator
            </span>
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2, marginLeft: 42 }}>
            Tvoj lični zdravstveni asistent
          </div>
        </div>
        <button
          className="toggle-btn"
          onClick={() => setDark(!dark)}
          style={{
            background: theme.toggleBg,
            color: theme.text,
            border: `1px solid ${theme.cardBorder}`,
          }}
        >
          {dark ? "☀️ Svetli" : "🌙 Tamni"}
        </button>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px 0" }}>

        {/* SEO Hero */}
        <div style={{
          background: dark ? "linear-gradient(135deg, #0d1f0d, #0a150a)" : "linear-gradient(135deg, #e8f5e8, #d4ecd4)",
          border: `1px solid ${dark ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.3)"}`,
          borderLeft: "4px solid #22c55e",
          borderRadius: 16,
          padding: "20px 22px",
          marginBottom: 16,
        }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: theme.accent, marginBottom: 10, lineHeight: 1.3 }}>
            Izračunaj koliko kalorija ti je potrebno na dnevnom nivou
          </h1>
          <p style={{ fontSize: 13.5, lineHeight: 1.65, color: theme.textMuted, margin: 0 }}>
            Unesi pol, godine, visinu, težinu i nivo aktivnosti — za nekoliko sekundi dobij <strong style={{ color: theme.text, fontWeight: 600 }}>BMI indeks</strong>, <strong style={{ color: theme.text, fontWeight: 600 }}>dnevni kalorijski unos</strong> za održavanje kilaže, lagani bulk ili cut, kao i <strong style={{ color: theme.text, fontWeight: 600 }}>preporučeni broj koraka</strong>. Kalkulacije su bazirane na Mifflin-St Jeor formuli i prilagođene tvom profilu.
          </p>
        </div>

        {/* Input Card */}
        <div className="card" style={{
          background: theme.card,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: 20,
          padding: "24px",
          marginBottom: 16,
          boxShadow: dark ? "0 4px 40px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.accent, letterSpacing: 1, marginBottom: 20, textTransform: "uppercase" }}>
            Uneси podatke
          </div>

          {/* Gender */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: theme.textMuted }}>Pol</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ v: "male", l: "♂ Muški" }, { v: "female", l: "♀ Ženski" }].map(g => (
                <button
                  key={g.v}
                  className="gender-btn"
                  onClick={() => setForm({ ...form, gender: g.v })}
                  style={{
                    background: form.gender === g.v ? "linear-gradient(135deg, #22c55e, #16a34a)" : theme.input,
                    color: form.gender === g.v ? "white" : theme.textMuted,
                    border: form.gender === g.v ? "none" : `1px solid ${theme.inputBorder}`,
                  }}
                >{g.l}</button>
              ))}
            </div>
          </div>

          {/* Age + Height row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
            {[
              { key: "age", label: "Godine", placeholder: "25", min: 10, max: 100 },
              { key: "height", label: "Visina (cm)", placeholder: "175", min: 100, max: 250 },
            ].map(f => (
              <div key={f.key}>
                <label style={{ color: theme.textMuted }}>{f.label}</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  min={f.min} max={f.max}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  onBlur={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setForm({ ...form, [f.key]: String(Math.max(f.min, Math.min(f.max, v))) }); }}
                  style={{
                    background: theme.input,
                    border: `1px solid ${theme.inputBorder}`,
                    color: theme.text,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Weight */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: theme.textMuted }}>Težina (kg)</label>
            <input
              className="input-field"
              type="number"
              placeholder="70"
              value={form.weight}
              onChange={e => setForm({ ...form, weight: e.target.value })}
              onBlur={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setForm({ ...form, weight: String(Math.max(20, Math.min(300, v))) }); }}
              style={{
                background: theme.input,
                border: `1px solid ${theme.inputBorder}`,
                color: theme.text,
              }}
            />
          </div>

          {/* Activity */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: theme.textMuted }}>Nivo aktivnosti</label>
            <select
              className="input-field"
              value={form.activity}
              onChange={e => setForm({ ...form, activity: e.target.value })}
              style={{
                background: theme.input,
                border: `1px solid ${theme.inputBorder}`,
                color: theme.text,
                cursor: "pointer",
              }}
            >
              {translations.activities.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          <button className="btn-calc" onClick={calculate} disabled={!valid}>
            {valid ? "⚡ Izračunaj" : "Popuni sva polja"}
          </button>
        </div>

        {/* Results */}
        {results && !animating && (
          <>
            {/* Stats Row */}
            <div className="result-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "BMI", value: results.bmi, unit: "", sub: bmiCat?.label, color: bmiCat?.color },
                { label: "Koraci", value: (results.steps / 1000).toFixed(0) + "k", unit: "", sub: "dnevni cilj", color: "#60a5fa" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: theme.card,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: 16,
                  padding: "16px 12px",
                  textAlign: "center",
                  boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500, marginBottom: 6, letterSpacing: 0.5 }}>
                    {s.label}
                  </div>
                  <div className="stat-number" style={{ color: s.color, fontSize: 26 }}>
                    {s.value}<span style={{ fontSize: 11, fontWeight: 400, color: theme.textMuted, marginLeft: 2 }}>{s.unit}</span>
                  </div>
                  <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Calorie Goals Card */}
            <div className="result-card" style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 16,
              padding: "18px 20px",
              marginBottom: 16,
              boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.accent, letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>
                Kalorijski ciljevi
              </div>
              {[
                {
                  label: "Održavanje kilаže",
                  kcal: results.calories,
                  icon: "⚖️",
                  desc: "Unosom ove količine ostaješ na trenutnoj težini.",
                  color: theme.accent,
                  barColor: "#22c55e",
                  bg: dark ? "rgba(34,197,94,0.07)" : "rgba(34,197,94,0.06)",
                  border: "rgba(34,197,94,0.2)",
                },
                {
                  label: "Lagani bulk (+250 kcal)",
                  kcal: results.calories + 250,
                  icon: "📈",
                  desc: "Blagi suficit za postepeno dobijanje mišićne mase.",
                  color: "#60a5fa",
                  barColor: "#3b82f6",
                  bg: dark ? "rgba(96,165,250,0.07)" : "rgba(59,130,246,0.05)",
                  border: "rgba(96,165,250,0.2)",
                },
                {
                  label: "Lagani cut (−300 kcal)",
                  kcal: results.calories - 300,
                  icon: "📉",
                  desc: "Blagi deficit za postepeno mršavljenje bez gubitka mišića.",
                  color: "#f59e0b",
                  barColor: "#f59e0b",
                  bg: dark ? "rgba(245,158,11,0.07)" : "rgba(245,158,11,0.05)",
                  border: "rgba(245,158,11,0.2)",
                },
              ].map((goal, i) => (
                <div key={i} style={{
                  background: goal.bg,
                  border: `1px solid ${goal.border}`,
                  borderRadius: 12,
                  padding: "13px 15px",
                  marginBottom: i < 2 ? 10 : 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{goal.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{goal.label}</span>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: goal.color, flexShrink: 0 }}>
                        {goal.kcal} <span style={{ fontSize: 11, fontWeight: 400, color: theme.textMuted }}>kcal</span>
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 3, lineHeight: 1.4 }}>{goal.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* BMI Bar */}
            <div className="result-card" style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 16,
              padding: "18px 20px",
              marginBottom: 16,
              boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>BMI Skala</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: bmiCat?.color }}>
                  {bmiCat?.emoji} {bmiCat?.label}
                </span>
              </div>
              <div className="bmi-bar-track">
                <div className="bmi-marker" style={{ left: `${bmiPercent}%`, borderColor: bmiCat?.color }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: theme.textMuted }}>
                <span>Pothranj.</span><span>Normalno</span><span>Prekomerno</span><span>Gojazno</span>
              </div>
            </div>

            {/* Analysis */}
            <div className="result-card" style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 16,
              padding: "18px 20px",
              marginBottom: 16,
              boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.accent, letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>
                Analiza i preporuke
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tips.map((tip, i) => (
                  <div key={i} className="tip-item" style={{
                    background: tip.type === "good" ? theme.goodBg : tip.type === "bad" ? theme.badBg : theme.tipBg,
                    border: `1px solid ${tip.type === "good" ? "rgba(34,197,94,0.2)" : tip.type === "bad" ? "rgba(239,68,68,0.2)" : "rgba(110,231,183,0.15)"}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    color: tip.type === "good" ? theme.goodColor : tip.type === "bad" ? theme.badColor : theme.tipColor,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>
                      {tip.type === "good" ? "✅" : tip.type === "bad" ? "⚠️" : "💡"}
                    </span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setResults(null); setForm({ gender: "male", age: "", height: "", weight: "", activity: 1.55 }); }}
              style={{
                width: "100%",
                padding: "14px",
                background: "transparent",
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: 14,
                color: theme.textMuted,
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.target.style.borderColor = theme.accent}
              onMouseLeave={e => e.target.style.borderColor = theme.cardBorder}
            >
              ↺ Resetuj
            </button>
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", color: theme.textMuted, fontSize: 11, marginTop: 32, lineHeight: 1.6 }}>
          Rezultati su orijentacioni i ne zamenjuju savet lekara ili nutricioniste.
        </div>
      </div>
    </div>
  );
}