"use client";

import { useState } from "react";
import { getBrowserClient } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handle(mode) {
    setErr("");
    setMsg("");
    const sb = getBrowserClient();
    if (mode === "up") {
      const { error } = await sb.auth.signUp({ email, password });
      if (error) setErr(error.message);
      else setMsg("Account created. If email confirm is on, check your inbox — then sign in.");
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
      else window.location.href = "/desk";
    }
  }

  return (
    <div className="wrap">
      <div className="panel">
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, marginTop: 0 }}>
          Come in.
        </h1>
        <p style={{ color: "var(--ink-soft)" }}>
          Email and a password. That is the whole system.
        </p>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        <button onClick={() => handle("in")}>Sign in</button>
        <button className="ghost" onClick={() => handle("up")}>
          Create account
        </button>
        {err && <div className="err">{err}</div>}
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}
