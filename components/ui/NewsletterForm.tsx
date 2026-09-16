"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    window.localStorage.setItem("boxy-drip-newsletter", email.trim().toLowerCase());
    setSent(true);
  };

  return sent ? (
    <p className="newsletter-success" role="status">Te uniste al drop ✓</p>
  ) : (
    <form className="newsletter-form" onSubmit={subscribe}>
      <label className="sr-only" htmlFor="newsletter-email">Tu correo electrónico</label>
      <input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Tu correo electrónico" />
      <button type="submit" aria-label="Unirme al newsletter"><ArrowRight /></button>
    </form>
  );
}
