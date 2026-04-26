import { useMemo } from "react";
import type { WaveformKind } from "@/data/cases";

interface Props {
  kind: WaveformKind;
  height?: number;
  animated?: boolean;
  showLabel?: string;
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

export function ECGStrip({ kind, height = 220, animated = true, showLabel }: Props) {
  const width = 1200;
  const path = useMemo(() => generatePath(kind, width, height), [kind, height]);

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
          <filter id={`glow-${kind}`} x="-20%" y="-20%" width="140%" height="140%">
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
          filter={`url(#glow-${kind})`}
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
