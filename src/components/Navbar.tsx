import { Activity, Flame } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { loadStats } from "@/lib/storage";

export function Navbar() {
  const stats = loadStats();
  const loc = useLocation();
  const links = [
    { to: "/dashboard", label: "Panel" },
    { to: "/daily", label: "Diario" },
    { to: "/quiz", label: "Banco de Preguntas" },
    { to: "/leaderboard", label: "Clasificación" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative grid h-9 w-9 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            EKG<span className="text-primary">dle</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {loc.pathname !== "/" && (
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 py-1.5">
              <Flame className="h-4 w-4 text-warning" />
              <span className="font-mono-clinical text-sm font-semibold">{stats.streak}</span>
              <span className="text-xs text-muted-foreground">día{stats.streak !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
