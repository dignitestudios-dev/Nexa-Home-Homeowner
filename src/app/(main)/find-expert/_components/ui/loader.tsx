export function Loader() {
  return (
    <svg
      className="w-24 h-24"
      viewBox="0 0 240 240"
      aria-label="Loading"
    >
      <circle
        className="animate-ring-a stroke-[#005864]"
        cx="120"
        cy="120"
        r="105"
        fill="none"
        strokeWidth="20"
        strokeDasharray="0 660"
        strokeDashoffset="-330"
        strokeLinecap="round"
      />

      <circle
        className="animate-ring-b stroke-[#005864]"
        cx="120"
        cy="120"
        r="35"
        fill="none"
        strokeWidth="20"
        strokeDasharray="0 220"
        strokeDashoffset="-110"
        strokeLinecap="round"
      />

      <circle
        className="animate-ring-c stroke-[#005864]"
        cx="85"
        cy="120"
        r="70"
        fill="none"
        strokeWidth="20"
        strokeDasharray="0 440"
        strokeLinecap="round"
      />

      <circle
        className="animate-ring-d stroke-[#005864]"
        cx="155"
        cy="120"
        r="70"
        fill="none"
        strokeWidth="20"
        strokeDasharray="0 440"
        strokeLinecap="round"
      />
    </svg>
  );
}