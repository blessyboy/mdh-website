"use client";
import { useEffect, useState, type ComponentProps } from "react";

// Demo forms must never fall back to a native GET containing personal data.
// A disabled fieldset also blocks implicit Enter-key submission before hydration.
export function PreviewForm({ children, onSubmit, ...props }: ComponentProps<"form">) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <form {...props} aria-busy={!ready} onSubmit={event => {
    event.preventDefault();
    if (ready) onSubmit?.(event);
  }}><fieldset className="preview-fields" disabled={!ready}>{children}</fieldset><noscript><p className="form-error">Enable JavaScript to use this form preview. Nothing has been sent.</p></noscript></form>;
}
