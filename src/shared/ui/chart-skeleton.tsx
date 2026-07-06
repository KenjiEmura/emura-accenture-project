type Props = Readonly<{
  height: number;
}>;

// Decorative gray line chart drawn where the real chart will appear.
// Purely visual — hidden from assistive technology.
export const ChartSkeleton = ({ height }: Props) => (
  <svg
    aria-hidden="true"
    className="w-full text-gray-200"
    style={{ height }}
    viewBox="0 0 800 400"
    preserveAspectRatio="none"
  >
    {/* Y and X axes */}
    <line
      x1="60"
      y1="20"
      x2="60"
      y2="360"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="60"
      y1="360"
      x2="780"
      y2="360"
      stroke="currentColor"
      strokeWidth="2"
    />

    {/* Horizontal gridlines */}
    {[90, 160, 230, 300].map((gridlineY) => (
      <line
        key={gridlineY}
        x1="60"
        y1={gridlineY}
        x2="780"
        y2={gridlineY}
        stroke="currentColor"
        strokeWidth="1"
      />
    ))}

    {/* Two ghost trend lines */}
    <path
      d="M 80 330 C 220 300, 320 230, 440 200 S 680 130, 760 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      d="M 80 280 C 200 270, 340 290, 460 260 S 660 220, 760 190"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeDasharray="10 8"
    />
  </svg>
);
