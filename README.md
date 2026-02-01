# Brew Resume Simulator

A single-page prototype that demonstrates a **brew-resume** feature for pod coffee machines.

<h3>
  <a href="https://sunzid02.github.io/coffee_coffee/" target="_blank">
    👉 View Live Demo
  </a>
</h3>
---

## The Problem

Many pod machines behave like this when the water tank runs dry mid-brew:

1. Extraction stops immediately.
2. User refills the tank.
3. Machine **restarts the entire brew from zero**.

Restarting resets the extraction path. The early phase of extraction pulls different chemical compounds than the later phase, so a full restart produces a noticeably different (often over-extracted) cup compared to what was intended.

---

## The Proposed Feature — Brew Resume

Instead of restarting, the machine should:

1. **Pause** when it detects low water during extraction.
2. **Remember** how many millilitres have already been brewed.
3. After the user refills, **resume extraction from the paused point**.

This keeps the extraction curve intact and delivers a more consistent cup.

---

## What the Demo Shows

| Element | Purpose |
|---|---|
| **State machine** | Five discrete states (`IDLE → HEATING → EXTRACTING → PAUSED_LOW_WATER → FINISHED`) with explicit transition rules. |
| **Resume vs Restart toggle** | Switch between the new resume behaviour (default) and the legacy restart behaviour so you can compare them side by side in the same session. |
| **Live metrics** | Brewed, remaining, and tank volumes update every 200 ms during extraction. |
| **Progress bar** | Visual 0–100 % indicator tied to brewed / target. |
| **Event log** | Append-only, time-stamped log of every machine event — useful for understanding the flow at a glance. |
| **Educational copy** | A short contextual note that flips based on the selected mode, explaining *why* resume and restart produce different results. |

---

## Running Locally

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

https://sunzid02.github.io/coffee_coffee/

---

## Tech Stack

* **Vite** — build & dev server
* **React 18** — UI
* **TypeScript** — types
* **Plain CSS** — no UI library dependencies
