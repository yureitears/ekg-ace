export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Category =
  | "Arrhythmias"
  | "Ischemia"
  | "Conduction Blocks"
  | "Electrolytes"
  | "Hypertrophy"
  | "Pre-excitation"
  | "Pericardial";

// Waveform "kind" tells the SVG renderer what to draw.
export type WaveformKind =
  | "nsr"
  | "afib"
  | "aflutter"
  | "vtach"
  | "vfib"
  | "stemi-anterior"
  | "stemi-inferior"
  | "lbbb"
  | "rbbb"
  | "first-degree-av"
  | "third-degree-av"
  | "wpw"
  | "hyperkalemia"
  | "hypokalemia"
  | "pericarditis"
  | "lvh"
  | "asystole"
  | "torsades"
  | "svt"
  | "bradycardia"
  | "pvcs";

export interface ECGCase {
  id: string;
  diagnosis: string;
  aliases: string[]; // accepted free-text answers (lowercase)
  options: string[]; // multiple-choice
  difficulty: Difficulty;
  category: Category;
  waveform: WaveformKind;
  rate: number;
  rhythm: string;
  intervals: { pr: string; qrs: string; qt: string };
  hints: string[];
  explanation: string;
  keyPoints: string[];
}

export const CASES: ECGCase[] = [
  {
    id: "c01",
    diagnosis: "Atrial Fibrillation",
    aliases: ["atrial fibrillation", "afib", "a-fib", "af"],
    options: ["Atrial Fibrillation", "Atrial Flutter", "Sinus Tachycardia", "Multifocal Atrial Tachycardia"],
    difficulty: "beginner",
    category: "Arrhythmias",
    waveform: "afib",
    rate: 128,
    rhythm: "Irregularly irregular",
    intervals: { pr: "—", qrs: "88 ms", qt: "320 ms" },
    hints: [
      "Rhythm is irregularly irregular",
      "No discernible P waves",
      "Narrow QRS complexes",
    ],
    explanation:
      "The absence of P waves with an irregularly irregular ventricular response and a fibrillatory baseline is diagnostic of atrial fibrillation. Rate control and anticoagulation (per CHA₂DS₂-VASc) are the cornerstones of management.",
    keyPoints: [
      "Irregularly irregular ventricular rhythm",
      "Absent P waves, fibrillatory baseline",
      "Assess stroke risk (CHA₂DS₂-VASc)",
    ],
  },
  {
    id: "c02",
    diagnosis: "Atrial Flutter",
    aliases: ["atrial flutter", "aflutter", "a-flutter"],
    options: ["Atrial Fibrillation", "Atrial Flutter", "AVNRT", "Sinus Rhythm"],
    difficulty: "beginner",
    category: "Arrhythmias",
    waveform: "aflutter",
    rate: 150,
    rhythm: "Regular, sawtooth flutter waves",
    intervals: { pr: "—", qrs: "90 ms", qt: "300 ms" },
    hints: ["Sawtooth flutter waves in inferior leads", "Atrial rate ~300 bpm", "Often 2:1 conduction"],
    explanation:
      "Classic sawtooth flutter waves at ~300 bpm with 2:1 AV conduction yielding a ventricular rate of ~150 bpm. Cavotricuspid isthmus ablation is highly effective.",
    keyPoints: ["Sawtooth pattern in II/III/aVF", "Atrial rate 250–350", "Rate control + anticoagulation"],
  },
  {
    id: "c03",
    diagnosis: "Ventricular Tachycardia",
    aliases: ["ventricular tachycardia", "vtach", "vt", "v-tach"],
    options: ["SVT with aberrancy", "Ventricular Tachycardia", "Atrial Flutter", "Sinus Tachycardia"],
    difficulty: "intermediate",
    category: "Arrhythmias",
    waveform: "vtach",
    rate: 180,
    rhythm: "Regular wide-complex tachycardia",
    intervals: { pr: "—", qrs: "160 ms", qt: "—" },
    hints: ["Wide QRS > 120 ms", "Regular and fast", "AV dissociation may be present"],
    explanation:
      "Monomorphic VT — a regular, wide-complex tachycardia originating from the ventricles. Unstable patients require synchronized cardioversion; stable patients may receive amiodarone or procainamide.",
    keyPoints: ["Wide QRS tachycardia", "Cardiovert if unstable", "Search for ischemia/structural cause"],
  },
  {
    id: "c04",
    diagnosis: "Ventricular Fibrillation",
    aliases: ["ventricular fibrillation", "vfib", "vf", "v-fib"],
    options: ["Asystole", "Ventricular Fibrillation", "Torsades de Pointes", "Atrial Fibrillation"],
    difficulty: "beginner",
    category: "Arrhythmias",
    waveform: "vfib",
    rate: 0,
    rhythm: "Chaotic, no organized complexes",
    intervals: { pr: "—", qrs: "—", qt: "—" },
    hints: ["Chaotic baseline", "No identifiable QRS", "Patient is pulseless"],
    explanation:
      "Ventricular fibrillation: chaotic electrical activity with no effective cardiac output. Immediate defibrillation and high-quality CPR per ACLS.",
    keyPoints: ["Defibrillate immediately", "High-quality CPR", "Reversible causes (Hs & Ts)"],
  },
  {
    id: "c05",
    diagnosis: "Anterior STEMI",
    aliases: ["anterior stemi", "anterior mi", "stemi", "anterior wall mi"],
    options: ["Anterior STEMI", "Inferior STEMI", "Pericarditis", "LBBB"],
    difficulty: "intermediate",
    category: "Ischemia",
    waveform: "stemi-anterior",
    rate: 92,
    rhythm: "Sinus",
    intervals: { pr: "160 ms", qrs: "92 ms", qt: "400 ms" },
    hints: ["ST elevation in V1–V4", "Reciprocal changes inferiorly", "LAD territory"],
    explanation:
      "Convex ST elevation across the precordial leads (V1–V4) indicates an anterior STEMI from LAD occlusion. Activate the cath lab for primary PCI.",
    keyPoints: ["ST↑ V1–V4", "LAD occlusion", "Door-to-balloon < 90 min"],
  },
  {
    id: "c06",
    diagnosis: "Inferior STEMI",
    aliases: ["inferior stemi", "inferior mi", "rca occlusion"],
    options: ["Inferior STEMI", "Anterior STEMI", "Pericarditis", "Early Repolarization"],
    difficulty: "intermediate",
    category: "Ischemia",
    waveform: "stemi-inferior",
    rate: 58,
    rhythm: "Sinus bradycardia",
    intervals: { pr: "180 ms", qrs: "94 ms", qt: "420 ms" },
    hints: ["ST elevation in II, III, aVF", "Reciprocal depression in I, aVL", "Check right-sided leads"],
    explanation:
      "ST elevation in inferior leads (II, III, aVF) with reciprocal depression in aVL indicates inferior STEMI, usually from RCA occlusion. Get right-sided leads to assess RV involvement; avoid nitrates if so.",
    keyPoints: ["ST↑ II/III/aVF", "RCA territory", "Beware RV infarct — nitrate-sensitive"],
  },
  {
    id: "c07",
    diagnosis: "Left Bundle Branch Block",
    aliases: ["lbbb", "left bundle branch block"],
    options: ["LBBB", "RBBB", "Anterior STEMI", "LVH"],
    difficulty: "intermediate",
    category: "Conduction Blocks",
    waveform: "lbbb",
    rate: 76,
    rhythm: "Sinus",
    intervals: { pr: "170 ms", qrs: "150 ms", qt: "440 ms" },
    hints: ["QRS > 120 ms", "Broad notched R in I, V6", "QS or rS in V1"],
    explanation:
      "Wide QRS with broad notched R waves in lateral leads (I, aVL, V5–V6) and dominant S in V1 — classic LBBB. New LBBB with chest pain warrants STEMI-equivalent evaluation (Sgarbossa criteria).",
    keyPoints: ["QRS ≥ 120 ms", "Broad R in I/V6", "Sgarbossa for ischemia"],
  },
  {
    id: "c08",
    diagnosis: "Right Bundle Branch Block",
    aliases: ["rbbb", "right bundle branch block"],
    options: ["RBBB", "LBBB", "WPW", "Hyperkalemia"],
    difficulty: "intermediate",
    category: "Conduction Blocks",
    waveform: "rbbb",
    rate: 78,
    rhythm: "Sinus",
    intervals: { pr: "160 ms", qrs: "140 ms", qt: "400 ms" },
    hints: ["QRS > 120 ms", "rSR' (\"rabbit ears\") in V1", "Wide S in I and V6"],
    explanation:
      "Wide QRS with rSR' pattern in V1 and broad terminal S in lateral leads — RBBB. Often benign in isolation but search for underlying cause (PE, ischemia, structural disease).",
    keyPoints: ["rSR' in V1", "Wide S in I/V6", "Often incidental"],
  },
  {
    id: "c09",
    diagnosis: "First-Degree AV Block",
    aliases: ["first degree av block", "1st degree av block", "first-degree heart block"],
    options: ["First-Degree AV Block", "Second-Degree AV Block", "Third-Degree AV Block", "Sinus Rhythm"],
    difficulty: "beginner",
    category: "Conduction Blocks",
    waveform: "first-degree-av",
    rate: 70,
    rhythm: "Sinus with prolonged PR",
    intervals: { pr: "260 ms", qrs: "92 ms", qt: "400 ms" },
    hints: ["PR > 200 ms", "Every P followed by QRS", "Constant PR interval"],
    explanation:
      "Constant PR interval > 200 ms with 1:1 conduction defines first-degree AV block. Usually benign and observed.",
    keyPoints: ["PR > 200 ms", "1:1 conduction", "Generally benign"],
  },
  {
    id: "c10",
    diagnosis: "Third-Degree AV Block",
    aliases: ["third degree av block", "complete heart block", "3rd degree av block", "complete av block"],
    options: ["Third-Degree AV Block", "Mobitz I", "Mobitz II", "First-Degree AV Block"],
    difficulty: "advanced",
    category: "Conduction Blocks",
    waveform: "third-degree-av",
    rate: 38,
    rhythm: "AV dissociation",
    intervals: { pr: "varies", qrs: "120 ms", qt: "—" },
    hints: ["P waves and QRS independent", "Slow ventricular escape", "AV dissociation"],
    explanation:
      "Complete AV dissociation: atria and ventricles fire independently, with a slow escape rhythm. Requires transcutaneous/transvenous pacing and pacemaker placement.",
    keyPoints: ["AV dissociation", "Escape rhythm", "Pacing indicated"],
  },
  {
    id: "c11",
    diagnosis: "Wolff-Parkinson-White",
    aliases: ["wpw", "wolff-parkinson-white", "wolff parkinson white", "pre-excitation"],
    options: ["WPW", "LBBB", "RBBB", "Hyperkalemia"],
    difficulty: "advanced",
    category: "Pre-excitation",
    waveform: "wpw",
    rate: 84,
    rhythm: "Sinus with pre-excitation",
    intervals: { pr: "90 ms", qrs: "130 ms", qt: "400 ms" },
    hints: ["Short PR < 120 ms", "Delta wave (slurred QRS upstroke)", "Wide QRS"],
    explanation:
      "Short PR, delta wave, and wide QRS — pre-excitation via accessory pathway (Bundle of Kent). Avoid AV-nodal blockers in atrial fibrillation with WPW; consider ablation.",
    keyPoints: ["Short PR + delta wave", "Avoid AV-nodal blockers in AF + WPW", "Definitive: ablation"],
  },
  {
    id: "c12",
    diagnosis: "Hyperkalemia",
    aliases: ["hyperkalemia", "high potassium", "hyperk"],
    options: ["Hyperkalemia", "Hypokalemia", "Hypocalcemia", "Pericarditis"],
    difficulty: "intermediate",
    category: "Electrolytes",
    waveform: "hyperkalemia",
    rate: 72,
    rhythm: "Sinus",
    intervals: { pr: "200 ms", qrs: "140 ms", qt: "360 ms" },
    hints: ["Peaked T waves", "Widened QRS", "Flattened/absent P waves"],
    explanation:
      "Peaked T waves and progressive QRS widening with P-wave flattening suggest hyperkalemia. Treat with calcium gluconate (membrane stabilization), insulin/dextrose, and definitive K⁺ removal.",
    keyPoints: ["Peaked T → wide QRS → sine wave", "Calcium first", "Shift then remove K⁺"],
  },
  {
    id: "c13",
    diagnosis: "Hypokalemia",
    aliases: ["hypokalemia", "low potassium", "hypok"],
    options: ["Hypokalemia", "Hyperkalemia", "Hypercalcemia", "Digoxin Effect"],
    difficulty: "intermediate",
    category: "Electrolytes",
    waveform: "hypokalemia",
    rate: 86,
    rhythm: "Sinus",
    intervals: { pr: "170 ms", qrs: "90 ms", qt: "480 ms" },
    hints: ["Flattened T waves", "Prominent U waves", "QT prolongation"],
    explanation:
      "Flattened T waves with prominent U waves and ST depression suggest hypokalemia. Repletion with potassium (and magnesium) addresses the cause.",
    keyPoints: ["Flat T + U waves", "QT prolongation risk", "Replete K⁺ and Mg²⁺"],
  },
  {
    id: "c14",
    diagnosis: "Acute Pericarditis",
    aliases: ["pericarditis", "acute pericarditis"],
    options: ["Pericarditis", "Anterior STEMI", "Early Repolarization", "LBBB"],
    difficulty: "advanced",
    category: "Pericardial",
    waveform: "pericarditis",
    rate: 96,
    rhythm: "Sinus",
    intervals: { pr: "150 ms", qrs: "88 ms", qt: "380 ms" },
    hints: ["Diffuse concave ST elevation", "PR depression", "No reciprocal changes"],
    explanation:
      "Diffuse concave ST elevation with PR-segment depression and no reciprocal changes is classic for acute pericarditis. Treat with NSAIDs + colchicine.",
    keyPoints: ["Diffuse ST↑, PR↓", "No reciprocal change", "NSAIDs + colchicine"],
  },
  {
    id: "c15",
    diagnosis: "Left Ventricular Hypertrophy",
    aliases: ["lvh", "left ventricular hypertrophy"],
    options: ["LVH", "LBBB", "Anterior STEMI", "RBBB"],
    difficulty: "intermediate",
    category: "Hypertrophy",
    waveform: "lvh",
    rate: 74,
    rhythm: "Sinus",
    intervals: { pr: "165 ms", qrs: "100 ms", qt: "420 ms" },
    hints: ["Tall R in V5/V6, deep S in V1/V2", "Sokolow-Lyon: S(V1) + R(V5/6) > 35 mm", "Strain pattern in lateral leads"],
    explanation:
      "Voltage criteria positive (Sokolow-Lyon) with lateral strain pattern — LVH. Common with longstanding hypertension; assess for end-organ disease.",
    keyPoints: ["Sokolow-Lyon ≥ 35 mm", "Strain pattern", "Treat underlying HTN"],
  },
  {
    id: "c16",
    diagnosis: "Asystole",
    aliases: ["asystole", "flatline"],
    options: ["Asystole", "Ventricular Fibrillation", "PEA", "Sinus Bradycardia"],
    difficulty: "beginner",
    category: "Arrhythmias",
    waveform: "asystole",
    rate: 0,
    rhythm: "Absent",
    intervals: { pr: "—", qrs: "—", qt: "—" },
    hints: ["Flat line on multiple leads", "Confirm in two leads", "Check leads/gain"],
    explanation:
      "Asystole: no electrical activity. Non-shockable rhythm — high-quality CPR, epinephrine, and search for reversible causes (Hs & Ts).",
    keyPoints: ["Non-shockable", "CPR + epi", "Hs & Ts"],
  },
  {
    id: "c17",
    diagnosis: "Torsades de Pointes",
    aliases: ["torsades", "torsades de pointes", "tdp", "polymorphic vt"],
    options: ["Torsades de Pointes", "Ventricular Fibrillation", "Monomorphic VT", "Atrial Fibrillation"],
    difficulty: "advanced",
    category: "Arrhythmias",
    waveform: "torsades",
    rate: 220,
    rhythm: "Polymorphic VT, twisting axis",
    intervals: { pr: "—", qrs: "varies", qt: "prolonged baseline" },
    hints: ["Twisting of QRS around baseline", "Long QT precedes onset", "Often drug or electrolyte induced"],
    explanation:
      "Polymorphic VT with QRS amplitude twisting around the isoelectric line — Torsades de Pointes. IV magnesium sulfate is first-line; correct hypokalemia and remove offending drugs.",
    keyPoints: ["Twisting QRS", "IV Mg²⁺", "Address QT-prolonging drugs"],
  },
  {
    id: "c18",
    diagnosis: "Supraventricular Tachycardia",
    aliases: ["svt", "supraventricular tachycardia", "avnrt"],
    options: ["SVT", "Sinus Tachycardia", "Atrial Flutter", "VT"],
    difficulty: "beginner",
    category: "Arrhythmias",
    waveform: "svt",
    rate: 180,
    rhythm: "Regular narrow-complex tachycardia",
    intervals: { pr: "—", qrs: "84 ms", qt: "280 ms" },
    hints: ["Narrow QRS, regular", "Rate 150–250", "P waves often hidden"],
    explanation:
      "Regular narrow-complex tachycardia without visible P waves — most often AVNRT. Vagal maneuvers, then adenosine; cardiovert if unstable.",
    keyPoints: ["Narrow regular SVT", "Vagal → adenosine", "Cardiovert if unstable"],
  },
  {
    id: "c19",
    diagnosis: "Sinus Bradycardia",
    aliases: ["sinus bradycardia", "bradycardia"],
    options: ["Sinus Bradycardia", "Third-Degree AV Block", "Junctional Rhythm", "Sinus Rhythm"],
    difficulty: "beginner",
    category: "Arrhythmias",
    waveform: "bradycardia",
    rate: 44,
    rhythm: "Sinus, slow",
    intervals: { pr: "180 ms", qrs: "92 ms", qt: "440 ms" },
    hints: ["Rate < 60 bpm", "P before every QRS", "1:1 conduction"],
    explanation:
      "Sinus rhythm at rate < 60 bpm. Often physiologic (athletes) or due to drugs (β-blockers). Treat only if symptomatic.",
    keyPoints: ["Rate < 60", "Sinus origin", "Treat if symptomatic"],
  },
  {
    id: "c20",
    diagnosis: "Premature Ventricular Contractions",
    aliases: ["pvc", "pvcs", "premature ventricular contractions", "ventricular ectopy"],
    options: ["PVCs", "PACs", "Atrial Flutter", "VT"],
    difficulty: "beginner",
    category: "Arrhythmias",
    waveform: "pvcs",
    rate: 78,
    rhythm: "Sinus with ectopy",
    intervals: { pr: "160 ms", qrs: "100 ms (sinus)", qt: "400 ms" },
    hints: ["Wide, bizarre early beats", "No preceding P wave", "Compensatory pause"],
    explanation:
      "Wide, premature complexes with no preceding P wave and a compensatory pause — PVCs. Usually benign; high burden warrants workup for structural disease.",
    keyPoints: ["Wide, early, no P", "Compensatory pause", "Workup if frequent"],
  },
  {
    id: "c21",
    diagnosis: "Normal Sinus Rhythm",
    aliases: ["normal sinus rhythm", "nsr", "sinus rhythm", "normal"],
    options: ["Normal Sinus Rhythm", "Sinus Bradycardia", "Sinus Tachycardia", "Atrial Fibrillation"],
    difficulty: "beginner",
    category: "Arrhythmias",
    waveform: "nsr",
    rate: 72,
    rhythm: "Sinus",
    intervals: { pr: "160 ms", qrs: "90 ms", qt: "400 ms" },
    hints: ["Rate 60–100", "P before every QRS", "Normal intervals"],
    explanation:
      "Normal sinus rhythm: regular, rate 60–100 bpm, upright P waves in II, normal PR/QRS/QT.",
    keyPoints: ["Rate 60–100", "P–QRS–T normal", "Baseline reference"],
  },
];

// Pick "case of the day" deterministically by date
export function getDailyCase(date = new Date()): ECGCase {
  const epoch = new Date("2025-01-01").getTime();
  const day = Math.floor((date.getTime() - epoch) / (1000 * 60 * 60 * 24));
  const idx = ((day % CASES.length) + CASES.length) % CASES.length;
  return CASES[idx];
}
