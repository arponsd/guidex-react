export interface TourStep {
  /** CSS selector for the target element (e.g. "[data-tour='sidebar']"). Omit for a centered floating tooltip. */
  target?: string;
  /** Step title displayed in bold at the top of the tooltip. */
  title: string;
  /** Step description text. Supports HTML if dangerouslySetInnerHTML is used in a custom renderer. */
  content: string;
  /** Preferred tooltip position relative to the target. Defaults to "bottom". */
  position?: "top" | "bottom" | "left" | "right";
}

export interface OnboardingTourProps {
  /** Array of tour steps to display. */
  steps: TourStep[];
  /** Whether the tour is currently active. */
  active: boolean;
  /** Callback fired when the tour completes (user clicks "Get Started" on the last step) or is skipped. */
  onComplete: () => void;
  /** Label for the final step button. Defaults to "Get Started". */
  doneLabel?: string;
  /** Label for the next button. Defaults to "Next". */
  nextLabel?: string;
  /** Label for the back button. Defaults to "Back". */
  backLabel?: string;
  /** Overlay background opacity (0-1). Defaults to 0.55. */
  overlayOpacity?: number;
  /** Padding around the spotlight highlight in px. Defaults to 6. */
  spotlightPadding?: number;
  /** Gap between the target element and tooltip in px. Defaults to 14. */
  tooltipGap?: number;
  /** Max width of the tooltip in px. Defaults to 360. */
  tooltipMaxWidth?: number;
  /** Delay in ms before the tour starts. Defaults to 0. */
  startDelay?: number;
  /** Custom class name for the tooltip container. */
  className?: string;
  /** Custom inline styles for the tooltip container. */
  style?: React.CSSProperties;
  /** Callback fired when the step changes. Receives the new step index. */
  onStepChange?: (stepIndex: number) => void;
}
