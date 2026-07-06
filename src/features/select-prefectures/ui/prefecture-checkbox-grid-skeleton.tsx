import { PREFECTURE_COUNT } from "@/entities/prefecture";
import { Skeleton } from "@/shared/ui";

import { PrefectureFieldset } from "./prefecture-fieldset";

// Placeholder shown while the prefecture list loads. It fills the shared
// fieldset with one row per prefecture, so swapping in the real checkboxes
// causes no layout shift.
export const PrefectureCheckboxGridSkeleton = () => (
  <>
    {/* Sighted users see the pulsing grid; screen readers get this instead */}
    <p role="status" aria-live="polite" className="sr-only">
      都道府県を読み込み中…
    </p>
    <PrefectureFieldset decorative>
      {Array.from({ length: PREFECTURE_COUNT }, (_, index) => (
        // Reuses choice-label so each row is padded exactly like a real one
        <div key={index} data-slot="skeleton-row" className="choice-label">
          <Skeleton className="size-4 shrink-0" />
          {/* h-6 matches the 24px text line, so the row is exactly as tall
              as a real one — this is what keeps the layout from shifting */}
          <div className="flex h-6 flex-1 items-center">
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </PrefectureFieldset>
  </>
);
