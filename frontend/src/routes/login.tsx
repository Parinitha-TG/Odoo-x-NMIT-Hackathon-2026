import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { redirectIfAuthenticated } from "@/lib/auth-guard";

export const Route = createFileRoute("/login")({
  beforeLoad: () => redirectIfAuthenticated(),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<"employee" | "hr">("employee");
  const [email, setEmail] = useState("nirjala.chauhan@dayflow.io");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole: "employee" | "hr") => {
    setRole(newRole);
    setError("");

    if (newRole === "employee") {
      setEmail("nirjala.chauhan@dayflow.io");
    } else {
      setEmail("hr@dayflow.io");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const result = await login(email.trim(), password);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Navigate based on selected role (backend confirms actual role)
    if (role === "hr") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2">

          {/* Left branding panel */}
          <div className="hidden md:flex bg-blue-600 text-white p-12 flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">Dayflow</h1>
                  <p className="text-sm text-blue-100">
                    HR Workspace
                  </p>
                </div>
              </div>

              <div className="mt-20">
                <h2 className="text-4xl font-bold leading-tight">
                  Your work.
                  <br />
                  One workspace.
                </h2>

                <p className="mt-5 max-w-sm text-blue-100 leading-7">
                  Manage attendance, leave, payroll and employee information
                  from one simple HR workspace.
                </p>
              </div>
            </div>

            <div className="text-sm text-blue-100">
              Secure HR workspace
            </div>
          </div>

          {/* Login panel */}
          <div className="p-8 sm:p-12">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 md:hidden mb-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-950">
                  Dayflow
                </h1>
                <p className="text-sm text-slate-500">
                  HR Workspace
                </p>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <p className="text-sm font-semibold text-blue-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Sign in to Dayflow
              </h2>

              <p className="mt-2 text-slate-500">
                Access your employee workspace or HR console.
              </p>

              {/* Role selection */}
              <div className="mt-8">
                <label className="text-sm font-semibold text-slate-800">
                  Continue as
                </label>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("employee")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      role === "employee"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Employee
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange("hr")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      role === "hr"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    HR Admin
                  </button>
                </div>
              </div>

              {/* Login form */}
              <form onSubmit={handleLogin} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employee@dayflow.io"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo accounts */}
              <div className="mt-7 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-800">
                  Demo accounts
                </p>

                <div className="mt-2 space-y-1 text-sm text-slate-500">
                  <p>
                    Employee:{" "}
                    <span className="text-slate-700">
                      nirjala.chauhan@dayflow.io
                    </span>
                  </p>

                  <p>
                    HR Admin:{" "}
                    <span className="text-slate-700">
                      hr@dayflow.io
                    </span>
                  </p>
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-slate-400">
                Frontend demo authentication · Backend authentication will
                be connected separately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}