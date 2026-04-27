import { ECGStrip, ALL_LEADS, type Lead } from "./ECGStrip";
import type { WaveformKind } from "@/data/cases";

interface Props {
  kind: WaveformKind;
  /** Highlight these leads as "key/diagnostic" for this case */
  keyLeads?: Lead[];
  caption?: string;
}

/**
 * 12-lead ECG layout:
 * - 3 columns × 4 rows of short strips (I/II/III, aVR/aVL/aVF, V1-V3, V4-V6)
 * - One long rhythm strip (DII) at the bottom.
 * Key/diagnostic leads get a primary-colored ring and a small badge.
 */
export function ECG12Lead({ kind, keyLeads = [], caption }: Props) {
  const rows: Lead[][] = [
    ["I", "aVR", "V1", "V4"],
    ["II", "aVL", "V2", "V5"],
    ["III", "aVF", "V3", "V6"],
  ];

  const isKey = (l: Lead) => keyLeads.includes(l);

  return (
    <div className="space-y-3">
      {caption && (
        <p className="font-mono-clinical text-[11px] uppercase tracking-widest text-primary/80">
          {caption}
        </p>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {rows.flatMap((row) =>
          row.map((lead) => (
            <div
              key={lead}
              className={`relative ${
                isKey(lead) ? "ring-2 ring-primary/60 rounded-lg" : ""
              }`}
            >
              <div className="absolute left-2 top-1.5 z-10 font-mono-clinical text-[10px] font-bold uppercase tracking-widest text-primary">
                {lead}
              </div>
              {isKey(lead) && (
                <div className="absolute right-2 top-1.5 z-10 rounded-sm bg-primary px-1.5 py-0.5 font-mono-clinical text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
                  Clave
                </div>
              )}
              <ECGStrip
                kind={kind}
                lead={lead}
                height={90}
                animated={false}
              />
            </div>
          ))
        )}
      </div>
      {/* Long rhythm strip */}
      <div className="relative">
        <div className="absolute left-2 top-1.5 z-10 font-mono-clinical text-[10px] font-bold uppercase tracking-widest text-primary">
          II · Tira de ritmo
        </div>
        <ECGStrip kind={kind} lead="II" height={120} animated />
      </div>
    </div>
  );
}
