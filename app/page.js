"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "../lib/supabase";

export default function Wall() {
  const [notes, setNotes] = useState([]);
  const [hour, setHour] = useState(null);

  useEffect(() => {
    const sb = getBrowserClient();
    (async () => {
      const { data: n } = await sb
        .from("notes")
        .select("id,title,body,created_at,user_id,is_public")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(48);
      setNotes(n || []);
      const { data: h } = await sb
        .from("hourly_log")
        .select("title,body,created_at")
        .order("created_at", { ascending: false })
        .limit(1);
      setHour(h && h[0] ? h[0] : null);
    })();
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Things people meant to keep, then didn’t.</h1>
        <p className="lede">
          A small public wall. Write at your desk. Mark a note public and it
          lands here for anyone passing through. Every hour a new dispatch is
          pinned at the top.
        </p>
      </section>

      <aside className="hour-ribbon">
        <div className="tag">this hour</div>
        <div>
          <h2>{hour ? hour.title : "The board is still warming up."}</h2>
          <p>
            {hour
              ? hour.body
              : "When the next hour turns, a short dispatch will appear here."}
          </p>
        </div>
      </aside>

      {notes.length === 0 ? (
        <p className="empty">No public notes yet. Sign in, write one, tick public.</p>
      ) : (
        <div className="wall">
          {notes.map((note, i) => (
            <article
              key={note.id}
              className="card"
              style={{
                "--tilt": `${((i % 5) - 2) * 0.7}deg`,
                "--d": `${(i % 8) * 0.05}s`,
              }}
            >
              <h3>{note.title || "Untitled"}</h3>
              <p>{note.body}</p>
              <div className="meta">
                {new Date(note.created_at).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
