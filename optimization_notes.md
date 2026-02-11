# Performance Optimization Report

To address the reported site lag, the following optimizations have been applied to `index.html`:

## 1. Disabled Film Grain Animation
**Impact:** High
The CSS animation causing the film grain effect was calculating complex transforms on a full-screen SVG overlay 60 times per second. This is extremely CPU-intensive.
- **Action:** Commented out the `@keyframes grain` animation.
- **Result:** significant drop in main thread styling costs.

## 2. Fixed Event Listener Memory Leak
**Impact:** Critical
The `pauseOnHover` function was defined *inside* the `handleScroll` function, which runs every time the user scrolls. This meant that for every pixel scrolled, **new** `mouseenter` and `mouseleave` event listeners were being attached to the carousel rows, eventually leading to thousands of active listeners and crashing the browser.
- **Action:** Moved `pauseOnHover` definition and execution outside the `handleScroll` function (to the setup block).
- **Result:** Event listeners are now attached only once.

## 3. Optimized Parallax Scrolling
**Impact:** Medium
The scroll event listener was querying the DOM (`document.querySelectorAll(".parallax-text")`) on every frame.
- **Action:** Cached the element query in a variable `parallaxElements` outside the loop.
- **Action:** Added `{ passive: true }` to the scroll event listener to tell the browser the scroll will not be cancelled, improving compositor performance.

The website should now perform smoothly on all devices.
