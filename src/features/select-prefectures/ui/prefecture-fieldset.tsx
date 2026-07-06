import type { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
  // When decorative, the whole frame is hidden from assistive tech — the
  // loading skeleton uses this and announces its status separately.
  decorative?: boolean;
}>;

// The labeled card frame shared by the real prefecture grid and its loading
// skeleton: same card, legend, and responsive column layout. Keeping the frame
// in one place is what lets the skeleton reserve the grid's exact size.
export const PrefectureFieldset = ({ children, decorative = false }: Props) => (
  <fieldset className="card" aria-hidden={decorative || undefined}>
    <legend className="px-2 font-bold">都道府県</legend>
    <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-4 md:grid-cols-6">
      {children}
    </div>
  </fieldset>
);
