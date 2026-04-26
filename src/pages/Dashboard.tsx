import { Link } from "react-router-dom";
import { Flame, Target, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ECGStrip } from "@/components/ECGStrip";
import { computeAccuracy, loadStats, todayKey } from "@/lib/storage";
import { CASES, getDailyCase } from "@/data/cases";

const Dashboard = () => {
  const stats = loadStats();
  const accuracy = computeAccuracy(stats);
  const daily = getDailyCase();
  const todayDone = !!stats.dailyHistory[todayKey()];

  const categoryCounts = CASES.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-10">
        <div className="mb-8">
          <p className="font-mono-clinical text-xs uppercase tracking-widest text-primary">
            Bienvenido de nuevo
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">Tu sala de control</h1>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={Flame} label="Racha actual" value={`${stats.streak} día${stats.streak !== 1 ? "s" : ""}`} accent="text-warning" />
          <StatCard icon={TrendingUp} label="Mejor racha" value={`${stats.bestStreak}`} />
          <StatCard icon={Target} label="Precisión" value={`${accuracy}%`} accent="text-primary" />
          <StatCard icon={Calendar} label="Casos resueltos" value={`${stats.attempts.filter(a => a.correct).length}`} />
        </div>

        {/* Daily challenge */}
        <section className="mt-10">
          <div className="card-elevated overflow-hidden rounded-2xl">
            <div className="grid gap-0 lg:grid-cols-[1fr_420px]">
              <div className="p-8">
                <div className="flex items-center gap-2 font-mono-clinical text-xs uppercase tracking-widest text-primary">
                  <Flame className="h-3.5 w-3.5" /> ECG diario de hoy
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold">
                  {todayDone ? "Diario completado." : "Hay un nuevo trazado esperándote."}
                </h2>
                <p className="mt-3 max-w-md text-muted-foreground">
                  {todayDone
                    ? `${stats.dailyHistory[todayKey()].correct ? "Acertaste" : "Fallaste"} el reto de hoy. Vuelve mañana a medianoche.`
                    : "Tienes 4 intentos. Las pistas se desbloquean conforme avanzas. No rompas la racha."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="glow-primary">
                    <Link to="/daily">
                      {todayDone ? "Revisar el de hoy" : "Jugar diario"} <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/quiz">Practicar en su lugar</Link>
                  </Button>
                </div>
              </div>
              <div className="relative bg-[hsl(220_35%_4%)] p-6">
                <ECGStrip kind={daily.waveform} height={220} animated showLabel="DIARIO · DERIVACIÓN II" />
                <div className="mt-3 grid grid-cols-3 gap-3 font-mono-clinical text-[11px]">
                  <Pill k="FC" v={`${daily.rate || "—"} lpm`} />
                  <Pill k="QRS" v={daily.intervals.qrs} />
                  <Pill k="DIFICULTAD" v={difficultyLabel(daily.difficulty)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold">Preguntas por categoría</h2>
            <Link to="/quiz" className="text-sm text-primary hover:underline">Ver todas →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <Link
                key={cat}
                to={`/quiz?category=${encodeURIComponent(cat)}`}
                className="card-elevated group rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-semibold">{cat}</span>
                  <span className="font-mono-clinical text-xs text-muted-foreground">{count}</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary/70 transition-all group-hover:bg-primary" style={{ width: `${Math.min(100, count * 18)}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

function difficultyLabel(d: string) {
  if (d === "beginner") return "PRINCIPIANTE";
  if (d === "intermediate") return "INTERMEDIO";
  if (d === "advanced") return "AVANZADO";
  return d.toUpperCase();
}

function StatCard({ icon: Icon, label, value, accent = "text-foreground" }: { icon: any; label: string; value: string; accent?: string }) {
  return (
    <div className="card-elevated rounded-xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <div className={`mt-3 font-display text-3xl font-bold ${accent}`}>{value}</div>
    </div>
  );
}

function Pill({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-secondary/40 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="text-primary">{v}</div>
    </div>
  );
}

export default Dashboard;
