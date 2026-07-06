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
    <div className="min-h-screen grid md:grid-cols-2 bg-offwhite">
      <div className="hidden md:flex flex-col justify-between p-10 bg-royal text-white relative overflow-hidden">
        <div>
          <div className="font-serif text-4xl leading-tight">Alpine-Eco</div>
          <div className="text-xs uppercase tracking-[0.14em] mt-1 text-white/70">Notebooks & Diaries</div>
        </div>
        <div>
          <div className="font-serif text-5xl leading-[1.05]">The Accounting Tool</div>
          <p className="mt-4 max-w-md text-white/80 text-sm leading-relaxed">
            Manage quotes, invoices, deliveries and job cards for the Alpine-Eco factory floor.
          </p>
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">Built by Muzi</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <div className="md:hidden font-serif text-3xl text-ink">Alpine-Eco</div>
            <h1 className="font-serif text-2xl text-ink mt-2">
              {mode === "in" ? "Sign in" : "Create account"}
            </h1>
            <p className="text-sm text-muted-navy mt-1">
              {mode === "in" ? "Access the workflow." : "Staff registration."}
            </p>
          </div>

          {mode === "up" && (
            <div>
              <label className="text-xs text-muted-navy">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-muted-navy">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
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
              className="mt-1 w-full px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
            />
          </div>

          <button
            disabled={loading}
            className="btn-uppercase w-full py-2.5 bg-royal text-white hover:bg-royal-deep disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}
          </button>

          <div className="text-center text-xs text-muted-navy">
            {mode === "in" ? "No account?" : "Have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "in" ? "up" : "in")}
              className="text-royal font-medium"
            >
              {mode === "in" ? "Create one" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
