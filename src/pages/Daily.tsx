import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Lightbulb, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ECGStrip } from "@/components/ECGStrip";
import { ECG12Lead } from "@/components/ECG12Lead";
import type { Lead } from "@/components/ECGStrip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDailyCase, KEY_LEADS_BY_WAVEFORM } from "@/data/cases";
import { loadStats, recordAttempt, recordDaily, todayKey } from "@/lib/storage";

const MAX_ATTEMPTS = 4;

const Daily = () => {
  const c = useMemo(() => getDailyCase(), []);
  const stored = loadStats().dailyHistory[todayKey()];
  const [guess, setGuess] = useState("");
  const [view, setView] = useState<"single" | "twelve">("single");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [done, setDone] = useState<null | { correct: boolean }>(stored ? { correct: stored.correct } : null);
  const keyLeads = (KEY_LEADS_BY_WAVEFORM[c.waveform] ?? ["II"]) as Lead[];

  const hintsShown = Math.min(attempts.length, c.hints.length);
  const remaining = MAX_ATTEMPTS - attempts.length;

  function isCorrect(input: string) {
    const v = input.trim().toLowerCase();
    return c.aliases.some((a) => v === a || v.includes(a));
  }

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!guess.trim() || done) return;
    const ok = isCorrect(guess);
    const next = [...attempts, guess.trim()];
    setAttempts(next);
    setGuess("");
    if (ok) {
      recordAttempt(c.id, true);
      recordDaily(c.id, true, next.length);
      setDone({ correct: true });
    } else if (next.length >= MAX_ATTEMPTS) {
      recordAttempt(c.id, false);
      recordDaily(c.id, false, next.length);
      setDone({ correct: false });
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-5xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="flex items-center gap-2 font-mono-clinical text-xs uppercase tracking-widest text-primary">
              <Flame className="h-3.5 w-3.5" /> ECG Diario · {todayKey()}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold">Diagnostica este trazado</h1>
          </div>
          <div className="font-mono-clinical text-sm text-muted-foreground">
            <span className="text-primary">{remaining}</span> / {MAX_ATTEMPTS} intentos
          </div>
        </div>

        <div className="mb-3 flex items-center justify-end gap-1">
          <button
            onClick={() => setView("single")}
            className={`rounded-md px-2.5 py-1 font-mono-clinical text-[11px] uppercase tracking-widest transition-colors ${
              view === "single" ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            DII · Tira larga
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
          <ECGStrip kind={c.waveform} height={260} animated showLabel="DERIVACIÓN II · 25 mm/s" />
        ) : (
          <ECG12Lead kind={c.waveform} keyLeads={keyLeads} caption="ECG DE 12 DERIVACIONES · Las derivaciones marcadas como 'clave' son las diagnósticas" />
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono-clinical text-xs">
          <Vital k="FC" v={`${c.rate || "—"} lpm`} />
          <Vital k="PR" v={c.intervals.pr} />
          <Vital k="QRS" v={c.intervals.qrs} />
          <Vital k="QT" v={c.intervals.qt} />
        </div>

        {/* Hints */}
        {hintsShown > 0 && !done && (
          <div className="mt-6 space-y-2">
            {c.hints.slice(0, hintsShown).map((h, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm animate-fade-up">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span><span className="font-semibold text-warning">Pista {i + 1}:</span> {h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Attempts so far */}
        {attempts.length > 0 && !done && (
          <div className="mt-6 flex flex-wrap gap-2">
            {attempts.map((a, i) => (
              <span key={i} className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-sm text-destructive line-through">
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Input or result */}
        {!done ? (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Tu diagnóstico</label>
              <div className="flex gap-2">
                <Input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="ej. fibrilación auricular, IAMCEST anterior..."
                  className="h-12 text-base"
                  autoFocus
                />
                <Button type="submit" size="lg" className="h-12 px-6 glow-primary">Enviar</Button>
              </div>
            </div>

            {/* Quick options */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">O elige una</p>
              <div className="flex flex-wrap gap-2">
                {c.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setGuess(opt); }}
                    className="rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm transition-colors hover:border-primary/50 hover:bg-primary/10"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          <Result c={c} correct={done.correct} attemptsCount={attempts.length} />
        )}
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

function Result({ c, correct, attemptsCount }: { c: ReturnType<typeof getDailyCase>; correct: boolean; attemptsCount: number }) {
  return (
    <div className="mt-8 animate-fade-up space-y-6">
      <div className={`rounded-xl border p-6 ${correct ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
        <div className="flex items-center gap-3">
          {correct ? (
            <CheckCircle2 className="h-7 w-7 text-success" />
          ) : (
            <XCircle className="h-7 w-7 text-destructive" />
          )}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {correct ? `Resuelto en ${attemptsCount} intento${attemptsCount > 1 ? "s" : ""}` : "Sin intentos restantes"}
            </p>
            <h2 className="font-display text-2xl font-bold">{c.diagnosis}</h2>
          </div>
        </div>
      </div>

      <div className="card-elevated rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold">Explicación clínica</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{c.explanation}</p>

        {c.symptoms && c.symptoms.length > 0 && (
          <>
            <h4 className="mt-6 text-xs uppercase tracking-widest text-warning">Síntomas asociados</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {c.symptoms.map((s, i) => (
                <li key={i} className="rounded-md border border-warning/30 bg-warning/5 px-2.5 py-1 text-xs text-warning">{s}</li>
              ))}
            </ul>
          </>
        )}

        <h4 className="mt-6 text-xs uppercase tracking-widest text-primary">Puntos clave de aprendizaje</h4>
        <ul className="mt-2 space-y-1.5">
          {c.keyPoints.map((k, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-primary">▸</span>
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="glow-primary">
          <Link to="/quiz">Practicar más <RefreshCcw className="ml-1 h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/dashboard">Volver al panel</Link>
        </Button>
      </div>
    </div>
  );
}

export default Daily;
