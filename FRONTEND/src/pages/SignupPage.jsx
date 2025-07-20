import { useState } from "react";
import {
  GraduationCapIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  MailIcon,
  LockIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import useSignUp from "../hooks/useSignUp";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center relative overflow-hidden">

      {/* Signup Form Card */}
      <div className="z-10 bg-base-200 border border-base-300 shadow-xl rounded-2xl p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <GraduationCapIcon className="w-6 h-6 text-primary-content" />
          </div>
          <h1 className="text-2xl font-bold text-base-content">LangBridge</h1>
        </div>

        {/* Form Title */}
        <h2 className="text-xl font-semibold mb-1 text-center text-base-content">Create Your Account</h2>
        <p className="text-sm text-base-content/70 text-center mb-6">Join the community and start learning</p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-error/20 border border-error/40 rounded-md text-sm text-error">
            {error.response?.data?.message || error.message || "Signup error"}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm mb-1 text-base-content">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full pl-10 bg-base-100 text-base-content placeholder-base-content/50 focus:border-primary"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-base-content">Email</label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10 bg-base-100 text-base-content placeholder-base-content/50 focus:border-primary"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-base-content">Password</label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 pr-12 bg-base-100 text-base-content placeholder-base-content/50 focus:border-primary"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary w-full"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Link to login */}
          <div className="text-center pt-2 text-base-content/70 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-all duration-200"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
