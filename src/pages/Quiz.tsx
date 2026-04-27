import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Timer, CheckCircle2, XCircle, ChevronRight, Filter } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ECGStrip } from "@/components/ECGStrip";
import { ECG12Lead } from "@/components/ECG12Lead";
import type { Lead } from "@/components/ECGStrip";
import { Button } from "@/components/ui/button";
import { CASES, KEY_LEADS_BY_WAVEFORM, type Difficulty, type Category } from "@/data/cases";
import { recordAttempt } from "@/lib/storage";

const DIFFS: Difficulty[] = ["beginner", "intermediate", "advanced"];
const DIFF_LABELS: Record<Difficulty, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const Quiz = () => {
  const [params] = useSearchParams();
  const initialCat = (params.get("category") as Category | null) ?? null;
  const [category, setCategory] = useState<Category | null>(initialCat);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [timed, setTimed] = useState(false);
  const [seed, setSeed] = useState(0);
  const [view, setView] = useState<"single" | "twelve">("single");

  const pool = useMemo(() => {
    return CASES.filter((c) => (!category || c.category === category) && (!difficulty || c.difficulty === difficulty));
  }, [category, difficulty]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(90);

  const current = pool[idx % Math.max(1, pool.length)];

  useEffect(() => {
    setIdx(0);
    setPicked(null);
    setScore({ correct: 0, total: 0 });
  }, [category, difficulty, seed]);

  useEffect(() => {
    if (!timed || picked) return;
    setTimeLeft(90);
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [idx, timed, picked]);

  useEffect(() => {
    if (timed && timeLeft <= 0 && !picked) handlePick("__timeout__");
  }, [timeLeft, timed, picked]);

  function handlePick(opt: string) {
    if (picked) return;
    const ok = opt === current.diagnosis;
    setPicked(opt);
    recordAttempt(current.id, ok);
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
  }

  function next() {
    setPicked(null);
    setIdx((i) => i + 1);
  }

  const categories = Array.from(new Set(CASES.map((c) => c.category)));

  if (!current) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container py-16 text-center">
          <p className="text-muted-foreground">Ningún caso coincide con tus filtros.</p>
          <Button onClick={() => { setCategory(null); setDifficulty(null); }} className="mt-4">Restablecer filtros</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-5xl py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono-clinical text-xs uppercase tracking-widest text-primary">Banco de Preguntas</p>
            <h1 className="mt-1 font-display text-3xl font-bold">Modo práctica</h1>
          </div>
          <div className="font-mono-clinical text-sm text-muted-foreground">
            Puntuación <span className="text-primary">{score.correct}</span> / {score.total}
            {timed && (
              <span className="ml-4 inline-flex items-center gap-1 text-warning">
                <Timer className="h-4 w-4" />{Math.max(0, timeLeft)}s
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="card-elevated mb-6 flex flex-wrap items-center gap-3 rounded-xl p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <FilterGroup label="Categoría" current={category} onChange={(v) => setCategory(v as Category | null)} options={categories} />
          <FilterGroup
            label="Dificultad"
            current={difficulty}
            onChange={(v) => setDifficulty(v as Difficulty | null)}
            options={DIFFS}
            renderLabel={(v) => DIFF_LABELS[v as Difficulty]}
          />
          <label className="ml-auto inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} className="accent-primary" />
            Modo cronometrado
          </label>
          <Button variant="ghost" size="sm" onClick={() => setSeed((s) => s + 1)}>Mezclar</Button>
        </div>

        <div className="mb-3 flex items-center justify-end gap-1">
          <button
            onClick={() => setView("single")}
            className={`rounded-md px-2.5 py-1 font-mono-clinical text-[11px] uppercase tracking-widest transition-colors ${
              view === "single" ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            DII
          </button>
          <button
            onClick={() => setView("twelve")}
            className={`rounded-md px-2.5 py-1 font-mono-clinical text-[11px] uppercase tracking-widest transition-colors ${
              view === "twelve" ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            12 derivaciones
          </button>
        </div>

        {view === "single" ? (
          <ECGStrip kind={current.waveform} height={240} animated showLabel={`CASO ${current.id.toUpperCase()} · ${current.category}`} />
        ) : (
          <ECG12Lead
            kind={current.waveform}
            keyLeads={(KEY_LEADS_BY_WAVEFORM[current.waveform] ?? ["II"]) as Lead[]}
            caption={`CASO ${current.id.toUpperCase()} · 12 DERIVACIONES`}
          />
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono-clinical text-xs">
          <Vital k="FC" v={`${current.rate || "—"} lpm`} />
          <Vital k="RITMO" v={current.rhythm} />
          <Vital k="QRS" v={current.intervals.qrs} />
          <Vital k="DIFICULTAD" v={DIFF_LABELS[current.difficulty].toUpperCase()} />
        </div>

        {/* Options */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {current.options.map((opt) => {
            const isCorrect = opt === current.diagnosis;
            const isPicked = opt === picked;
            const reveal = picked !== null;
            const cls = !reveal
              ? "border-border bg-secondary/40 hover:border-primary/50 hover:bg-primary/10"
              : isCorrect
                ? "border-success/60 bg-success/10"
                : isPicked
                  ? "border-destructive/60 bg-destructive/10"
                  : "border-border bg-secondary/20 opacity-60";
            return (
              <button
                key={opt}
                onClick={() => handlePick(opt)}
                disabled={!!picked}
                className={`flex items-center justify-between rounded-lg border px-4 py-4 text-left text-base transition-all ${cls}`}
              >
                <span>{opt}</span>
                {reveal && isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                {reveal && isPicked && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {picked && (
          <div className="card-elevated mt-6 animate-fade-up rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Diagnóstico</p>
                <h3 className="font-display text-2xl font-bold">{current.diagnosis}</h3>
              </div>
              <Button onClick={next} className="shrink-0 glow-primary">
                Siguiente caso <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 leading-relaxed text-muted-foreground">{current.explanation}</p>
            {current.symptoms && current.symptoms.length > 0 && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-widest text-warning">Síntomas</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {current.symptoms.map((s, i) => (
                    <span key={i} className="rounded-md border border-warning/30 bg-warning/5 px-2.5 py-1 text-xs text-warning">{s}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {current.keyPoints.map((k, i) => (
                <span key={i} className="rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs text-primary">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          ¿Quieres competir? <Link to="/leaderboard" className="text-primary hover:underline">Ver la clasificación →</Link>
        </div>
      </main>
    </div>
  );
};

function Vital({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-secondary/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="mt-0.5 text-primary">{v}</div>
    </div>
  );
}

function FilterGroup<T extends string>({ label, current, onChange, options, renderLabel }: { label: string; current: T | null; onChange: (v: T | null) => void; options: readonly T[] | T[]; renderLabel?: (v: T) => string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}:</span>
      <div className="flex flex-wrap gap-1">
        <Chip active={current === null} onClick={() => onChange(null)}>Todas</Chip>
        {options.map((o) => (
          <Chip key={o} active={current === o} onClick={() => onChange(o)}>{renderLabel ? renderLabel(o) : o}</Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export default Quiz;
