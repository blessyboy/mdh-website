"use client";
import type { ComponentProps, KeyboardEvent } from "react";

function containTab(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const dialog = event.currentTarget;
  const controls = [...dialog.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])")].filter(element => element.getClientRects().length && !element.closest("[inert]"));
  const first = controls[0];
  const last = controls.at(-1);
  if (!first || !last) { event.preventDefault(); dialog.focus(); return; }
  const current = document.activeElement;
  if (event.shiftKey && (current === first || !dialog.contains(current))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (current === last || !dialog.contains(current))) { event.preventDefault(); first.focus(); }
}

/** Native dialog semantics with deterministic keyboard wrap and caller-owned ref. */
export function Modal({ onKeyDown, ...props }: ComponentProps<"dialog">) {
  return <dialog {...props} onKeyDown={event => { containTab(event); onKeyDown?.(event); }} />;
}
