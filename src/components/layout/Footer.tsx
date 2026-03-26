import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#060E1F" }}
    >
      {/* ── Atmospheric layers — mirrors landing page glows ── */}

      {/* Electric blue beam from right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 80% at 105% 50%, rgba(17,58,209,0.45) 0%, rgba(17,58,209,0.10) 45%, transparent 70%)",
        }}
      />

      {/* Blue highlight top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 60% at 95% 0%, rgba(92,157,242,0.20) 0%, transparent 60%)",
        }}
      />

      {/* Orange micro-accent bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 35% 50% at 0% 100%, rgba(242,139,48,0.09) 0%, transparent 65%)",
        }}
      />

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Thin top separator — very subtle so it doesn't cut */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between lg:px-12">
        {/* Logo + copyright */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Image
            src="/logos/entityx/entityx_Logo_RGB_Long_White_LowRes.png"
            alt="entity x"
            width={90}
            height={23}
            unoptimized
          />
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} entity x GmbH
          </p>
        </div>

        {/* Legal links */}
        <nav className="flex items-center gap-6">
          <a
            href="https://entityx.com/datenschutz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 transition-colors duration-150 hover:text-white/75"
          >
            Datenschutz
          </a>
          <a
            href="https://entityx.com/impressum/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 transition-colors duration-150 hover:text-white/75"
          >
            Impressum
          </a>
        </nav>
      </div>
    </footer>
  );
}
