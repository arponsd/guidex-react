<div align="center">

# guidex-react

**Lightweight, zero-dependency onboarding tour component for React.**\
Spotlight overlay, smart positioning, keyboard navigation, dark mode support, and fully customizable steps.

[![npm version](https://img.shields.io/npm/v/guidex-react?color=6366f1&label=version&style=flat-square)](https://www.npmjs.com/package/guidex-react)
[![bundle size](https://img.shields.io/bundlephobia/minzip/guidex-react?color=10b981&label=size&style=flat-square)](https://bundlephobia.com/package/guidex-react)
[![license](https://img.shields.io/npm/l/guidex-react?color=f59e0b&style=flat-square)](./LICENSE)
[![downloads](https://img.shields.io/npm/dt/guidex-react?color=3b82f6&style=flat-square)](https://www.npmjs.com/package/guidex-react)

[Installation](#installation) &bull; [Quick Start](#quick-start) &bull; [API Reference](#api-reference) &bull; [Styling](#styling--customization) &bull; [Examples](#framework-examples)

</div>

<br/>

## Why guidex-react?

| | guidex-react | intro.js | react-joyride |
|:---|:---:|:---:|:---:|
| **Zero dependencies** | ~4 KB | ~30 KB (7+ deps) | ~45 KB |
| **React-native support** | Hooks + Portal | jQuery-style DOM | Wrapper |
| **TypeScript** | Full | Partial | Full |
| **Dark mode** | Built-in | Manual CSS | No |
| **localStorage** | Built-in hook | Manual | Manual |
| **License** | MIT (free) | AGPL (paid commercial) | MIT |

<br/>

## Installation

```bash
npm install guidex-react
```

<details>
<summary>yarn / pnpm</summary>

```bash
yarn add guidex-react
# or
pnpm add guidex-react
```

</details>

<br/>

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

<br/>

## Step-by-Step Guide

### 1. Import styles

Add this once at the top level of your app (`App.tsx`, `layout.tsx`, or `_app.tsx`):

```ts
import "guidex-react/styles.css";
```

### 2. Mark target elements

Add `data-tour` attributes to elements you want to highlight:

```tsx
<aside data-tour="sidebar">...</aside>
<header data-tour="header">...</header>
<button data-tour="cta-button">Get Started</button>
```

> You can also use any valid CSS selector: `#my-id`, `.my-class`, `[aria-label='Search']`

### 3. Define your steps

```ts
import type { TourStep } from "guidex-react";

const steps: TourStep[] = [
  // No target = centered floating tooltip (great for welcome/finish)
  { title: "Welcome!", content: "We'll walk you through the main features." },

  // With target = spotlight on element
  {
    target: "[data-tour='sidebar']",
    title: "Sidebar",
    content: "Navigate between pages here.",
    position: "right",
  },

  { title: "You're All Set!", content: "Start exploring." },
];
```

**Position options:**

| Position | Tooltip appears... |
|:---|:---|
| `"top"` | Above the target |
| `"bottom"` | Below the target *(default)* |
| `"left"` | Left of the target |
| `"right"` | Right of the target |
| *(omitted)* | Centered on screen |

### 4. Add the component

```tsx
function App() {
  const { active, complete, reset } = useOnboardingTour("my-app-tour");

  return (
    <>
      <Layout>
        <MainContent />
      </Layout>

      <OnboardingTour
        steps={steps}
        active={active}
        onComplete={complete}
        startDelay={1000}
      />
    </>
  );
}
```

The tour shows automatically on first visit and persists completion in `localStorage`.

<br/>

## Framework Examples

<details>
<summary><strong>Next.js (App Router)</strong></summary>

```tsx
// app/(dashboard)/layout.tsx
"use client";

import { OnboardingTour, useOnboardingTour } from "guidex-react";
import "guidex-react/styles.css";

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

</details>

<details>
<summary><strong>Next.js (Pages Router)</strong></summary>

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

</details>

<details>
<summary><strong>Vite + React</strong></summary>

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
      <OnboardingTour steps={steps} active={active} onComplete={complete} />
    </div>
  );
}
```

</details>

<br/>

## API Reference

### `<OnboardingTour />` Props

| Prop | Type | Default | Description |
|:---|:---|:---:|:---|
| `steps` | `TourStep[]` | *required* | Array of tour steps |
| `active` | `boolean` | *required* | Whether the tour is active |
| `onComplete` | `() => void` | *required* | Called when tour finishes or is skipped |
| `doneLabel` | `string` | `"Get Started"` | Label for the final step button |
| `nextLabel` | `string` | `"Next"` | Label for the next button |
| `backLabel` | `string` | `"Back"` | Label for the back button |
| `overlayOpacity` | `number` | `0.55` | Overlay background opacity (0-1) |
| `spotlightPadding` | `number` | `6` | Padding around spotlight (px) |
| `tooltipGap` | `number` | `14` | Gap between target and tooltip (px) |
| `tooltipMaxWidth` | `number` | `360` | Max tooltip width (px) |
| `startDelay` | `number` | `0` | Delay before tour starts (ms) |
| `className` | `string` | - | Custom class for tooltip container |
| `style` | `CSSProperties` | - | Inline styles for tooltip |
| `onStepChange` | `(index: number) => void` | - | Callback when step changes |

### `TourStep`

```ts
interface TourStep {
  target?: string;                                   // CSS selector
  title: string;                                     // Bold heading
  content: string;                                   // Description text
  position?: "top" | "bottom" | "left" | "right";   // Tooltip placement
}
```

- **No `target`** = centered floating tooltip (ideal for welcome/finish screens)
- **Target not found in DOM** = graceful fallback to centered

### `useOnboardingTour(storageKey?)`

```ts
const { active, start, complete, reset } = useOnboardingTour("my-unique-key");
```

| Return | Type | Description |
|:---|:---|:---|
| `active` | `boolean` | Whether the tour should show |
| `start` | `() => void` | Manually activate the tour |
| `complete` | `() => void` | Mark complete, persist to `localStorage` |
| `reset` | `() => void` | Clear storage and restart |

> Default key: `"onboarding_tour_complete"`. Use unique keys when running multiple tours.

<br/>

## Styling & Customization

### Dark Mode

Supported out of the box via three methods:

```html
<!-- CSS class (next-themes, manual toggle) -->
<html class="dark">

<!-- data-theme attribute -->
<html data-theme="dark">

<!-- Automatic via prefers-color-scheme (no config needed) -->
```

### Custom Brand Colors

```css
.rot-btn-next       { background: #10b981; }
.rot-btn-next:hover { background: #059669; }
.rot-progress-bar   { background: #10b981; }
.rot-spotlight      { border-color: rgba(16, 185, 129, 0.5); }
```

### Custom Tooltip Styles

```css
/* Glassmorphism */
.rot-tooltip {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
}
```

Or via props:

```tsx
<OnboardingTour
  className="my-custom-tooltip"
  style={{ borderRadius: 20, fontSize: 16 }}
  ...
/>
```

<details>
<summary><strong>CSS Class Reference</strong></summary>

| Class | Element |
|:---|:---|
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

</details>

<br/>

## Advanced Usage

<details>
<summary><strong>Conditional Steps (by user role)</strong></summary>

```ts
const adminSteps: TourStep[] = [
  { target: "[data-tour='admin-panel']", title: "Admin Panel", content: "Manage users here.", position: "right" },
];

const baseSteps: TourStep[] = [
  { title: "Welcome!", content: "Let's get started." },
  { target: "[data-tour='dashboard']", title: "Dashboard", content: "Your overview.", position: "bottom" },
];

const steps = user.role === "admin" ? [...baseSteps, ...adminSteps] : baseSteps;
```

</details>

<details>
<summary><strong>Multi-Page Tours</strong></summary>

Use separate storage keys per page:

```tsx
// Dashboard page
const { active, complete } = useOnboardingTour("dashboard-tour");

// Settings page
const { active, complete } = useOnboardingTour("settings-tour");
```

</details>

<details>
<summary><strong>Trigger Tour from a Button</strong></summary>

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

</details>

<details>
<summary><strong>Track Step Analytics</strong></summary>

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

</details>

<details>
<summary><strong>Custom Start Delay</strong></summary>

Wait for data to load before starting:

```tsx
<OnboardingTour steps={steps} active={active} onComplete={complete} startDelay={2000} />
```

</details>

<br/>

## Keyboard Shortcuts

| Key | Action |
|:---|:---|
| `→` Right Arrow / `Enter` | Next step |
| `←` Left Arrow | Previous step |
| `Escape` | Skip / close tour |

<br/>

## Browser Support

| Browser | Version |
|:---|:---|
| Chrome | 80+ |
| Firefox | 80+ |
| Safari | 14+ |
| Edge | 80+ |

> Requires `backdrop-filter` support for glassmorphism. Falls back gracefully in older browsers.

<br/>

## Features

- Zero external dependencies (React peer dep only)
- Spotlight overlay with smooth transitions
- Smart tooltip positioning (top, bottom, left, right, auto-centered)
- Keyboard navigation (Arrow keys, Enter, Escape)
- Auto-scroll target elements into view
- Animated progress bar with step counter
- Dark mode support (`.dark`, `[data-theme="dark"]`, `prefers-color-scheme`)
- `localStorage` persistence via `useOnboardingTour` hook
- Fully typed with TypeScript
- ~4 KB minified + gzipped
- Works with Next.js, Vite, CRA, Remix, and any React 17+ project

<br/>

## License

[MIT](./LICENSE)
