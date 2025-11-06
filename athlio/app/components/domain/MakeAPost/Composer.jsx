import { useEffect, useRef, useState, useMemo } from "react";
import GrowingTextArea from "../../inputs/GrowingTextArea";
import PostPillBar from "./PostPillBar";
import "./Composer.css";

export default function Composer({ onSubmit }) {
  const [text, setText] = useState("");
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
      onSubmit?.({ text: text.trim() });
    };
    document.addEventListener("composer:submit", handler);
    return () => document.removeEventListener("composer:submit", handler);
  }, [canPost, text, onSubmit]);

  return (
    <div className="composer-wrap">
      <GrowingTextArea
        value={text}
        onChange={setText}
        placeholder="What is this post about?"
      />
      <PostPillBar />
    </div>
  );
}
