"use client";
import { Button } from "@/components/ui";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main id="main-content" tabIndex={-1} className="page-state"><p className="eyebrow">Something interrupted your visit</p><h1>Let’s try that again.</h1><p>The page couldn’t finish loading. Please try again.</p><Button onClick={reset}>Try again</Button></main>; }

