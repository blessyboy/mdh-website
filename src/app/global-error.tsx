"use client";
export default function GlobalError({ reset }: { reset: () => void }) {
  return <html lang="en"><body style={{ margin: 0, background: "#f7f5ef", color: "#111111", fontFamily: "Arial, sans-serif", fontSize: 18 }}><main id="main-content" style={{ maxWidth: 720, margin: "48px auto", padding: 24, lineHeight: 1.6 }}><p>Meridian Drive Hotel</p><h1 style={{ fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.15 }}>Let’s try that again.</h1><p>The website couldn’t finish loading. Please try again or return in a moment.</p><button onClick={reset} style={{ background: "#2f5a2f", color: "white", border: 0, padding: "14px 24px", fontSize: 18, minHeight: 52, cursor: "pointer", borderRadius: 4 }}>Try again</button></main></body></html>;
}
