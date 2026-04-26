import { Link } from "react-router-dom";
import { Activity, Brain, Trophy, Flame, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ECGStrip } from "@/components/ECGStrip";

const features = [
  {
    icon: Flame,
    title: "ECG Diario",
    body: "Un trazado cuidadosamente elegido cada día. Intentos limitados, pistas progresivas. Construye tu racha.",
  },
  {
    icon: Brain,
    title: "Banco de Preguntas",
    body: "Practica arritmias, isquemia, bloqueos y electrolitos — desde principiante hasta avanzado.",
  },
  {
    icon: Zap,
    title: "Repetición Espaciada",
    body: "Los casos que fallas vuelven cuando más los necesitas. Domina los patrones de alto rendimiento.",
  },
  {
    icon: Target,
    title: "Modo Cronometrado",
    body: "Presión tipo examen. 90 segundos por ECG, compite contra tu mejor marca.",
  },
  {
    icon: Trophy,
    title: "Clasificaciones",
    body: "Compite a nivel global o con tu grupo de estudio. Gana insignias por precisión y rachas.",
  },
  {
    icon: Activity,
    title: "Retroalimentación Anotada",
    body: "Cada respuesta incluye frecuencia, ritmo, intervalos y un punto clave clínico.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 ecg-grid opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

        <div className="container relative pt-24 pb-32 lg:pt-32 lg:pb-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              En vivo · 21 casos · actualizado a diario
            </div>

            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Lee cada ECG <br />
              <span className="text-primary text-glow">como si fuera un latido.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Retos diarios de ECG estilo Wordle, un amplio banco de preguntas y explicaciones
              clínicas instantáneas. Hecho para estudiantes de medicina que quieren reconocer patrones de verdad.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold glow-primary">
                <Link to="/daily">Prueba el ECG de hoy →</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link to="/quiz">Ver banco de preguntas</Link>
              </Button>
            </div>
          </div>

          {/* Hero ECG strip */}
          <div className="mx-auto mt-16 max-w-5xl animate-fade-up">
            <ECGStrip kind="nsr" height={180} animated showLabel="DERIVACIÓN II · 25 mm/s" />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono-clinical text-xs text-muted-foreground">
              <span>FC <span className="text-primary">72 lpm</span></span>
              <span>PR <span className="text-primary">160 ms</span></span>
              <span>QRS <span className="text-primary">90 ms</span></span>
              <span>QT <span className="text-primary">400 ms</span></span>
              <span>EJE <span className="text-primary">+60°</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-secondary/20">
        <div className="container py-24">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Reconocimiento de patrones, <span className="text-primary">entrenado.</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Cada función está diseñada para que ritmos, ejes y cambios del ST se vuelvan instintivos.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group card-elevated rounded-xl p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <div className="card-elevated relative overflow-hidden rounded-2xl px-8 py-16 text-center">
          <div className="absolute inset-0 ecg-grid-soft opacity-50" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Tu próxima guardia empieza ahora.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Sin registro para el reto de hoy. Entra, lee el trazado y comienza tu racha.
            </p>
            <Button asChild size="lg" className="mt-8 h-12 px-8 text-base font-semibold glow-primary">
              <Link to="/daily">Empezar el ECG de hoy</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>EKGdle · Solo para uso educativo</span>
          </div>
          <span className="font-mono-clinical text-xs">v0.1 · Hecho para estudiantes de medicina</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
