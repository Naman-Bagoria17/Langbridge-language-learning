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
} from "lucide-react";
import {
  getUserAvatar,
  generateRandomAvatar,
  avatarConfigToUrl,
} from "../utils/avatar";
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
    avatarConfig: authUser?.avatarConfig || null,
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
    const randomConfig = generateRandomAvatar();
    setFormState({ ...formState, avatarConfig: randomConfig });
    toast.success("Random avatar generated!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-base-200 border border-base-300 rounded-2xl shadow-xl p-8 overflow-y-auto max-h-[95vh]">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-primary text-primary-content rounded-xl flex items-center justify-center">
              <GraduationCapIcon className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-base-content">LangBridge</span>
          </div>
          <h2 className="text-xl font-semibold text-base-content">Complete Your Profile</h2>
          <p className="text-sm text-base-content/70 mt-2 max-w-xl mx-auto">
            Tell us about yourself to connect with other language learners.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="avatar">
              <div className="w-32 h-32 rounded-full bg-base-300 ring ring-primary ring-offset-base-100 ring-offset-4 shadow">
                <img
                  src={
                    formState.avatarConfig
                      ? avatarConfigToUrl(formState.avatarConfig)
                      : getUserAvatar(authUser || { email: "preview" })
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="btn btn-outline rounded-full flex items-center gap-2 border-primary-content text-primary-content hover:font-semibold hover:border-2"
            >
              <ShuffleIcon className="w-4 h-4" />
              Generate Random Avatar
            </button>
            <p className="text-xs text-center text-base-content/70 max-w-xs">
              {formState.avatarConfig
                ? "Custom avatar selected"
                : "Default avatar based on your profile"}
            </p>
          </div>

          {/* Full Name & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label text-base-content">
                <span className="label-text">
                  <UserIcon className="inline w-4 h-4 mr-2" />
                  Full Name
                </span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/50"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="label text-base-content">
                <span className="label-text">
                  <MapPinIcon className="inline w-4 h-4 mr-2" />
                  Location
                </span>
              </label>
              <input
                type="text"
                name="location"
                value={formState.location}
                onChange={(e) =>
                  setFormState({ ...formState, location: e.target.value })
                }
                className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/50"
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="label text-base-content">
              <span className="label-text">
                <MessageSquareIcon className="inline w-4 h-4 mr-2" />
                Bio
              </span>
            </label>
            <textarea
              name="bio"
              value={formState.bio}
              onChange={(e) =>
                setFormState({ ...formState, bio: e.target.value })
              }
              className="textarea textarea-bordered w-full h-24 resize-none bg-base-100 text-base-content placeholder-base-content/50"
              placeholder="Tell others about yourself and your language learning goals..."
              required
            />
          </div>

          {/* Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label text-base-content">
                <span className="label-text">
                  <GlobeIcon className="inline w-4 h-4 mr-2" />
                  Native Language
                </span>
              </label>
              <select
                name="nativeLanguage"
                value={formState.nativeLanguage}
                onChange={(e) =>
                  setFormState({ ...formState, nativeLanguage: e.target.value })
                }
                className="select select-bordered w-full bg-base-100 text-base-content"
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
              <label className="label text-base-content">
                <span className="label-text">
                  <GraduationCapIcon className="inline w-4 h-4 mr-2" />
                  Learning Language
                </span>
              </label>
              <select
                name="learningLanguage"
                value={formState.learningLanguage}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    learningLanguage: e.target.value,
                  })
                }
                className="select select-bordered w-full bg-base-100 text-base-content"
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
                <div className="flex items-center gap-2 justify-center">
                  <GraduationCapIcon className="w-5 h-5" />
                  Complete Profile & Start Learning
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <span className="loading loading-spinner loading-sm" />
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
