export default function BackgroundEffects() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    >
      {/* Top-center glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 15%, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />
      {/* Bottom-right secondary glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 85% 85%, rgba(37,99,235,0.04) 0%, transparent 70%)",
        }}
      />
      {/* Left-center tertiary glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 50% at 10% 50%, rgba(37,99,235,0.03) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
