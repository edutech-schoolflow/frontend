export default function Logo({
  textColor = "#1b1b1b",
  size = 36,
}: {
  textColor?: string;
  size?: number;
}) {
  const fontSize = size * 0.36;
  const r = size * 0.22;

  return (
    <span className="flex items-center gap-[10px]">
      {/* Badge */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={size} height={size} rx={r} fill="#1ca95c" />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize={fontSize}
          letterSpacing="-0.5"
        >
          1SP
        </text>
      </svg>

      {/* Wordmark */}
      <span
        style={{ color: textColor, fontSize: size * 0.44, lineHeight: 1 }}
        className="font-semibold tracking-tight"
      >
        One
        <span style={{ color: "#1ca95c" }}>school</span>
        <span style={{ fontWeight: 400 }}>platform</span>
      </span>
    </span>
  );
}
