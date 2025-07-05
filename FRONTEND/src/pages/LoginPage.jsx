import { useState } from "react";
import {
  GraduationCapIcon,
  EyeIcon,
  EyeOffIcon,
  VideoIcon,
  GlobeIcon,
  LanguagesIcon,
} from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[700px] h-[700px] bg-emerald-500/5 rounded-full top-[-20%] left-[-20%] blur-3xl" />
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full bottom-[-15%] right-[-10%] blur-2xl" />
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 grid-cols-1 z-10 relative shadow-2xl rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 animate-fade-in">
        {/* Left: Info and Features */}
        <div className="p-10 text-white flex flex-col justify-center space-y-10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 relative">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <GraduationCapIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">LangBridge</h1>
          </div>

          <p className="text-lg text-slate-300 max-w-md">
            Learn any language by connecting with real people around the world.
            Practice with native speakers through live video calls.
          </p>

          {/* Feature Cards */}
          <div className="space-y-4">
            {[
              {
                icon: <VideoIcon className="text-emerald-400 w-6 h-6" />,
                title: "Live Video Conversations",
                subtitle: "Talk directly with fluent native speakers.",
              },
              {
                icon: <GlobeIcon className="text-emerald-400 w-6 h-6" />,
                title: "Global Language Exchange",
                subtitle: "Connect with people from all over the world.",
              },
              {
                icon: <LanguagesIcon className="text-emerald-400 w-6 h-6" />,
                title: "Multilingual Support",
                subtitle: "Choose from over 30 languages to learn.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-md shadow-md hover:shadow-emerald-600/10"
              >
                <div className="flex items-center gap-4">
                  <div>{item.icon}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-300">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-10 bg-white/10 backdrop-blur-lg text-white flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-slate-300 mb-6">
              Sign in to start learning and connecting.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100/20 border border-red-300/40 rounded-md text-sm text-red-400">
                {error.response?.data?.message || error.message || "Login error"}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 transition"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 bg-slate-900/60 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 transition"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="text-center pt-4 text-slate-400 text-sm">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-emerald-400 hover:underline hover:text-emerald-300"
                >
                  Create one
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
