import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  GraduationCapIcon,
  ShuffleIcon,
  UserIcon,
  MessageSquareIcon,
  GlobeIcon,
  CameraIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen bg-base-100 relative flex items-center justify-center p-6 overflow-hidden">
      {/* Container */}
      <div className="relative z-10 w-full max-w-3xl bg-base-200 border border-base-300 rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCapIcon className="w-6 h-6 text-primary-content" />
            </div>
            <span className="text-3xl font-bold text-base-content">LangBridge</span>
          </div>
          <h1 className="text-2xl font-bold text-base-content mb-2">Complete Your Profile</h1>
          <p className="text-base-content/70 max-w-xl mx-auto text-sm">
            Tell us about yourself to connect with other language learners.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Pic */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="avatar">
              <div className="w-32 h-32 rounded-full bg-base-300 ring ring-primary ring-offset-base-100 ring-offset-4 shadow-lg">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="w-12 h-12 text-base-content/50" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleRandomAvatar}
              className="btn btn-outline btn-primary"
            >
              <ShuffleIcon className="w-4 h-4" />
              Generate Random Avatar
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-base-content">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/50 focus:border-primary"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-base-content">
                <MapPinIcon className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formState.location}
                onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/50 focus:border-primary"
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-base-content">
              <MessageSquareIcon className="w-4 h-4 inline mr-2" />
              Bio
            </label>
            <textarea
              name="bio"
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className="textarea textarea-bordered w-full bg-base-100 text-base-content placeholder-base-content/50 focus:border-primary h-24 resize-none"
              placeholder="Tell others about yourself and your language learning goals..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-base-content">
                <GlobeIcon className="w-4 h-4 inline mr-2" />
                Native Language
              </label>
              <select
                name="nativeLanguage"
                value={formState.nativeLanguage}
                onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                className="select select-bordered w-full bg-base-100 text-base-content focus:border-primary"
                required
              >
                <option value="">Select your native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-base-content">
                <GraduationCapIcon className="w-4 h-4 inline mr-2" />
                Learning Language
              </label>
              <select
                name="learningLanguage"
                value={formState.learningLanguage}
                onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                className="select select-bordered w-full bg-base-100 text-base-content focus:border-primary"
                required
              >
                <option value="">Select language you're learning</option>
                {LANGUAGES.map((lang) => (
                  <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary w-full"
            >
              {!isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <GraduationCapIcon className="w-5 h-5" />
                  Complete Profile & Start Learning
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Setting up your profile...
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
