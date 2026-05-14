import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Next.js Navigation
vi.mock("next/navigation", () => {
  const actual = vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/",
    notFound: vi.fn(),
  };
});

// Mock next/link
vi.mock("next/link", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ children, href }: any) => {
      return React.createElement("a", { href: href.toString() }, children);
    },
  };
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as any;

// Mock window.scrollTo
window.scrollTo = vi.fn();
