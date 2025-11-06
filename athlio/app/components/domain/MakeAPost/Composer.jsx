import { useEffect, useRef, useState, useMemo } from "react";

export default function Composer({ onSubmit, autoFocus = true }) {
  const [text, setText] = useState("");
  const [audience, setAudience] = useState("followers");
  const taRef = useRef(null);

  // autogrow
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = ta.scrollHeight + "px";
  }, [text]);

  const canPost = useMemo(() => text.trim().length > 0, [text]);

  // Let your existing topbar trigger submit via a custom event
  useEffect(() => {
    const handler = () => {
      if (!canPost) return;
      onSubmit?.({ text: text.trim(), audience });
    };
    document.addEventListener("composer:submit", handler);
    return () => document.removeEventListener("composer:submit", handler);
  }, [canPost, text, audience, onSubmit]);

  return (
    <div className="composer-wrap">
      <textarea
        ref={taRef}
        className="composer-textarea"
        placeholder="What is this post about?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={1}
        autoFocus={autoFocus}
      />

      <div className="composer-pillbar">
        <button className="composer-fab" type="button">
          +
        </button>
        <button className="composer-chip" type="button">
          Match
        </button>
        <button className="composer-chip" type="button">
          Picture
        </button>
        <button className="composer-chip" type="button">
          Event
        </button>
      </div>
    </div>
  );
}
