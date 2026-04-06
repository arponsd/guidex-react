import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import type { TourStep, OnboardingTourProps } from "./types";

function getTooltipStyle(
  rect: DOMRect | null,
  position: string,
  gap: number
): CSSProperties {
  if (!rect) {
    return {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  const style: CSSProperties = { position: "fixed" };

  switch (position) {
    case "top":
      style.bottom = window.innerHeight - rect.top + gap;
      style.left = rect.left + rect.width / 2;
      style.transform = "translateX(-50%)";
      break;
    case "left":
      style.top = rect.top + rect.height / 2;
      style.right = window.innerWidth - rect.left + gap;
      style.transform = "translateY(-50%)";
      break;
    case "right":
      style.top = rect.top + rect.height / 2;
      style.left = rect.right + gap;
      style.transform = "translateY(-50%)";
      break;
    case "bottom":
    default:
      style.top = rect.bottom + gap;
      style.left = rect.left + rect.width / 2;
      style.transform = "translateX(-50%)";
      break;
  }

  return style;
}

function Spotlight({
  rect,
  padding,
  opacity,
}: {
  rect: DOMRect | null;
  padding: number;
  opacity: number;
}) {
  if (!rect) return null;
  return (
    <div
      className="rot-spotlight"
      style={{
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        boxShadow: `0 0 0 9999px rgba(0,0,0,${opacity})`,
      }}
    />
  );
}

function TooltipCard({
  step,
  current,
  total,
  rect,
  onNext,
  onPrev,
  onSkip,
  gap,
  maxWidth,
  doneLabel,
  nextLabel,
  backLabel,
  className,
  style,
}: {
  step: TourStep;
  current: number;
  total: number;
  rect: DOMRect | null;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  gap: number;
  maxWidth: number;
  doneLabel: string;
  nextLabel: string;
  backLabel: string;
  className?: string;
  style?: CSSProperties;
}) {
  const isFirst = current === 0;
  const isLast = current === total - 1;
  const posStyle = getTooltipStyle(rect, step.position || "bottom", gap);

  return (
    <div
      className={`rot-tooltip ${className || ""}`}
      style={{ ...posStyle, maxWidth, ...style }}
    >
      <button className="rot-close" onClick={onSkip} aria-label="Close tour">
        &#x2715;
      </button>

      <h3 className="rot-title">{step.title}</h3>
      <p className="rot-content">{step.content}</p>

      <div className="rot-progress-track">
        <div
          className="rot-progress-bar"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <div className="rot-footer">
        <span className="rot-step-count">
          {current + 1} of {total}
        </span>
        <div className="rot-buttons">
          {!isFirst && (
            <button className="rot-btn rot-btn-prev" onClick={onPrev}>
              &#8592; {backLabel}
            </button>
          )}
          <button className="rot-btn rot-btn-next" onClick={onNext}>
            {isLast ? doneLabel : nextLabel} {!isLast && <>&#8594;</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OnboardingTour({
  steps,
  active,
  onComplete,
  doneLabel = "Get Started",
  nextLabel = "Next",
  backLabel = "Back",
  overlayOpacity = 0.55,
  spotlightPadding = 6,
  tooltipGap = 14,
  tooltipMaxWidth = 360,
  startDelay = 0,
  className,
  style,
  onStepChange,
}: OnboardingTourProps) {
  const [started, setStarted] = useState(startDelay === 0);
  const [current, setCurrent] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const rafRef = useRef<number>(0);

  // Handle start delay
  useEffect(() => {
    if (!active || started) return;
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [active, started, startDelay]);

  // Reset when tour becomes active
  useEffect(() => {
    if (active) {
      setCurrent(0);
      if (startDelay === 0) setStarted(true);
      else setStarted(false);
    }
  }, [active, startDelay]);

  const updateRect = useCallback(() => {
    const step = steps[current];
    if (!step?.target) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(step.target);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      setTargetRect(null);
    }
  }, [current, steps]);

  useEffect(() => {
    if (!active || !started) return;
    updateRect();

    const handleResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateRect);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, started, current, updateRect]);

  const finish = useCallback(() => {
    setStarted(false);
    onComplete();
  }, [onComplete]);

  const next = useCallback(() => {
    if (current >= steps.length - 1) {
      finish();
    } else {
      const nextStep = current + 1;
      setCurrent(nextStep);
      onStepChange?.(nextStep);
    }
  }, [current, steps.length, finish, onStepChange]);

  const prev = useCallback(() => {
    const prevStep = Math.max(0, current - 1);
    setCurrent(prevStep);
    onStepChange?.(prevStep);
  }, [current, onStepChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!active || !started) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, started, next, prev, finish]);

  if (!active || !started || !steps.length) return null;

  return createPortal(
    <>
      <Spotlight
        rect={targetRect}
        padding={spotlightPadding}
        opacity={overlayOpacity}
      />
      <TooltipCard
        step={steps[current]}
        current={current}
        total={steps.length}
        rect={targetRect}
        onNext={next}
        onPrev={prev}
        onSkip={finish}
        gap={tooltipGap}
        maxWidth={tooltipMaxWidth}
        doneLabel={doneLabel}
        nextLabel={nextLabel}
        backLabel={backLabel}
        className={className}
        style={style}
      />
    </>,
    document.body
  );
}
