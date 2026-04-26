import { Trophy, Medal, Flame } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { computeAccuracy, loadStats } from "@/lib/storage";

const FAKE = [
  { name: "Dra. Patel", score: 2840, streak: 42, acc: 94 },
  { name: "EstudianteMed_22", score: 2610, streak: 31, acc: 91 },
  { name: "ECGninja", score: 2455, streak: 28, acc: 89 },
  { name: "ReinaQRS", score: 2310, streak: 24, acc: 87 },
  { name: "ST_elevado", score: 2180, streak: 19, acc: 85 },
  { name: "fan_Sgarbossa", score: 2050, streak: 17, acc: 83 },
  { name: "wenckebach", score: 1980, streak: 15, acc: 81 },
];

const Leaderboard = () => {
  const stats = loadStats();
  const myScore = stats.attempts.filter((a) => a.correct).length * 50 + stats.bestStreak * 30;
  const me = { name: "Tú", score: myScore, streak: stats.streak, acc: computeAccuracy(stats), self: true };
  const board = [...FAKE, me].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-3xl py-10">
        <div className="mb-8">
          <p className="font-mono-clinical text-xs uppercase tracking-widest text-primary">Clasificación global</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Clasificación</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tabla de demostración con compañeros simulados. Conecta Lovable Cloud para habilitar usuarios reales, amigos y rangos en vivo.
          </p>
        </div>

        <div className="card-elevated overflow-hidden rounded-xl">
          <div className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-2 border-b border-border bg-secondary/30 px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>#</span>
            <span>Usuario</span>
            <span className="text-right">Racha</span>
            <span className="text-right">Prec.</span>
            <span className="text-right">Puntos</span>
          </div>
          {board.map((row, i) => (
            <div
              key={row.name + i}
              className={`grid grid-cols-[40px_1fr_80px_80px_80px] gap-2 border-b border-border/50 px-5 py-4 text-sm last:border-0 ${
                (row as any).self ? "bg-primary/10" : ""
              }`}
            >
              <span className="font-mono-clinical font-bold">
                {i === 0 ? <Trophy className="h-4 w-4 text-warning" /> :
                 i === 1 ? <Medal className="h-4 w-4 text-muted-foreground" /> :
                 i === 2 ? <Medal className="h-4 w-4 text-warning/70" /> : i + 1}
              </span>
              <span className={`font-medium ${(row as any).self ? "text-primary" : ""}`}>{row.name}{(row as any).self && " · tú"}</span>
              <span className="text-right font-mono-clinical text-warning">
                <Flame className="mr-1 inline h-3 w-3" />{row.streak}
              </span>
              <span className="text-right font-mono-clinical">{row.acc}%</span>
              <span className="text-right font-mono-clinical font-bold text-primary">{row.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
