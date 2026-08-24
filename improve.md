🧵 Optimize Native Threading & NavigationDelay heavy rendering: Use React Native's InteractionManager.runAfterInteractions to defer rendering heavy screen content until the navigation slide-in animation finishes.Isolate the AI module: Ensure your custom expo-pose-detector runs strictly on a background thread or a dedicated native thread so it never blocks the main UI or JS threads.Toggle camera states: Completely unmount or pause the camera/AI preview when navigating away from the detection screen to free up CPU and GPU memory.📦 Component & List OptimizationUse FlashList: Replace standard FlatList components with Shopify's @shopify/flash-list. It recycles native views and drastically reduces scrolling lag.Memoize list items: Always wrap your list item components in React.memo and use strict keyExtractor keys (never use array indexes).Fix NativeWind overhead: Ensure you are using the latest version of NativeWind (v4+), which optimizes class parsing via a Babel plugin rather than resolving styles dynamically at runtime.🕵️‍♂️ Native Profiling ToolsUse the Perf Monitor: Open the Expo developer menu and turn on the Performance Monitor. Watch for JS frame drops (which indicate heavy JS execution) versus UI frame drops (which indicate native view overload).Profile with Hermes: Use the Chrome DevTools profile feature connected to your Hermes engine to record a timeline trace and pinpoint exactly which function is blocking the thread. Are you using FlashList or standard FlatList for your heavy data streams?Is NativeWind v4 configured with compile-time styling, or are you on an older version?Do you notice any lingering lag when the camera module initializes?I can help you audit specific components or provide a template for deferred rendering.## 🚀 Fix App Lag With Skeleton Screens + Shimmer Loading

Optimize the entire app so users never see blank screens, frozen UI, or sudden image pop-ins while content is loading.

### 1. Implement Skeleton Screens Everywhere

Replace empty/loading states with polished **Skeleton Screens** and a subtle **Shimmer Effect**, similar to modern apps like YouTube, Instagram, and TikTok.

Use skeleton placeholders for:

* Images
* Profile pictures
* Template cards
* Feed cards
* Text/content blocks
* Lists
* Grid items
* Home screen sections
* Template details
* Search results
* User profiles
* Any API/database-loaded content

The skeleton must have approximately the **same dimensions as the final content** so the layout does not jump when loading finishes.

### 2. Shimmer Animation

Create a lightweight animated shimmer moving across the skeleton placeholder.

Requirements:

* Smooth animation
* Very low CPU/GPU usage
* No heavy JavaScript animation loops
* Prefer CSS/native animation where possible
* 60 FPS target
* Respect `prefers-reduced-motion`
* Do not run unnecessary animations when the component is off-screen

Example visual behavior:

`[████████░░░░] → [████████░░░░] → [░░████████░░] → [░░░░████████]`

The shimmer should be subtle and premium, not distracting.

### 3. Image Loading Optimization

Images are one of the biggest causes of perceived lag.

Implement:

* Progressive image loading
* Image placeholders before the real image appears
* Lazy loading for images below the viewport
* Prioritize above-the-fold images
* Proper image dimensions/aspect ratios
* Modern formats such as WebP/AVIF where supported
* Responsive image sizes
* Image compression
* Thumbnail/low-resolution preview before full-resolution image
* Browser/native caching
* Avoid loading the same image multiple times

Do NOT download full-resolution images if a smaller version is sufficient for the current UI.

### 4. Prevent Layout Shift

Reserve the exact space required for every image/card before the content loads.

For example:

```text
Before:
┌─────────────────────┐
│   SKELETON IMAGE    │
│                     │
│                     │
├─────────────────────┤
│ ████████████████    │
│ ██████████          │
└─────────────────────┘

After:
┌─────────────────────┐
│    REAL IMAGE       │
│                     │
│                     │
├─────────────────────┤
│ Template Title      │
│ Description         │
└─────────────────────┘
```

The card dimensions must remain identical during the transition.

### 5. Never Block the Entire App

Do NOT use a global spinner for normal content loading.

Bad:

`Loading...` → blank screen → content suddenly appears

Good:

`Skeleton UI` → content progressively appears

Only use a full-screen loader when absolutely necessary, such as:

* Initial authentication verification
* Critical app initialization
* Required security checks
* First-time database initialization

Even then, make the loading screen visually consistent with the app.

### 6. Progressive Rendering

Load the application in stages:

1. Render app shell immediately.
2. Render navigation immediately.
3. Render skeleton cards immediately.
4. Load critical/above-the-fold images first.
5. Load visible content.
6. Load below-the-fold content lazily.
7. Load secondary assets only when required.

The user should be able to interact with the app as early as possible.

### 7. Avoid Waterfall Loading

Audit the entire codebase for sequential requests such as:

```text
Request A
   ↓
Request B
   ↓
Request C
   ↓
Request D
```

Where possible, change this to:

```text
Request A ──┐
Request B ──┤
Request C ──┼──→ Render
Request D ──┘
```

Use parallel requests for independent data.

### 8. Cache Smartly

Implement appropriate caching so previously loaded content does not reload unnecessarily.

Cache:

* Images
* Templates
* User profile data
* Static configuration
* Frequently accessed API responses

When returning to a previously visited screen, display cached content immediately and refresh it in the background when appropriate.

### 9. Skeleton Components

Create reusable components instead of implementing loading animations separately everywhere.

For example:

```text
Skeleton
SkeletonText
SkeletonCircle
SkeletonImage
SkeletonCard
SkeletonProfile
SkeletonTemplate
SkeletonList
```

Keep the implementation centralized so the entire app has a consistent loading experience.

### 10. Template/Image Feed Optimization

For template-heavy screens:

* Do not load every template image simultaneously.
* Use virtualized lists/grids.
* Render only items close to the viewport.
* Use thumbnails in the browsing screen.
* Load full-resolution assets only when the user opens a template.
* Preload the next few likely-to-be-viewed images.
* Cancel unnecessary image requests when the user rapidly scrolls.
* Avoid decoding huge images unnecessarily.

### 11. Authentication Loading

Fix the authentication flow so authentication state is checked **before rendering protected screens**, but do not leave the user staring at a blank screen.

Show an appropriate authentication skeleton while Firebase authentication state is being resolved.

Handle:

* App startup
* Existing session
* Sign in
* Sign up
* Sign out
* Password reset
* Expired session
* Network failure

Do not repeatedly initialize Firebase listeners or authentication checks.

### 12. Error + Retry States

Every skeleton/loading state must have a proper failure state.

Example:

```text
Loading
   ↓
Success → Show Content

Loading
   ↓
Error → Show Friendly Error + Retry
```

Never leave the UI permanently stuck in a shimmer state.

### 13. Performance Audit

After implementing this, inspect the entire codebase for:

* Unnecessary re-renders
* Large image downloads
* Duplicate API calls
* Duplicate Firebase listeners
* Memory leaks
* Unoptimized lists
* Heavy animations
* Blocking JavaScript
* Excessive state updates
* Components rendering unnecessarily
* Missing lazy loading
* Missing memoization where genuinely useful
* Large bundles
* Unused dependencies
* Network waterfalls

Fix the actual causes of lag instead of simply adding loading animations.

### 14. Important Requirement

**Skeleton screens are NOT a substitute for performance optimization.**

The goal is:

**Actual loading time ↓ + perceived loading time ↓ + smooth UI ↑**

Do not hide slow operations behind a shimmer.

### 15. Final Acceptance Criteria

The finished app should:

* Feel instant when navigating between screens.
* Never show unnecessary blank screens.
* Show skeletons immediately when content is unavailable.
* Display images progressively.
* Avoid layout jumping.
* Load above-the-fold content first.
* Lazy-load content below the viewport.
* Cache previously loaded content.
* Avoid duplicate network requests.
* Maintain smooth scrolling.
* Maintain 60 FPS where reasonably achievable.
* Handle slow networks gracefully.
* Handle failed requests with retry options.
* Avoid skeletons flashing for extremely fast requests.

### 16. Test Before Finishing

Test the app under:

* Fast Wi-Fi
* Slow Wi-Fi
* Mobile network
* High latency
* Offline mode
* Cold app launch
* Warm app launch
* Large template collections
* Rapid scrolling
* Repeated navigation
* Sign-in/sign-out
* First-time user
* Returning user

Do not consider the task complete until the loading experience and the underlying performance issues have both been addressed.

**Priority: PERFORMANCE FIRST → SKELETON LOADING → IMAGE OPTIMIZATION → CACHING → SMOOTH TRANSITIONS.** also in apps problems always need permission of camera photos everytime user use it make after giving permission it  dont have this and in camera i know about reference but what does pose guide do it like useless and the ai dont even guide according to live camera also too much delay after capturing photo and also all data goes restart when i leave app sometime and ask againn remove the test things the notification shall go manually ask all permissions before apps start also in shot builder the easy level going out of box also in refrence button when click where ever the user if is mid it should be go on top its ux also i clicked whole app its overall too much laggy please fix it
also add legal required thing in setting to export all datas and etc etc why is not ads still working is admob api wrong or what test ang tell me also i clicked continue with google it didnt did like other app doon it 