import { useState, useCallback } from "react";

const DEFAULT_KEY = "onboarding_tour_complete";

/**
 * Hook to manage onboarding tour state with localStorage persistence.
 *
 * @param storageKey - localStorage key to track completion. Defaults to "onboarding_tour_complete".
 * @returns { active, start, complete, reset }
 */
export function useOnboardingTour(storageKey: string = DEFAULT_KEY) {
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(storageKey);
  });

  const start = useCallback(() => {
    setActive(true);
  }, []);

  const complete = useCallback(() => {
    setActive(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }
  }, [storageKey]);

  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
    setActive(true);
  }, [storageKey]);

  return { active, start, complete, reset };
}
