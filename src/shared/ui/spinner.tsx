// Spinning circle shown while data loads. Purely decorative — loading is
// announced to screen readers separately via an aria-live region.
export const Spinner = () => (
  <span
    aria-hidden="true"
    className="border-t-primary size-8 animate-spin rounded-full border-4 border-gray-300"
  />
);
