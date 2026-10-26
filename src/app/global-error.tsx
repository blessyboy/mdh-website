"use client";
export default function GlobalError({ reset }: { reset: () => void }) {
  return <html lang="en"><body style={{ margin: 0, background: "#f7f5ef", color: "#111111", fontFamily: "Arial, sans-serif" }}><main id="main-content" style={{ maxWidth: 640, margin: "15vh auto", padding: 28, lineHeight: 1.7 }}><p>Meridian Drive Hotel</p><h1>Let’s try that again.</h1><p>The website couldn’t finish loading. Please try again or return in a moment.</p><button onClick={reset} style={{ background: "#2f5a2f", color: "white", border: 0, padding: "14px 24px", fontSize: 16, cursor: "pointer", borderRadius: 4 }}>Try again</button></main></body></html>;
}
