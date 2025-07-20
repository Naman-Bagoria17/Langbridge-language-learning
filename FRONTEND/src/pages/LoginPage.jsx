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
    <div className="min-h-screen bg-base-100 flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 grid-cols-1 z-10 relative shadow-2xl rounded-3xl overflow-hidden bg-base-200 border border-base-300">
        {/* Left: Info and Features */}
        <div className="p-10 flex flex-col justify-center space-y-10 bg-base-300 relative">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCapIcon className="w-7 h-7 text-primary-content" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-base-content">LangBridge</h1>
          </div>

          <p className="text-lg text-base-content/70 max-w-md">
            Learn any language by connecting with real people around the world.
            Practice with native speakers through live video calls.
          </p>

          {/* Feature Cards */}
          <div className="space-y-4">
            {[
              {
                icon: <VideoIcon className="text-primary w-6 h-6" />,
                title: "Live Video Conversations",
                subtitle: "Talk directly with fluent native speakers.",
              },
              {
                icon: <GlobeIcon className="text-primary w-6 h-6" />,
                title: "Global Language Exchange",
                subtitle: "Connect with people from all over the world.",
              },
              {
                icon: <LanguagesIcon className="text-primary w-6 h-6" />,
                title: "Multilingual Support",
                subtitle: "Choose from over 30 languages to learn.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group p-5 bg-base-300/50 border border-base-300 rounded-xl hover:bg-base-300 transition-all duration-300 shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div>{item.icon}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-base-content">
                      {item.title}
                    </h4>
                    <p className="text-sm text-base-content/70">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-10 bg-base-200 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-base-content/70 mb-6">
              Sign in to start learning and connecting.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-error/20 border border-error/40 rounded-md text-sm text-error">
                {error.response?.data?.message || error.message || "Login error"}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-base-content">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/50 focus:border-primary"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-base-content">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full pr-12 bg-base-100 text-base-content placeholder-base-content/50 focus:border-primary"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
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
                className="btn btn-primary w-full"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="text-center pt-4 text-base-content/70 text-sm">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:underline"
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
