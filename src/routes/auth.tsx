import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp, user } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && pathname === "/auth") nav({ to: "/" });
  }, [user, pathname, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = mode === "in" ? await signIn(email, password) : await signUp(email, password, name);
    setLoading(false);
    if (r.error) {
      toast.error(r.error.message);
    } else if (mode === "up") {
      toast.success("Account created. You can sign in now.");
      setMode("in");
    }
  }

  return (
    <div className="min-h-[100dvh] grid md:grid-cols-2 bg-offwhite">
      <div className="hidden md:flex flex-col justify-between p-10 bg-royal text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 10%, rgba(255,255,255,0.12), transparent), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(0,0,0,0.15), transparent)",
          }}
        />
        <div className="relative flex items-center gap-4">
          <img
            src="/trend-capital-logo.png"
            alt="Trend Capital"
            className="w-16 h-16 rounded-full ring-2 ring-white/20 shadow-lg bg-white"
          />
          <div>
            <div className="font-serif text-2xl leading-tight font-semibold">Trend Capital</div>
            <div className="text-[10px] uppercase tracking-[0.16em] mt-1 text-white/70">
              Capital & Commerce
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="font-serif text-4xl leading-[1.05] font-semibold tracking-tight">
            Workflow Platform
          </div>
          <p className="mt-4 max-w-md text-white/80 text-sm leading-relaxed">
            Manage quotes, invoices, deliveries and job cards for Trend Capital operations.
          </p>
        </div>
        <div className="relative text-[10px] uppercase tracking-[0.18em] text-white/50">
          Built by Muzi
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5 glass-card p-8 hover-lift">
          <div>
            <div className="md:hidden flex items-center gap-3 mb-4">
              <img src="/trend-capital-logo.png" alt="" className="w-10 h-10 rounded-full shadow-sm" />
              <span className="font-serif text-2xl text-ink font-semibold">Trend Capital</span>
            </div>
            <h1 className="font-serif text-2xl text-ink font-semibold">
              {mode === "in" ? "Sign in" : "Create account"}
            </h1>
            <p className="text-sm text-muted-navy mt-1">
              {mode === "in" ? "Access the workflow." : "Staff registration."}
            </p>
          </div>

          {mode === "up" && (
            <div>
              <label className="text-xs text-muted-navy">Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 input-field" />
            </div>
          )}
          <div>
            <label className="text-xs text-muted-navy">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 input-field"
            />
          </div>
          <div>
            <label className="text-xs text-muted-navy">Password</label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-uppercase w-full py-2.5 bg-royal text-primary-foreground hover:bg-royal-deep disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}
          </button>

          <div className="text-center text-xs text-muted-navy">
            {mode === "in" ? "No account?" : "Have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "in" ? "up" : "in")}
              className="text-royal font-medium hover:underline"
            >
              {mode === "in" ? "Create one" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
