import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobeIcon, CheckIcon, XIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
import { updateLearningLanguage } from "../lib/api";
import toast from "react-hot-toast";

const LanguageSelector = ({ currentLanguage, onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || "");
  const queryClient = useQueryClient();

  const { mutate: updateLanguage, isPending } = useMutation({
    mutationFn: updateLearningLanguage,
    onSuccess: (data) => {
      toast.success("Learning language updated!");

      // Update the authUser cache immediately with the new language
      queryClient.setQueryData(["authUser"], (oldData) => {
        if (oldData?.user) {
          return {
            ...oldData,
            user: {
              ...oldData.user,
              learningLanguage: selectedLanguage
            }
          };
        }
        return oldData;
      });

      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "coLearners"
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "nativeSpeakers"
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update language");
    },
  });

  const handleSave = () => {
    if (selectedLanguage && selectedLanguage !== currentLanguage) {
      updateLanguage({ learningLanguage: selectedLanguage });
    } else {
      onClose();
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-base-300">
        <div className="flex items-center gap-2">
          <GlobeIcon className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Change Learning Language</span>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-xs"
          disabled={isPending}
        >
          <XIcon className="w-3 h-3" />
        </button>
      </div>

      {/* Language List */}
      <div className="max-h-48 overflow-y-auto">
        {LANGUAGES.map((language) => (
          <button
            key={language}
            onClick={() => handleLanguageSelect(language)}
            className={`w-full text-left px-3 py-2 hover:bg-base-300 transition-colors ${selectedLanguage === language ? "bg-primary/10" : ""
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content">{language}</span>
              {selectedLanguage === language && (
                <CheckIcon className="w-3 h-3 text-primary" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex gap-2 p-3 border-t border-base-300">
        <button
          onClick={onClose}
          className="btn btn-ghost btn-xs flex-1"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="btn btn-primary btn-xs flex-1"
          disabled={isPending || !selectedLanguage}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
