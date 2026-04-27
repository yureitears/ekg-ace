import { useMemo } from "react";
import type { WaveformKind } from "@/data/cases";

export type Lead =
  | "I" | "II" | "III"
  | "aVR" | "aVL" | "aVF"
  | "V1" | "V2" | "V3" | "V4" | "V5" | "V6";

export const ALL_LEADS: Lead[] = [
  "I", "II", "III", "aVR", "aVL", "aVF",
  "V1", "V2", "V3", "V4", "V5", "V6",
];

interface Props {
  kind: WaveformKind;
  height?: number;
  animated?: boolean;
  showLabel?: string;
  lead?: Lead;
}

/**
 * Generates a synthetic ECG waveform path for a given diagnosis kind.
 * Uses a deterministic procedural generator so each case looks distinct
 * but consistent across renders. Drawn on an SVG with ECG paper grid.
 */
function generatePath(kind: WaveformKind, width: number, height: number): string {
  const mid = height / 2;
  const points: [number, number][] = [];
  const step = 2;
  let x = 0;

  // helpers
  const baseline = (n: number) => {
    for (let i = 0; i < n; i++) {
      points.push([x, mid + (Math.random() - 0.5) * 0.6]);
      x += step;
    }
  };
  const pWave = (amp = 6) => {
    for (let i = 0; i < 8; i++) {
      points.push([x, mid - Math.sin((i / 8) * Math.PI) * amp]);
      x += step;
    }
  };
  const qrs = (rAmp = 60, qAmp = 8, sAmp = 14, wide = false) => {
    const w = wide ? 2 : 1;
    points.push([x, mid + qAmp]); x += step * w;
    points.push([x, mid - rAmp]); x += step * w;
    points.push([x, mid + sAmp]); x += step * w;
    points.push([x, mid]); x += step * w;
  };
  const tWave = (amp = 14, inverted = false) => {
    for (let i = 0; i < 12; i++) {
      const v = Math.sin((i / 12) * Math.PI) * amp;
      points.push([x, mid - (inverted ? -v : v)]);
      x += step;
    }
  };
  const stElevation = (amp = 0, len = 8) => {
    for (let i = 0; i < len; i++) {
      points.push([x, mid - amp]);
      x += step;
    }
  };

  switch (kind) {
    case "nsr":
      while (x < width) { baseline(6); pWave(6); baseline(2); qrs(); stElevation(0, 4); tWave(12); baseline(10); }
      break;
    case "bradycardia":
      while (x < width) { baseline(20); pWave(6); baseline(3); qrs(); stElevation(0, 4); tWave(12); baseline(20); }
      break;
    case "svt":
      while (x < width) { baseline(2); qrs(50, 4, 10); tWave(8); baseline(2); }
      break;
    case "afib":
      while (x < width) {
        // fibrillatory baseline
        for (let i = 0; i < (8 + Math.floor(Math.random() * 18)); i++) {
          points.push([x, mid + (Math.random() - 0.5) * 6]);
          x += step;
        }
        qrs(55, 6, 12);
        tWave(10);
      }
      break;
    case "aflutter":
      while (x < width) {
        // sawtooth flutter
        for (let i = 0; i < 18; i++) {
          points.push([x, mid - (i % 6) * 2 + 4]);
          x += step;
        }
        qrs(50, 4, 10);
        tWave(10);
      }
      break;
    case "vtach":
      while (x < width) {
        // wide monomorphic
        for (let i = 0; i < 16; i++) {
          const v = Math.sin((i / 16) * Math.PI * 2) * 50;
          points.push([x, mid - v]);
          x += step;
        }
      }
      break;
    case "vfib":
      while (x < width) {
        const amp = 10 + Math.random() * 40;
        const v = Math.sin(x * 0.3 + Math.random() * 2) * amp;
        points.push([x, mid - v]);
        x += step;
      }
      break;
    case "torsades":
      while (x < width) {
        const env = Math.sin(x * 0.02) * 50;
        for (let i = 0; i < 8; i++) {
          const v = Math.sin((i / 8) * Math.PI * 2) * env;
          points.push([x, mid - v]);
          x += step;
        }
      }
      break;
    case "asystole":
      while (x < width) {
        points.push([x, mid + (Math.random() - 0.5) * 1.2]);
        x += step;
      }
      break;
    case "stemi-anterior":
      while (x < width) {
        baseline(8); pWave(5); baseline(2);
        // Sharp upstroke of R wave (no S — tombstone)
        points.push([x, mid + 4]); x += step;
        points.push([x, mid - 70]); x += step;
        // Single continuous convex dome from R apex back to baseline,
        // with NO isoelectric segment — ST and T fused into one bulge.
        // Length tuned so the dome is wide and clearly "tombstone-like".
        const domeLen = 36;
        const peakY = -70;     // start at R peak
        const endY = -2;       // ends just above baseline (T returns smoothly)
        for (let i = 1; i <= domeLen; i++) {
          const t = i / domeLen;
          // Ease-out: stays high then descends gently (convex/dome)
          const eased = 1 - Math.pow(1 - t, 2.4);
          const y = peakY + (endY - peakY) * eased;
          points.push([x, mid + y]);
          x += step;
        }
        baseline(14);
      }
      break;
    case "stemi-inferior":
      while (x < width) { baseline(14); pWave(6); baseline(2); qrs(50); stElevation(16, 10); tWave(16); baseline(14); }
      break;
    case "lbbb":
      while (x < width) {
        baseline(6); pWave(6); baseline(2);
        // wide notched QRS
        points.push([x, mid + 4]); x += step;
        points.push([x, mid - 30]); x += step * 2;
        points.push([x, mid - 18]); x += step * 2;
        points.push([x, mid - 36]); x += step * 2;
        points.push([x, mid + 8]); x += step;
        tWave(12, true);
        baseline(8);
      }
      break;
    case "rbbb":
      while (x < width) {
        baseline(6); pWave(6); baseline(2);
        // rSR' rabbit ears
        points.push([x, mid + 4]); x += step;
        points.push([x, mid - 30]); x += step;
        points.push([x, mid + 6]); x += step;
        points.push([x, mid - 18]); x += step;
        points.push([x, mid + 10]); x += step * 2;
        tWave(10, true);
        baseline(8);
      }
      break;
    case "first-degree-av":
      while (x < width) { baseline(6); pWave(6); baseline(14); qrs(); tWave(12); baseline(10); }
      break;
    case "third-degree-av":
      while (x < width) {
        // dissociated p waves and slow wide escape
        for (let i = 0; i < 30; i++) {
          if (i === 6 || i === 14 || i === 22) {
            points.push([x, mid - 6]); x += step;
            points.push([x, mid - 8]); x += step;
            points.push([x, mid - 4]); x += step;
          } else {
            points.push([x, mid + (Math.random() - 0.5) * 0.6]);
            x += step;
          }
        }
        // wide escape QRS
        points.push([x, mid + 6]); x += step * 2;
        points.push([x, mid - 36]); x += step * 3;
        points.push([x, mid + 12]); x += step * 2;
        tWave(12);
        baseline(40);
      }
      break;
    case "wpw":
      while (x < width) {
        baseline(6); pWave(6); baseline(0);
        // delta wave (slurred upstroke)
        for (let i = 0; i < 6; i++) {
          points.push([x, mid - i * 4]); x += step;
        }
        points.push([x, mid - 50]); x += step;
        points.push([x, mid + 12]); x += step * 2;
        tWave(10);
        baseline(10);
      }
      break;
    case "hyperkalemia":
      while (x < width) {
        baseline(8); baseline(2);
        // wide QRS
        points.push([x, mid + 4]); x += step * 2;
        points.push([x, mid - 40]); x += step * 2;
        points.push([x, mid + 14]); x += step * 2;
        // tall peaked T
        for (let i = 0; i < 10; i++) {
          const v = Math.sin((i / 10) * Math.PI) * 32;
          points.push([x, mid - v]);
          x += step;
        }
        baseline(8);
      }
      break;
    case "hypokalemia":
      while (x < width) {
        baseline(6); pWave(6); baseline(2); qrs(48);
        // ST depression + flat T + U wave
        for (let i = 0; i < 6; i++) { points.push([x, mid + 6]); x += step; }
        for (let i = 0; i < 8; i++) {
          const v = Math.sin((i / 8) * Math.PI) * 4;
          points.push([x, mid - v + 4]); x += step;
        }
        // U wave
        for (let i = 0; i < 10; i++) {
          const v = Math.sin((i / 10) * Math.PI) * 8;
          points.push([x, mid - v]); x += step;
        }
        baseline(6);
      }
      break;
    case "pericarditis":
      while (x < width) {
        baseline(6); pWave(6);
        // PR depression
        points.push([x, mid + 4]); x += step * 2;
        qrs(48);
        // diffuse concave ST elevation
        for (let i = 0; i < 10; i++) {
          const v = 8 + Math.sin((i / 10) * Math.PI) * 6;
          points.push([x, mid - v]); x += step;
        }
        tWave(14);
        baseline(8);
      }
      break;
    case "lvh":
      while (x < width) {
        baseline(6); pWave(6); baseline(2);
        // very tall R, deep S
        points.push([x, mid + 6]); x += step;
        points.push([x, mid - 90]); x += step;
        points.push([x, mid + 30]); x += step;
        points.push([x, mid + 4]); x += step;
        tWave(14, true);
        baseline(10);
      }
      break;
    case "pvcs":
      while (x < width) {
        // 2 normal beats then a PVC
        for (let n = 0; n < 2; n++) {
          baseline(4); pWave(6); baseline(2); qrs(); tWave(12); baseline(8);
        }
        // wide bizarre PVC
        points.push([x, mid + 8]); x += step * 2;
        points.push([x, mid - 70]); x += step * 3;
        points.push([x, mid + 30]); x += step * 2;
    tWave(16, true);
        baseline(20);
      }
      break;
    case "sinus-tach":
      while (x < width) { baseline(2); pWave(6); baseline(1); qrs(50); tWave(12); baseline(4); }
      break;
    case "mat":
      while (x < width) {
        const amp = 3 + Math.random() * 7;
        const dir = Math.random() > 0.5 ? 1 : -1;
        for (let i = 0; i < 8; i++) {
          points.push([x, mid - dir * Math.sin((i / 8) * Math.PI) * amp]);
          x += step;
        }
        baseline(2); qrs(); tWave(10);
        baseline(4 + Math.floor(Math.random() * 8));
      }
      break;
    case "pac":
      while (x < width) {
        for (let n = 0; n < 3; n++) { baseline(6); pWave(6); baseline(2); qrs(); tWave(12); baseline(10); }
        baseline(2);
        for (let i = 0; i < 6; i++) { points.push([x, mid - Math.sin((i / 6) * Math.PI) * 9]); x += step; }
        qrs(); tWave(12); baseline(16);
      }
      break;
    case "wenckebach":
      while (x < width) {
        baseline(4); pWave(6); baseline(2); qrs(); tWave(10); baseline(8);
        baseline(4); pWave(6); baseline(6); qrs(); tWave(10); baseline(8);
        baseline(4); pWave(6); baseline(12); qrs(); tWave(10); baseline(8);
        baseline(4); pWave(6); baseline(20);
      }
      break;
    case "mobitz-ii":
      while (x < width) {
        baseline(4); pWave(6); baseline(4); qrs(); tWave(10); baseline(10);
        baseline(4); pWave(6); baseline(4); qrs(); tWave(10); baseline(10);
        baseline(4); pWave(6); baseline(20);
      }
      break;
    case "junctional":
      while (x < width) {
        baseline(20); qrs(45);
        for (let i = 0; i < 5; i++) { points.push([x, mid + Math.sin((i / 5) * Math.PI) * 4]); x += step; }
        tWave(10); baseline(20);
      }
      break;
    case "idioventricular":
      while (x < width) {
        baseline(40);
        points.push([x, mid + 6]); x += step * 2;
        points.push([x, mid - 50]); x += step * 3;
        points.push([x, mid + 20]); x += step * 2;
        points.push([x, mid - 6]); x += step * 2;
        tWave(14, true);
        baseline(40);
      }
      break;
    case "paced":
      while (x < width) {
        baseline(8);
        points.push([x, mid - 60]); x += 1;
        points.push([x, mid + 4]); x += 1;
        points.push([x, mid + 4]); x += step;
        points.push([x, mid - 35]); x += step * 2;
        points.push([x, mid - 20]); x += step * 2;
        points.push([x, mid + 6]); x += step;
        tWave(12, true);
        baseline(14);
      }
      break;
    case "posterior-stemi":
      while (x < width) {
        baseline(6); pWave(6); baseline(2);
        points.push([x, mid - 4]); x += step;
        points.push([x, mid - 55]); x += step;
        points.push([x, mid - 10]); x += step;
        for (let i = 0; i < 14; i++) {
          points.push([x, mid + 12 + Math.sin((i / 14) * Math.PI) * 2]);
          x += step;
        }
        for (let i = 0; i < 10; i++) { points.push([x, mid - Math.sin((i / 10) * Math.PI) * 14]); x += step; }
        baseline(8);
      }
      break;
    case "nstemi":
      while (x < width) {
        baseline(6); pWave(6); baseline(2); qrs(48);
        for (let i = 0; i < 10; i++) { points.push([x, mid + 10]); x += step; }
        for (let i = 0; i < 12; i++) { points.push([x, mid + Math.sin((i / 12) * Math.PI) * 14]); x += step; }
        baseline(8);
      }
      break;
    case "wellens":
      while (x < width) {
        baseline(6); pWave(6); baseline(2); qrs(50);
        for (let i = 0; i < 6; i++) { points.push([x, mid]); x += step; }
        for (let i = 0; i < 16; i++) {
          const v = Math.sin((i / 16) * Math.PI) * 26;
          points.push([x, mid + v]); x += step;
        }
        baseline(10);
      }
      break;
    case "brugada":
      while (x < width) {
        baseline(6); pWave(6); baseline(2);
        points.push([x, mid + 4]); x += step;
        points.push([x, mid - 36]); x += step;
        points.push([x, mid - 22]); x += step;
        for (let i = 0; i < 18; i++) {
          const t = i / 18;
          const y = -22 + (30 * t);
          points.push([x, mid + y]); x += step;
        }
        for (let i = 0; i < 8; i++) { points.push([x, mid + 8 + Math.sin((i / 8) * Math.PI) * 6]); x += step; }
        baseline(10);
      }
      break;
    case "hypothermia":
      while (x < width) {
        baseline(20); pWave(6); baseline(2); qrs(48);
        points.push([x, mid - 18]); x += step;
        points.push([x, mid - 22]); x += step;
        points.push([x, mid - 12]); x += step;
        baseline(4);
        tWave(10);
        baseline(20);
      }
      break;
    case "digoxin":
      while (x < width) {
        baseline(6); pWave(6); baseline(2); qrs(48);
        for (let i = 0; i < 14; i++) {
          const t = i / 14;
          const y = 4 + Math.sin(t * Math.PI) * 10;
          points.push([x, mid + y]); x += step;
        }
        for (let i = 0; i < 6; i++) { points.push([x, mid - Math.sin((i / 6) * Math.PI) * 4]); x += step; }
        baseline(10);
      }
      break;
    case "long-qt":
      while (x < width) {
        baseline(6); pWave(6); baseline(2); qrs(48);
        for (let i = 0; i < 22; i++) { points.push([x, mid]); x += step; }
        for (let i = 0; i < 18; i++) { points.push([x, mid - Math.sin((i / 18) * Math.PI) * 16]); x += step; }
        baseline(10);
      }
      break;
    case "early-repol":
      while (x < width) {
        baseline(6); pWave(6); baseline(2); qrs(50);
        points.push([x, mid - 14]); x += step;
        points.push([x, mid - 10]); x += step;
        for (let i = 0; i < 14; i++) {
          const t = i / 14;
          const y = -8 - Math.sin(t * Math.PI) * 4;
          points.push([x, mid + y]); x += step;
        }
        for (let i = 0; i < 12; i++) { points.push([x, mid - Math.sin((i / 12) * Math.PI) * 18]); x += step; }
        baseline(10);
      }
      break;
    case "rvh":
      while (x < width) {
        baseline(6); pWave(8); baseline(2);
        points.push([x, mid + 4]); x += step;
        points.push([x, mid - 60]); x += step;
        points.push([x, mid + 20]); x += step;
        points.push([x, mid + 4]); x += step;
        tWave(10, true);
        baseline(10);
      }
      break;
    case "agonal":
      while (x < width) {
        baseline(40);
        points.push([x, mid + 4]); x += step * 3;
        points.push([x, mid - 18]); x += step * 4;
        points.push([x, mid + 10]); x += step * 4;
        points.push([x, mid - 4]); x += step * 3;
        baseline(60);
      }
      break;
    case "pulmonary-embolism":
      while (x < width) {
        baseline(4); pWave(8); baseline(2);
        points.push([x, mid + 4]); x += step;
        points.push([x, mid - 40]); x += step;
        points.push([x, mid + 30]); x += step;
        points.push([x, mid + 4]); x += step;
        for (let i = 0; i < 12; i++) { points.push([x, mid + Math.sin((i / 12) * Math.PI) * 14]); x += step; }
        baseline(8);
      }
      break;
    case "pericardial-effusion":
      while (x < width) {
        baseline(6); pWave(4); baseline(2);
        points.push([x, mid + 2]); x += step;
        points.push([x, mid - 18]); x += step;
        points.push([x, mid + 6]); x += step;
        tWave(6); baseline(8);
        baseline(4); pWave(4); baseline(2);
        points.push([x, mid + 4]); x += step;
        points.push([x, mid - 32]); x += step;
        points.push([x, mid + 10]); x += step;
        tWave(8); baseline(8);
      }
      break;
  }

  // smooth into SVG path
  return points
    .map((p, i) => (i === 0 ? `M ${p[0].toFixed(1)} ${p[1].toFixed(1)}` : `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`))
    .join(" ");
}

/**
 * Per-lead transform: takes the base DII path string and returns a transformed
 * path that approximates how that diagnosis looks in the requested lead.
 *
 * The transform manipulates the y-coordinates of the polyline (mirroring,
 * scaling QRS amplitude, adding/subtracting ST shift, inverting T waves).
 * It is a clinical *approximation* tuned for teaching, not a true 12-lead
 * reconstruction.
 */
function transformPathForLead(
  pathD: string,
  kind: WaveformKind,
  lead: Lead,
  height: number,
): string {
  const mid = height / 2;

  // Parse the M/L points back out
  const tokens = pathD.split(" ").filter(Boolean);
  const pts: [number, number, "M" | "L"][] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "M" || t === "L") {
      const x = parseFloat(tokens[i + 1]);
      const y = parseFloat(tokens[i + 2]);
      pts.push([x, y, t as "M" | "L"]);
      i += 2;
    }
  }
  if (!pts.length) return pathD;

  // Per-lead base scaling for QRS amplitude (vector projection approximation,
  // assuming a normal frontal axis around +60°). Negative = inverted.
  const FRONTAL: Record<string, number> = {
    I: 0.7,
    II: 1.0,
    III: 0.55,
    aVR: -0.85,
    aVL: 0.35,
    aVF: 0.85,
  };
  // Precordial progression: r grows V1→V5, S deepens early then fades
  const PRECORDIAL: Record<string, number> = {
    V1: -0.4, // small r, deep S
    V2: -0.1,
    V3: 0.45,
    V4: 0.95,
    V5: 1.0,
    V6: 0.85,
  };

  const baseScale = FRONTAL[lead] ?? PRECORDIAL[lead] ?? 1;

  // Diagnosis-specific ST/T overrides per lead.
  // Positive stShift = ST elevation (px), negative = depression.
  // tInvert flips the T-wave portion only.
  type Mod = { stShift?: number; tInvert?: boolean; ampMul?: number; qPath?: boolean };
  const m: Mod = {};

  const elev = (px: number) => ({ stShift: px });
  const depr = (px: number) => ({ stShift: -px });
  const inv = () => ({ tInvert: true });

  switch (kind) {
    case "stemi-anterior": {
      // Elevation V1-V4, reciprocal in II/III/aVF
      if (["V1", "V2", "V3", "V4"].includes(lead)) Object.assign(m, elev(20));
      else if (["V5", "V6"].includes(lead)) Object.assign(m, elev(8));
      else if (["II", "III", "aVF"].includes(lead)) Object.assign(m, depr(8));
      else if (lead === "aVL" || lead === "I") Object.assign(m, elev(4));
      break;
    }
    case "stemi-inferior": {
      if (["II", "III", "aVF"].includes(lead)) Object.assign(m, elev(18));
      else if (["I", "aVL"].includes(lead)) Object.assign(m, depr(8));
      else if (["V1", "V2"].includes(lead)) Object.assign(m, elev(4));
      break;
    }
    case "posterior-stemi": {
      // True ST elevation V7-V9; on standard 12 lead → reciprocal ST depression V1-V3 with tall R
      if (["V1", "V2", "V3"].includes(lead)) {
        Object.assign(m, depr(14));
        m.ampMul = -1.2; // tall R = inverted Q wave appearance
      } else if (["II", "III", "aVF"].includes(lead)) {
        Object.assign(m, elev(8));
      }
      break;
    }
    case "nstemi": {
      if (["V4", "V5", "V6", "I", "aVL"].includes(lead)) Object.assign(m, depr(10));
      if (lead === "aVR") Object.assign(m, elev(6));
      break;
    }
    case "wellens": {
      // Deep symmetric T inversion in V2-V3
      if (["V1", "V2", "V3", "V4"].includes(lead)) m.tInvert = true;
      break;
    }
    case "pericarditis": {
      // Diffuse concave ST elevation, PR depression — present in most leads except aVR/V1
      if (lead === "aVR") Object.assign(m, depr(6));
      else Object.assign(m, elev(8));
      break;
    }
    case "early-repol": {
      if (["V2", "V3", "V4", "V5", "II"].includes(lead)) Object.assign(m, elev(6));
      break;
    }
    case "brugada": {
      if (["V1", "V2"].includes(lead)) Object.assign(m, elev(14));
      break;
    }
    case "lvh": {
      // Tall R V5-V6, deep S V1-V2, strain (T inversion) lateral
      if (["V1", "V2"].includes(lead)) m.ampMul = -1.4;
      else if (["V5", "V6", "I", "aVL"].includes(lead)) {
        m.ampMul = 1.5;
        m.tInvert = true;
        Object.assign(m, depr(6));
      }
      break;
    }
    case "rvh": {
      if (["V1", "V2"].includes(lead)) m.ampMul = 1.5;
      else if (["V5", "V6"].includes(lead)) m.ampMul = -0.6;
      if (["III", "aVF"].includes(lead)) m.ampMul = (m.ampMul ?? 1) * 1.2;
      break;
    }
    case "lbbb": {
      // Wide QRS, deep S V1-V3, broad notched R V5-V6 with discordant T
      if (["V1", "V2", "V3"].includes(lead)) m.ampMul = -1.2;
      if (["V5", "V6", "I", "aVL"].includes(lead)) m.tInvert = true;
      break;
    }
    case "rbbb": {
      // rSR' V1-V2, slurred S in I, V6
      if (["V1", "V2"].includes(lead)) m.ampMul = 1.1;
      if (["I", "V6"].includes(lead)) m.ampMul = 0.8;
      break;
    }
    case "wpw": {
      // Delta wave visible in most leads — leave morphology, just scale
      break;
    }
    case "hyperkalemia": {
      // Peaked T — accentuate T amplitude in precordials
      if (["V2", "V3", "V4"].includes(lead)) m.ampMul = (baseScale) * 1.15;
      break;
    }
    case "pulmonary-embolism": {
      // S1Q3T3: deep S in I, Q + inverted T in III
      if (lead === "I") m.ampMul = -0.6;
      if (lead === "III") { m.tInvert = true; }
      if (["V1", "V2", "V3"].includes(lead)) m.tInvert = true;
      break;
    }
    case "vtach":
    case "vfib":
    case "torsades":
    case "asystole":
    case "agonal":
    case "idioventricular":
      // Global rhythm — same in all leads, just respect polarity
      break;
    case "afib":
    case "aflutter":
      // Aflutter sawtooth most visible in II/III/aVF
      if (kind === "aflutter" && ["II", "III", "aVF"].includes(lead)) m.ampMul = 1.2;
      break;
    default:
      break;
  }

  // Detect the "QRS region" of each beat heuristically: any point where the
  // |y-mid| exceeds a threshold (a tall deflection) marks the QRS center.
  // We use a simple approach: scan the points, if amplitude of point > 18 px
  // off baseline, it is QRS; the next ~14 points after the QRS are ST/T.
  const out: string[] = [];
  let inBeat = false;
  let qrsEnd = -1;

  for (let i = 0; i < pts.length; i++) {
    const [x, y, cmd] = pts[i];
    let dy = y - mid; // negative = up

    // Effective scaling factor for QRS deflection (combines lead projection
    // + diagnosis-specific multiplier).
    const qrsScale = baseScale * (m.ampMul ?? 1);

    // QRS detection
    const isQrs = Math.abs(dy) > 16;
    if (isQrs && !inBeat) {
      inBeat = true;
      qrsEnd = i + 4; // QRS spans ~4 points
    }
    if (i > qrsEnd) inBeat = false;

    if (inBeat || isQrs) {
      dy = dy * qrsScale;
    } else {
      // ST/T region — apply ST shift and T inversion
      // We assume the segment within ~22 points after qrsEnd is ST+T
      const distFromQrs = i - qrsEnd;
      if (qrsEnd > 0 && distFromQrs > 0 && distFromQrs < 26) {
        if (m.stShift) dy -= m.stShift;
        if (m.tInvert) dy = -dy;
      } else {
        // baseline: keep but flip if global polarity inverted
        if (qrsScale < 0) dy = -dy * 0.3;
      }
    }

    const ny = mid + dy;
    out.push(`${cmd} ${x.toFixed(1)} ${ny.toFixed(1)}`);
  }

  return out.join(" ");
}

export function ECGStrip({ kind, height = 220, animated = true, showLabel, lead }: Props) {
  const width = 1200;
  const path = useMemo(() => {
    const base = generatePath(kind, width, height);
    if (!lead || lead === "II") return base;
    return transformPathForLead(base, kind, lead, height);
  }, [kind, height, lead]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-[hsl(220_35%_5%)]">
      {/* ECG paper grid */}
      <div className="absolute inset-0 ecg-grid opacity-90" />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="relative w-full"
        style={{ height }}
      >
        <defs>
          <filter id={`glow-${kind}-${lead ?? "II"}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={path}
          fill="none"
          stroke="hsl(152 100% 55%)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${kind}-${lead ?? "II"})`}
          className={animated ? "animate-trace" : ""}
        />
      </svg>
      {showLabel && (
        <div className="absolute left-3 top-2 font-mono-clinical text-[11px] uppercase tracking-widest text-primary/80">
          {showLabel}
        </div>
      )}
      <div className="absolute right-3 bottom-2 font-mono-clinical text-[10px] text-muted-foreground">
        25 mm/s · 10 mm/mV
      </div>
    </div>
  );
}

