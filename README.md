<![CDATA[# guidex-react

Lightweight, zero-dependency onboarding tour component for React. Spotlight overlay, smart positioning, keyboard navigation, dark mode support, and fully customizable steps.

<p align="center">
  <img src="https://img.shields.io/npm/v/guidex-react?color=6366f1&label=version" alt="npm version" />
  <img src="https://img.shields.io/bundlephobia/minzip/guidex-react?color=10b981&label=size" alt="bundle size" />
  <img src="https://img.shields.io/npm/l/guidex-react?color=f59e0b" alt="license" />
  <img src="https://img.shields.io/npm/dt/guidex-react?color=3b82f6" alt="downloads" />
</p>

---

## Why guidex-react?

| Feature | guidex-react | intro.js | react-joyride |
|---|---|---|---|
| Zero dependencies | Yes | No | No (7+ deps) |
| React-native support | Hooks + Portal | jQuery-style DOM | Wrapper |
| Bundle size | ~4KB | ~30KB | ~45KB |
| TypeScript | Full types | Partial | Yes |
| Dark mode built-in | Yes | Manual CSS | No |
| localStorage hook | Built-in | Manual | Manual |
| License | MIT (free) | AGPL (paid for commercial) | MIT |

---

## Features

- Zero external dependencies (only React as peer dep)
- Spotlight overlay with smooth transitions and dimmed backdrop
- Smart tooltip positioning (top, bottom, left, right, auto-centered)
- Keyboard navigation (Arrow keys, Enter, Escape)
- Auto-scroll target elements into view
- Animated progress bar with step counter
- Dark mode support (`.dark` class, `[data-theme="dark"]`, `prefers-color-scheme`)
- localStorage persistence via `useOnboardingTour` hook
- Fully typed with TypeScript
- Tiny bundle (~4KB minified + gzipped)
- Works with Next.js, Vite, CRA, Remix, and any React 17+ project

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Step-by-Step Guide](#step-by-step-guide)
  - [1. Install the package](#1-install-the-package)
  - [2. Import styles](#2-import-styles)
  - [3. Mark target elements](#3-mark-target-elements)
  - [4. Define your steps](#4-define-your-steps)
  - [5. Add the component](#5-add-the-component)
- [Framework Examples](#framework-examples)
  - [Next.js (App Router)](#nextjs-app-router)
  - [Next.js (Pages Router)](#nextjs-pages-router)
  - [Vite + React](#vite--react)
- [API Reference](#api-reference)
  - [OnboardingTour Props](#onboardingtour-props)
  - [TourStep](#tourstep)
  - [useOnboardingTour Hook](#useonboardingtourstoragekey)
- [Styling & Customization](#styling--customization)
  - [Dark Mode](#dark-mode)
  - [Custom Colors](#custom-colors)
  - [Custom Tooltip Styles](#custom-tooltip-styles)
  - [CSS Class Reference](#css-class-reference)
- [Advanced Usage](#advanced-usage)
  - [Conditional Steps](#conditional-steps)
  - [Multi-Page Tours](#multi-page-tours)
  - [Trigger Tour from a Button](#trigger-tour-from-a-button)
  - [Track Step Analytics](#track-step-analytics)
  - [Custom Start Delay](#custom-start-delay)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Browser Support](#browser-support)
- [License](#license)

---

## Installation

```bash
# npm
npm install guidex-react

# yarn
yarn add guidex-react

# pnpm
pnpm add guidex-react
```

---

## Quick Start

```tsx
import { OnboardingTour, useOnboardingTour } from "guidex-react";
import "guidex-react/styles.css";

const steps = [
  {
    title: "Welcome!",
    content: "Let us show you around.",
  },
  {
    target: "[data-tour='sidebar']",
    title: "Navigation",
    content: "Use the sidebar to navigate between pages.",
    position: "right" as const,
  },
  {
    target: "[data-tour='search']",
    title: "Search",
    content: "Find anything quickly with the search bar.",
    position: "bottom" as const,
  },
  {
    title: "All Done!",
    content: "You're ready to go. Enjoy!",
  },
];

function App() {
  const { active, complete, reset } = useOnboardingTour("my-app-tour");

  return (
    <div>
      <nav data-tour="sidebar">Sidebar</nav>
      <input data-tour="search" placeholder="Search..." />
      <button onClick={reset}>Replay Tour</button>

      <OnboardingTour steps={steps} active={active} onComplete={complete} />
    </div>
  );
}
```

---

## Step-by-Step Guide

### 1. Install the package

```bash
npm install guidex-react
```

### 2. Import styles

Add this import once at the top level of your app (e.g., `App.tsx`, `layout.tsx`, or `_app.tsx`):

```ts
import "guidex-react/styles.css";
```

This imports the default tour styles (~3KB). You can override any class — see [Styling & Customization](#styling--customization).

### 3. Mark target elements

Add `data-tour` attributes to any HTML element you want to highlight during the tour:

```tsx
<aside data-tour="sidebar">
  {/* sidebar content */}
</aside>

<header data-tour="header">
  {/* header content */}
</header>

<div data-tour="kpi-cards">
  {/* cards */}
</div>

<button data-tour="cta-button">Get Started</button>
```

You can also use any valid CSS selector: `#my-id`, `.my-class`, `[aria-label='Search']`, etc.

### 4. Define your steps

Create an array of `TourStep` objects:

```ts
import type { TourStep } from "guidex-react";

const steps: TourStep[] = [
  // Step without a target — shows as centered floating tooltip
  {
    title: "Welcome to Our App!",
    content: "We'll walk you through the main features in just a few steps.",
  },

  // Step targeting a specific element
  {
    target: "[data-tour='sidebar']",
    title: "Navigation Sidebar",
    content: "Access all your modules from here — Dashboard, Reports, Settings, and more.",
    position: "right",  // tooltip appears to the right of the element
  },

  {
    target: "[data-tour='header']",
    title: "Header Controls",
    content: "Toggle dark mode, view notifications, and manage your profile.",
    position: "bottom",
  },

  {
    target: "[data-tour='kpi-cards']",
    title: "Key Metrics",
    content: "Your most important numbers at a glance.",
    position: "bottom",
  },

  // Final step without a target
  {
    title: "You're All Set!",
    content: "Start exploring. You can replay this tour anytime from Settings.",
  },
];
```

**Position options:**

| Position | Tooltip appears... |
|---|---|
| `"top"` | Above the target element |
| `"bottom"` | Below the target element (default) |
| `"left"` | To the left of the target element |
| `"right"` | To the right of the target element |
| *(omitted)* | Centered on screen (when no `target`) |

### 5. Add the component

```tsx
import { OnboardingTour, useOnboardingTour } from "guidex-react";
import "guidex-react/styles.css";

function App() {
  const { active, complete, reset } = useOnboardingTour("my-app-tour");

  return (
    <>
      {/* Your app content */}
      <Layout>
        <MainContent />
      </Layout>

      {/* Tour — renders via portal to document.body */}
      <OnboardingTour
        steps={steps}
        active={active}
        onComplete={complete}
        startDelay={1000}  // wait 1s for UI to load
      />
    </>
  );
}
```

That's it! The tour shows automatically on first visit and persists completion in localStorage.

---

## Framework Examples

### Next.js (App Router)

```tsx
// app/(dashboard)/layout.tsx
"use client";

import { OnboardingTour, useOnboardingTour } from "guidex-react";
import "guidex-react/styles.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

const steps = [
  { title: "Welcome!", content: "Let's explore your dashboard." },
  { target: "[data-tour='sidebar']", title: "Sidebar", content: "Navigate here.", position: "right" as const },
  { target: "[data-tour='header']", title: "Header", content: "Your controls.", position: "bottom" as const },
  { title: "All Done!", content: "Enjoy the app!" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { active, complete } = useOnboardingTour("dashboard-tour");

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main>{children}</main>
      </div>
      <OnboardingTour steps={steps} active={active} onComplete={complete} startDelay={1500} />
    </div>
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import type { AppProps } from "next/app";
import { OnboardingTour, useOnboardingTour } from "guidex-react";
import "guidex-react/styles.css";

const steps = [/* ... your steps ... */];

export default function App({ Component, pageProps }: AppProps) {
  const { active, complete } = useOnboardingTour("app-tour");

  return (
    <>
      <Component {...pageProps} />
      <OnboardingTour steps={steps} active={active} onComplete={complete} />
    </>
  );
}
```

### Vite + React

```tsx
// src/App.tsx
import { OnboardingTour, useOnboardingTour } from "guidex-react";
import "guidex-react/styles.css";

const steps = [/* ... your steps ... */];

function App() {
  const { active, complete, reset } = useOnboardingTour("vite-app-tour");

  return (
    <div>
      <button onClick={reset}>Replay Tour</button>
      {/* your app */}
      <OnboardingTour steps={steps} active={active} onComplete={complete} />
    </div>
  );
}
```

---

## API Reference

### `<OnboardingTour />` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `TourStep[]` | **required** | Array of tour steps |
| `active` | `boolean` | **required** | Whether the tour is active |
| `onComplete` | `() => void` | **required** | Called when tour finishes or is skipped |
| `doneLabel` | `string` | `"Get Started"` | Label for the final step button |
| `nextLabel` | `string` | `"Next"` | Label for the next button |
| `backLabel` | `string` | `"Back"` | Label for the back button |
| `overlayOpacity` | `number` | `0.55` | Overlay background opacity (0–1) |
| `spotlightPadding` | `number` | `6` | Padding around spotlight highlight (px) |
| `tooltipGap` | `number` | `14` | Gap between target and tooltip (px) |
| `tooltipMaxWidth` | `number` | `360` | Max tooltip width (px) |
| `startDelay` | `number` | `0` | Delay before tour starts (ms) |
| `className` | `string` | — | Custom class for tooltip container |
| `style` | `CSSProperties` | — | Custom inline styles for tooltip |
| `onStepChange` | `(index: number) => void` | — | Callback when step changes |

### `TourStep`

```ts
interface TourStep {
  target?: string;    // CSS selector (e.g. "[data-tour='sidebar']", "#my-id")
  title: string;      // Step title (bold heading)
  content: string;    // Step description text
  position?: "top" | "bottom" | "left" | "right";  // Tooltip position
}
```

- If `target` is omitted, the tooltip appears centered on screen (ideal for welcome/finish steps).
- If the `target` element is not found in the DOM, it falls back to centered.

### `useOnboardingTour(storageKey?)`

React hook for managing tour state with localStorage persistence.

```ts
const { active, start, complete, reset } = useOnboardingTour("my-unique-key");
```

| Return | Type | Description |
|---|---|---|
| `active` | `boolean` | Whether the tour should be shown |
| `start` | `() => void` | Manually activate the tour |
| `complete` | `() => void` | Mark as complete, persist to localStorage, hide tour |
| `reset` | `() => void` | Clear localStorage and restart the tour |

**Default storage key:** `"onboarding_tour_complete"`

Each tour should use a unique key so multiple tours can coexist independently.

---

## Styling & Customization

### Dark Mode

The component supports dark mode out of the box via three methods:

```html
<!-- Method 1: CSS class (next-themes, manual toggle) -->
<html class="dark">

<!-- Method 2: data-theme attribute -->
<html data-theme="dark">

<!-- Method 3: Automatic via prefers-color-scheme (no config needed) -->
```

### Custom Colors

Override the default indigo accent with your brand color:

```css
/* Your global CSS */
.rot-progress-bar {
  background: #10b981;  /* emerald */
}

.rot-btn-next {
  background: #10b981;
}

.rot-btn-next:hover {
  background: #059669;
}

.rot-spotlight {
  border-color: rgba(16, 185, 129, 0.5);
}
```

### Custom Tooltip Styles

```css
/* Glassmorphism effect */
.rot-tooltip {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Rounded tooltip */
.rot-tooltip {
  border-radius: 20px;
}

/* Larger text */
.rot-content {
  font-size: 16px;
}
```

Or use the `className` and `style` props directly:

```tsx
<OnboardingTour
  steps={steps}
  active={active}
  onComplete={complete}
  className="my-custom-tooltip"
  style={{ borderRadius: 20, fontSize: 16 }}
/>
```

### CSS Class Reference

| Class | Element |
|---|---|
| `.rot-spotlight` | Spotlight overlay with cutout |
| `.rot-tooltip` | Tooltip card container |
| `.rot-close` | Close (X) button |
| `.rot-title` | Step title |
| `.rot-content` | Step description text |
| `.rot-progress-track` | Progress bar track |
| `.rot-progress-bar` | Progress bar fill |
| `.rot-footer` | Footer container |
| `.rot-step-count` | "1 of 5" counter text |
| `.rot-buttons` | Button group container |
| `.rot-btn` | Base button style |
| `.rot-btn-next` | Next / Done button |
| `.rot-btn-prev` | Back button |

---

## Advanced Usage

### Conditional Steps

Show different steps based on user role:

```ts
const adminSteps: TourStep[] = [
  { target: "[data-tour='admin-panel']", title: "Admin Panel", content: "Manage users and settings.", position: "right" },
];

const baseSteps: TourStep[] = [
  { title: "Welcome!", content: "Let's get started." },
  { target: "[data-tour='dashboard']", title: "Dashboard", content: "Your overview.", position: "bottom" },
];

const steps = user.role === "admin" ? [...baseSteps, ...adminSteps] : baseSteps;
```

### Multi-Page Tours

Use separate tour keys for each page:

```tsx
// Dashboard page
const { active, complete } = useOnboardingTour("dashboard-tour");

// Settings page
const { active, complete } = useOnboardingTour("settings-tour");
```

### Trigger Tour from a Button

```tsx
function HelpButton() {
  const { active, start, complete } = useOnboardingTour("help-tour");

  return (
    <>
      <button onClick={start}>Help Tour</button>
      <OnboardingTour steps={steps} active={active} onComplete={complete} />
    </>
  );
}
```

### Track Step Analytics

```tsx
<OnboardingTour
  steps={steps}
  active={active}
  onComplete={() => {
    analytics.track("tour_completed");
    complete();
  }}
  onStepChange={(index) => {
    analytics.track("tour_step_viewed", { step: index, title: steps[index].title });
  }}
/>
```

### Custom Start Delay

Wait for data to load before starting the tour:

```tsx
<OnboardingTour
  steps={steps}
  active={active}
  onComplete={complete}
  startDelay={2000}  // wait 2 seconds
/>
```

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` (Right Arrow) / `Enter` | Next step |
| `←` (Left Arrow) | Previous step |
| `Escape` | Skip / close tour |

---

## Browser Support

| Browser | Supported |
|---|---|
| Chrome 80+ | Yes |
| Firefox 80+ | Yes |
| Safari 14+ | Yes |
| Edge 80+ | Yes |

Requires `backdrop-filter` CSS support for the glassmorphism effect. Falls back gracefully in older browsers.

---

## License

MIT
]]>