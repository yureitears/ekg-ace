export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Category =
  | "Arritmias"
  | "Isquemia"
  | "Bloqueos de Conducción"
  | "Electrolitos"
  | "Hipertrofia"
  | "Pre-excitación"
  | "Pericárdico";

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
    diagnosis: "Fibrilación Auricular",
    aliases: ["fibrilacion auricular", "fibrilación auricular", "fa", "atrial fibrillation", "afib"],
    options: ["Fibrilación Auricular", "Flutter Auricular", "Taquicardia Sinusal", "Taquicardia Auricular Multifocal"],
    difficulty: "beginner",
    category: "Arritmias",
    waveform: "afib",
    rate: 128,
    rhythm: "Irregularmente irregular",
    intervals: { pr: "—", qrs: "88 ms", qt: "320 ms" },
    hints: [
      "Ritmo irregularmente irregular",
      "Sin ondas P discernibles",
      "Complejos QRS estrechos",
    ],
    explanation:
      "La ausencia de ondas P con respuesta ventricular irregularmente irregular y línea basal fibrilatoria es diagnóstica de fibrilación auricular. El control de la frecuencia y la anticoagulación (según CHA₂DS₂-VASc) son los pilares del tratamiento.",
    keyPoints: [
      "Ritmo ventricular irregularmente irregular",
      "Ausencia de ondas P, línea basal fibrilatoria",
      "Evaluar riesgo de ictus (CHA₂DS₂-VASc)",
    ],
  },
  {
    id: "c02",
    diagnosis: "Flutter Auricular",
    aliases: ["flutter auricular", "flutter", "aleteo auricular", "atrial flutter"],
    options: ["Fibrilación Auricular", "Flutter Auricular", "TRNAV", "Ritmo Sinusal"],
    difficulty: "beginner",
    category: "Arritmias",
    waveform: "aflutter",
    rate: 150,
    rhythm: "Regular, ondas F en dientes de sierra",
    intervals: { pr: "—", qrs: "90 ms", qt: "300 ms" },
    hints: ["Ondas F en dientes de sierra en derivaciones inferiores", "Frecuencia auricular ~300 lpm", "A menudo conducción 2:1"],
    explanation:
      "Ondas de flutter clásicas en dientes de sierra a ~300 lpm con conducción AV 2:1, dando una frecuencia ventricular de ~150 lpm. La ablación del istmo cavotricuspídeo es muy efectiva.",
    keyPoints: ["Patrón en sierra en II/III/aVF", "Frecuencia auricular 250–350", "Control de frecuencia + anticoagulación"],
  },
  {
    id: "c03",
    diagnosis: "Taquicardia Ventricular",
    aliases: ["taquicardia ventricular", "tv", "tvm", "ventricular tachycardia", "vtach"],
    options: ["TSV con aberrancia", "Taquicardia Ventricular", "Flutter Auricular", "Taquicardia Sinusal"],
    difficulty: "intermediate",
    category: "Arritmias",
    waveform: "vtach",
    rate: 180,
    rhythm: "Taquicardia regular de complejo ancho",
    intervals: { pr: "—", qrs: "160 ms", qt: "—" },
    hints: ["QRS ancho > 120 ms", "Regular y rápida", "Puede haber disociación AV"],
    explanation:
      "TV monomórfica — taquicardia regular de complejo ancho que se origina en los ventrículos. Pacientes inestables requieren cardioversión sincronizada; los estables pueden recibir amiodarona o procainamida.",
    keyPoints: ["Taquicardia QRS ancho", "Cardiovertir si inestable", "Buscar isquemia/causa estructural"],
  },
  {
    id: "c04",
    diagnosis: "Fibrilación Ventricular",
    aliases: ["fibrilacion ventricular", "fibrilación ventricular", "fv", "vf", "vfib"],
    options: ["Asistolia", "Fibrilación Ventricular", "Torsades de Pointes", "Fibrilación Auricular"],
    difficulty: "beginner",
    category: "Arritmias",
    waveform: "vfib",
    rate: 0,
    rhythm: "Caótico, sin complejos organizados",
    intervals: { pr: "—", qrs: "—", qt: "—" },
    hints: ["Línea basal caótica", "Sin QRS identificables", "Paciente sin pulso"],
    explanation:
      "Fibrilación ventricular: actividad eléctrica caótica sin gasto cardíaco efectivo. Desfibrilación inmediata y RCP de alta calidad según ACLS.",
    keyPoints: ["Desfibrilar inmediatamente", "RCP de alta calidad", "Causas reversibles (H y T)"],
  },
  {
    id: "c05",
    diagnosis: "IAMCEST Anterior",
    aliases: ["iamcest anterior", "infarto anterior", "stemi anterior", "iam anterior", "infarto agudo anterior"],
    options: ["IAMCEST Anterior", "IAMCEST Inferior", "Pericarditis", "Bloqueo de Rama Izquierda"],
    difficulty: "intermediate",
    category: "Isquemia",
    waveform: "stemi-anterior",
    rate: 92,
    rhythm: "Sinusal",
    intervals: { pr: "160 ms", qrs: "92 ms", qt: "400 ms" },
    hints: ["Elevación del ST en V1–V4", "Cambios recíprocos inferiores", "Territorio de la DA"],
    explanation:
      "Elevación del ST convexa en derivaciones precordiales (V1–V4) indica IAMCEST anterior por oclusión de la DA. Activar la sala de hemodinamia para ICP primaria.",
    keyPoints: ["ST↑ V1–V4", "Oclusión de la DA", "Tiempo puerta-balón < 90 min"],
  },
  {
    id: "c06",
    diagnosis: "IAMCEST Inferior",
    aliases: ["iamcest inferior", "infarto inferior", "stemi inferior", "iam inferior", "oclusion cd"],
    options: ["IAMCEST Inferior", "IAMCEST Anterior", "Pericarditis", "Repolarización Precoz"],
    difficulty: "intermediate",
    category: "Isquemia",
    waveform: "stemi-inferior",
    rate: 58,
    rhythm: "Bradicardia sinusal",
    intervals: { pr: "180 ms", qrs: "94 ms", qt: "420 ms" },
    hints: ["Elevación del ST en II, III, aVF", "Descenso recíproco en I, aVL", "Solicitar derivaciones derechas"],
    explanation:
      "Elevación del ST en derivaciones inferiores (II, III, aVF) con descenso recíproco en aVL indica IAMCEST inferior, generalmente por oclusión de la CD. Obtener derivaciones derechas para evaluar afectación del VD; evitar nitratos si la hay.",
    keyPoints: ["ST↑ II/III/aVF", "Territorio de la CD", "Cuidado con infarto de VD — sensible a nitratos"],
  },
  {
    id: "c07",
    diagnosis: "Bloqueo de Rama Izquierda",
    aliases: ["bloqueo de rama izquierda", "bri", "bcrihh", "lbbb"],
    options: ["Bloqueo de Rama Izquierda", "Bloqueo de Rama Derecha", "IAMCEST Anterior", "Hipertrofia Ventricular Izquierda"],
    difficulty: "intermediate",
    category: "Bloqueos de Conducción",
    waveform: "lbbb",
    rate: 76,
    rhythm: "Sinusal",
    intervals: { pr: "170 ms", qrs: "150 ms", qt: "440 ms" },
    hints: ["QRS > 120 ms", "R ancha y mellada en I, V6", "QS o rS en V1"],
    explanation:
      "QRS ancho con R amplias y melladas en derivaciones laterales (I, aVL, V5–V6) y S dominante en V1 — BRI clásico. Un BRI nuevo con dolor torácico requiere evaluación equivalente a IAMCEST (criterios de Sgarbossa).",
    keyPoints: ["QRS ≥ 120 ms", "R ancha en I/V6", "Sgarbossa para isquemia"],
  },
  {
    id: "c08",
    diagnosis: "Bloqueo de Rama Derecha",
    aliases: ["bloqueo de rama derecha", "brd", "bcrdhh", "rbbb"],
    options: ["Bloqueo de Rama Derecha", "Bloqueo de Rama Izquierda", "Wolff-Parkinson-White", "Hiperpotasemia"],
    difficulty: "intermediate",
    category: "Bloqueos de Conducción",
    waveform: "rbbb",
    rate: 78,
    rhythm: "Sinusal",
    intervals: { pr: "160 ms", qrs: "140 ms", qt: "400 ms" },
    hints: ["QRS > 120 ms", "rSR' (\"orejas de conejo\") en V1", "S ancha en I y V6"],
    explanation:
      "QRS ancho con patrón rSR' en V1 y S terminal ancha en derivaciones laterales — BRD. A menudo benigno aislado, pero buscar causa subyacente (TEP, isquemia, cardiopatía estructural).",
    keyPoints: ["rSR' en V1", "S ancha en I/V6", "Frecuentemente incidental"],
  },
  {
    id: "c09",
    diagnosis: "Bloqueo AV de Primer Grado",
    aliases: ["bloqueo av de primer grado", "bloqueo av 1er grado", "bav primer grado", "first degree av block"],
    options: ["Bloqueo AV de Primer Grado", "Bloqueo AV de Segundo Grado", "Bloqueo AV de Tercer Grado", "Ritmo Sinusal"],
    difficulty: "beginner",
    category: "Bloqueos de Conducción",
    waveform: "first-degree-av",
    rate: 70,
    rhythm: "Sinusal con PR prolongado",
    intervals: { pr: "260 ms", qrs: "92 ms", qt: "400 ms" },
    hints: ["PR > 200 ms", "Cada P seguida de QRS", "Intervalo PR constante"],
    explanation:
      "Intervalo PR constante > 200 ms con conducción 1:1 define el bloqueo AV de primer grado. Generalmente benigno y se observa.",
    keyPoints: ["PR > 200 ms", "Conducción 1:1", "Generalmente benigno"],
  },
  {
    id: "c10",
    diagnosis: "Bloqueo AV de Tercer Grado",
    aliases: ["bloqueo av de tercer grado", "bloqueo av completo", "bav completo", "bav tercer grado", "complete heart block"],
    options: ["Bloqueo AV de Tercer Grado", "Mobitz I", "Mobitz II", "Bloqueo AV de Primer Grado"],
    difficulty: "advanced",
    category: "Bloqueos de Conducción",
    waveform: "third-degree-av",
    rate: 38,
    rhythm: "Disociación AV",
    intervals: { pr: "variable", qrs: "120 ms", qt: "—" },
    hints: ["Ondas P y QRS independientes", "Ritmo de escape ventricular lento", "Disociación AV"],
    explanation:
      "Disociación AV completa: aurículas y ventrículos despolarizan de forma independiente, con ritmo de escape lento. Requiere marcapasos transcutáneo/transvenoso y colocación de marcapasos definitivo.",
    keyPoints: ["Disociación AV", "Ritmo de escape", "Indicación de marcapasos"],
  },
  {
    id: "c11",
    diagnosis: "Wolff-Parkinson-White",
    aliases: ["wolff-parkinson-white", "wolff parkinson white", "wpw", "preexcitacion", "pre-excitación", "sindrome de wpw"],
    options: ["Wolff-Parkinson-White", "Bloqueo de Rama Izquierda", "Bloqueo de Rama Derecha", "Hiperpotasemia"],
    difficulty: "advanced",
    category: "Pre-excitación",
    waveform: "wpw",
    rate: 84,
    rhythm: "Sinusal con preexcitación",
    intervals: { pr: "90 ms", qrs: "130 ms", qt: "400 ms" },
    hints: ["PR corto < 120 ms", "Onda delta (empastamiento inicial del QRS)", "QRS ancho"],
    explanation:
      "PR corto, onda delta y QRS ancho — preexcitación a través de una vía accesoria (haz de Kent). Evitar bloqueadores del nodo AV en fibrilación auricular con WPW; considerar ablación.",
    keyPoints: ["PR corto + onda delta", "Evitar bloqueadores del nodo AV en FA + WPW", "Tratamiento definitivo: ablación"],
  },
  {
    id: "c12",
    diagnosis: "Hiperpotasemia",
    aliases: ["hiperpotasemia", "hiperkalemia", "potasio alto", "hyperkalemia"],
    options: ["Hiperpotasemia", "Hipopotasemia", "Hipocalcemia", "Pericarditis"],
    difficulty: "intermediate",
    category: "Electrolitos",
    waveform: "hyperkalemia",
    rate: 72,
    rhythm: "Sinusal",
    intervals: { pr: "200 ms", qrs: "140 ms", qt: "360 ms" },
    hints: ["Ondas T picudas", "QRS ensanchado", "Ondas P aplanadas/ausentes"],
    explanation:
      "Ondas T picudas y ensanchamiento progresivo del QRS con aplanamiento de la onda P sugieren hiperpotasemia. Tratar con gluconato cálcico (estabilización de membrana), insulina/glucosa y eliminación definitiva del K⁺.",
    keyPoints: ["T picudas → QRS ancho → onda sinusoidal", "Calcio primero", "Desplazar y luego eliminar K⁺"],
  },
  {
    id: "c13",
    diagnosis: "Hipopotasemia",
    aliases: ["hipopotasemia", "hipokalemia", "potasio bajo", "hypokalemia"],
    options: ["Hipopotasemia", "Hiperpotasemia", "Hipercalcemia", "Efecto Digitálico"],
    difficulty: "intermediate",
    category: "Electrolitos",
    waveform: "hypokalemia",
    rate: 86,
    rhythm: "Sinusal",
    intervals: { pr: "170 ms", qrs: "90 ms", qt: "480 ms" },
    hints: ["Ondas T aplanadas", "Ondas U prominentes", "Prolongación del QT"],
    explanation:
      "Ondas T aplanadas con ondas U prominentes y descenso del ST sugieren hipopotasemia. La reposición de potasio (y magnesio) trata la causa.",
    keyPoints: ["T plana + onda U", "Riesgo de QT prolongado", "Reponer K⁺ y Mg²⁺"],
  },
  {
    id: "c14",
    diagnosis: "Pericarditis Aguda",
    aliases: ["pericarditis", "pericarditis aguda"],
    options: ["Pericarditis Aguda", "IAMCEST Anterior", "Repolarización Precoz", "Bloqueo de Rama Izquierda"],
    difficulty: "advanced",
    category: "Pericárdico",
    waveform: "pericarditis",
    rate: 96,
    rhythm: "Sinusal",
    intervals: { pr: "150 ms", qrs: "88 ms", qt: "380 ms" },
    hints: ["Elevación cóncava difusa del ST", "Descenso del PR", "Sin cambios recíprocos"],
    explanation:
      "La elevación cóncava difusa del ST con descenso del PR y sin cambios recíprocos es clásica de la pericarditis aguda. Tratar con AINE + colchicina.",
    keyPoints: ["ST↑ difuso, PR↓", "Sin cambios recíprocos", "AINE + colchicina"],
  },
  {
    id: "c15",
    diagnosis: "Hipertrofia Ventricular Izquierda",
    aliases: ["hipertrofia ventricular izquierda", "hvi", "lvh"],
    options: ["Hipertrofia Ventricular Izquierda", "Bloqueo de Rama Izquierda", "IAMCEST Anterior", "Bloqueo de Rama Derecha"],
    difficulty: "intermediate",
    category: "Hipertrofia",
    waveform: "lvh",
    rate: 74,
    rhythm: "Sinusal",
    intervals: { pr: "165 ms", qrs: "100 ms", qt: "420 ms" },
    hints: ["R alta en V5/V6, S profunda en V1/V2", "Sokolow-Lyon: S(V1) + R(V5/6) > 35 mm", "Patrón de sobrecarga lateral"],
    explanation:
      "Criterios de voltaje positivos (Sokolow-Lyon) con patrón de sobrecarga lateral — HVI. Frecuente en hipertensión de larga evolución; evaluar daño en órgano diana.",
    keyPoints: ["Sokolow-Lyon ≥ 35 mm", "Patrón de sobrecarga", "Tratar la HTA subyacente"],
  },
  {
    id: "c16",
    diagnosis: "Asistolia",
    aliases: ["asistolia", "linea plana", "asystole"],
    options: ["Asistolia", "Fibrilación Ventricular", "AESP", "Bradicardia Sinusal"],
    difficulty: "beginner",
    category: "Arritmias",
    waveform: "asystole",
    rate: 0,
    rhythm: "Ausente",
    intervals: { pr: "—", qrs: "—", qt: "—" },
    hints: ["Línea plana en varias derivaciones", "Confirmar en dos derivaciones", "Comprobar electrodos/ganancia"],
    explanation:
      "Asistolia: sin actividad eléctrica. Ritmo no desfibrilable — RCP de alta calidad, adrenalina y búsqueda de causas reversibles (H y T).",
    keyPoints: ["No desfibrilable", "RCP + adrenalina", "H y T"],
  },
  {
    id: "c17",
    diagnosis: "Torsades de Pointes",
    aliases: ["torsades", "torsades de pointes", "tdp", "tv polimorfica", "torsade"],
    options: ["Torsades de Pointes", "Fibrilación Ventricular", "TV Monomórfica", "Fibrilación Auricular"],
    difficulty: "advanced",
    category: "Arritmias",
    waveform: "torsades",
    rate: 220,
    rhythm: "TV polimórfica, eje cambiante",
    intervals: { pr: "—", qrs: "variable", qt: "prolongado en basal" },
    hints: ["Torsión del QRS alrededor de la línea basal", "QT largo previo al inicio", "Frecuentemente por fármacos o electrolitos"],
    explanation:
      "TV polimórfica con torsión de la amplitud del QRS alrededor de la línea isoeléctrica — Torsades de Pointes. Sulfato de magnesio IV es de primera línea; corregir hipopotasemia y retirar fármacos causantes.",
    keyPoints: ["QRS retorcido", "Mg²⁺ IV", "Retirar fármacos prolongadores del QT"],
  },
  {
    id: "c18",
    diagnosis: "Taquicardia Supraventricular",
    aliases: ["taquicardia supraventricular", "tsv", "trnav", "svt"],
    options: ["Taquicardia Supraventricular", "Taquicardia Sinusal", "Flutter Auricular", "Taquicardia Ventricular"],
    difficulty: "beginner",
    category: "Arritmias",
    waveform: "svt",
    rate: 180,
    rhythm: "Taquicardia regular de complejo estrecho",
    intervals: { pr: "—", qrs: "84 ms", qt: "280 ms" },
    hints: ["QRS estrecho, regular", "Frecuencia 150–250", "Ondas P frecuentemente ocultas"],
    explanation:
      "Taquicardia regular de complejo estrecho sin ondas P visibles — la mayoría son TRNAV. Maniobras vagales, luego adenosina; cardiovertir si inestable.",
    keyPoints: ["TSV regular estrecha", "Vagales → adenosina", "Cardiovertir si inestable"],
  },
  {
    id: "c19",
    diagnosis: "Bradicardia Sinusal",
    aliases: ["bradicardia sinusal", "bradicardia", "sinus bradycardia"],
    options: ["Bradicardia Sinusal", "Bloqueo AV de Tercer Grado", "Ritmo Nodal", "Ritmo Sinusal"],
    difficulty: "beginner",
    category: "Arritmias",
    waveform: "bradycardia",
    rate: 44,
    rhythm: "Sinusal, lento",
    intervals: { pr: "180 ms", qrs: "92 ms", qt: "440 ms" },
    hints: ["Frecuencia < 60 lpm", "P antes de cada QRS", "Conducción 1:1"],
    explanation:
      "Ritmo sinusal con frecuencia < 60 lpm. Frecuentemente fisiológico (atletas) o por fármacos (β-bloqueantes). Tratar solo si es sintomática.",
    keyPoints: ["Frecuencia < 60", "Origen sinusal", "Tratar si sintomática"],
  },
  {
    id: "c20",
    diagnosis: "Extrasístoles Ventriculares",
    aliases: ["extrasistoles ventriculares", "extrasístoles ventriculares", "ev", "pvc", "pvcs", "ectopia ventricular"],
    options: ["Extrasístoles Ventriculares", "Extrasístoles Auriculares", "Flutter Auricular", "Taquicardia Ventricular"],
    difficulty: "beginner",
    category: "Arritmias",
    waveform: "pvcs",
    rate: 78,
    rhythm: "Sinusal con ectopia",
    intervals: { pr: "160 ms", qrs: "100 ms (sinusal)", qt: "400 ms" },
    hints: ["Latidos anchos y bizarros prematuros", "Sin onda P precedente", "Pausa compensadora"],
    explanation:
      "Complejos prematuros, anchos, sin onda P precedente y con pausa compensadora — Extrasístoles Ventriculares. Generalmente benignas; alta carga justifica estudio de cardiopatía estructural.",
    keyPoints: ["Anchas, prematuras, sin P", "Pausa compensadora", "Estudio si frecuentes"],
  },
  {
    id: "c21",
    diagnosis: "Ritmo Sinusal Normal",
    aliases: ["ritmo sinusal normal", "rsn", "ritmo sinusal", "normal", "nsr"],
    options: ["Ritmo Sinusal Normal", "Bradicardia Sinusal", "Taquicardia Sinusal", "Fibrilación Auricular"],
    difficulty: "beginner",
    category: "Arritmias",
    waveform: "nsr",
    rate: 72,
    rhythm: "Sinusal",
    intervals: { pr: "160 ms", qrs: "90 ms", qt: "400 ms" },
    hints: ["Frecuencia 60–100", "P antes de cada QRS", "Intervalos normales"],
    explanation:
      "Ritmo sinusal normal: regular, frecuencia 60–100 lpm, ondas P positivas en II, intervalos PR/QRS/QT normales.",
    keyPoints: ["Frecuencia 60–100", "P–QRS–T normales", "Referencia basal"],
  },
];

// Pick "case of the day" deterministically by date
export function getDailyCase(date = new Date()): ECGCase {
  const epoch = new Date("2025-01-01").getTime();
  const day = Math.floor((date.getTime() - epoch) / (1000 * 60 * 60 * 24));
  const idx = ((day % CASES.length) + CASES.length) % CASES.length;
  return CASES[idx];
}
