"use client";
import { useEffect, useState, type ComponentProps } from "react";

// Prevent native GET submission before the client handler is mounted.
// A disabled fieldset also blocks implicit Enter-key submission before hydration.
export function PreviewForm({ children, onSubmit, busy = false, noScriptMessage = "Enable JavaScript to use this form preview. Nothing has been sent.", ...props }: ComponentProps<"form"> & { busy?: boolean; noScriptMessage?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <form {...props} aria-busy={!ready || busy} onSubmit={event => {
    event.preventDefault();
    if (ready && !busy) onSubmit?.(event);
  }}><fieldset className="preview-fields" disabled={!ready || busy}>{children}</fieldset><noscript><p className="form-error">{noScriptMessage}</p></noscript></form>;
}
