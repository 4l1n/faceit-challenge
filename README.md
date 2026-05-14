# Faceit Challenge: Real-Time Feed

Hey there! 👋 Welcome to my implementation of the Faceit Frontend Challenge.

This project is a real-time, infinite-scrolling social feed built with a modern React stack. My goal here was to keep things snappy, scalable, and UX-focused, treating this as if it were a production-grade feature in a larger app.

## 🚀 Getting Started

To get this running on your local machine, follow these steps. 

**Prerequisites:**
- Node.js (v18 or higher recommended)
- `pnpm` (I highly recommend using pnpm for better dependency resolution and speed, but `npm` works too).

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Running Tests
We take testing seriously. I've set up a fast integration suite using **Vitest** and **React Testing Library**.
```bash
pnpm vitest run
```

---

## 🛠 Tech Stack & Architecture

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4 (Using modern CSS variables and tokens)
- **State Management**: Redux Toolkit (specifically `createEntityAdapter`)
- **Notifications**: Sonner (for real-time toast alerts)
- **Testing**: Vitest + React Testing Library

---

## 🧠 Technical Decisions & Trade-offs

When building scalable frontends, there are always trade-offs. Here's a look into my decision-making process for the core features.

### 1. State Normalization with Redux Adapter
Instead of keeping posts in a simple array, I used RTK's `createEntityAdapter`. 
- **Why?** It normalizes the state into an `ids` array and an `entities` dictionary (hash map). This gives us O(1) lookups when accessing a specific post (like on the Post Detail page) and prevents massive re-renders across the feed when a single post updates.

### 2. The Feed & Infinite Scroll
I built a custom React hook that uses the native `IntersectionObserver` API to trigger pagination when the user hits the bottom of the feed.
- **Trade-off / Known Limitation**: Currently, if a user lands directly via a deep link on a post that is far down the feed (e.g., Post #50) and then navigates "back" to the feed, the feed doesn't do "bidirectional" infinite scrolling (loading items *above* the current viewport). We fetch page 1 by default, which means the scroll restoration won't be able to find Post #50 in the DOM instantly.

### 3. Real-Time Simulation & Sonner
To simulate a WebSocket or Server-Sent Events (SSE) connection pushing new content:
- A `setInterval` injects a "fake" post every 15 seconds.
- I integrated **Sonner** to pop up a toast notification. Clicking "View" on the toast triggers a smooth `window.scrollTo` to instantly take the user to the top to see the new content.
- **The "Prepend Hack"**: Redux EntityAdapter's `addOne` puts new items at the *end* of the `ids` array by default. To prepend the fake post to the top of the feed without losing the adapter's benefits, I intercept the state mutation and do a quick `state.ids.unshift(state.ids.pop()!)`. Simple, fast, and keeps the feed order intact.

### 4. Post Detail Page Routing
When a user clicks a post, they are routed to `/posts/[id]`.
- **Instant Load**: If the user comes from the feed, the post is already in the Redux `entities` dictionary. We load it instantly without a network request.
- **Fallback Fetch**: If the user accesses the URL directly (deep linking), Redux is empty. The component intelligently falls back to fetching the data directly from the dummy API.

### 5. Testing Philosophy
I wrote the tests to behave like a user. Instead of brittle unit tests that check implementation details, I used Vitest + RTL for integration tests that cover:
- Component mounting and data fetching.
- Real-time post injection (using Vitest's Fake Timers).
- Navigation edge cases (like handling 404s when a post doesn't exist).

---

Thanks for reviewing my code! If you have any questions about the architecture or the implementation details, I'd love to chat about them.
