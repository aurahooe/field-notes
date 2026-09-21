"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "../../lib/supabase";

export default function Desk() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const sb = getBrowserClient();
    sb.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }
      setUser(data.user);
      load(sb, data.user.id);
    });
  }, []);

  async function load(sb, uid) {
    const { data } = await sb
      .from("notes")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setNotes(data || []);
  }

  async function save(e) {
    e.preventDefault();
    setErr("");
    const sb = getBrowserClient();
    const { error } = await sb.from("notes").insert({
      user_id: user.id,
      title: title.trim() || "Untitled",
      body: body.trim(),
      is_public: isPublic,
    });
    if (error) {
      setErr(error.message);
      return;
    }
    setTitle("");
    setBody("");
    setIsPublic(false);
    load(sb, user.id);
  }

  async function toggle(note) {
    const sb = getBrowserClient();
    await sb.from("notes").update({ is_public: !note.is_public }).eq("id", note.id);
    load(sb, user.id);
  }

  async function remove(note) {
    const sb = getBrowserClient();
    await sb.from("notes").delete().eq("id", note.id);
    load(sb, user.id);
  }

  async function out() {
    const sb = getBrowserClient();
    await sb.auth.signOut();
    window.location.href = "/";
  }

  if (!user) return <p className="empty">Opening the desk…</p>;

  return (
    <div className="wrap">
      <div className="panel">
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, marginTop: 0 }}>Your desk</h1>
        <p style={{ color: "var(--ink-soft)", marginTop: 0 }}>
          Private until you mark it public. Public notes appear on the wall.
        </p>
        <form onSubmit={save}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <label>The note</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
          <label className="check">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Show this on the public wall
          </label>
          <button type="submit">Save</button>
          <button type="button" className="ghost" onClick={out}>Sign out</button>
          {err && <div className="err">{err}</div>}
        </form>
      </div>
      <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
        {notes.map((note) => (
          <article key={note.id} className="card" style={{ transform: "none" }}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            <div className="meta">
              {note.is_public ? "public" : "private"} · {new Date(note.created_at).toLocaleString()}
            </div>
            <button className="ghost" onClick={() => toggle(note)}>
              {note.is_public ? "Make private" : "Make public"}
            </button>
            <button className="ghost" onClick={() => remove(note)}>Delete</button>
          </article>
        ))}
      </div>
    </div>
  );
}
