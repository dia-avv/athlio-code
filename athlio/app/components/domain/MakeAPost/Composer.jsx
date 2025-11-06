import { useEffect, useState, useMemo } from "react";
import GrowingTextArea from "../../inputs/GrowingTextArea";
import PostPillBar from "./PostPillBar";
import "./Composer.css";
import IconButton from "../../UI/IconButton";
import CloseIcon from "../../../assets/icons/close.svg?react";

export default function Composer({ onSubmit }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const canPost = useMemo(() => text.trim().length > 0, [text]);

  // Let your existing topbar trigger submit via a custom event
  useEffect(() => {
    const handler = () => {
      if (!canPost) return;
      onSubmit?.({ text: text.trim(), image });
    };
    document.addEventListener("composer:submit", handler);
    return () => document.removeEventListener("composer:submit", handler);
  }, [canPost, text, onSubmit, image]);

  function handleRemoveImage() {
    setImage(null);
    setPreview(null);
  }

  return (
    <div className="composer-wrap">
      <GrowingTextArea
        value={text}
        onChange={setText}
        placeholder="What is this post about?"
      />
      {preview && (
        <figure className="composer-preview">
          <img src={preview} alt="Selected" className="composer-preview-img" />
          <figcaption className="composer-preview-caption">
            <IconButton
              size="small"
              type="neutral"
              icon={CloseIcon}
              onClick={handleRemoveImage}
            />
          </figcaption>
        </figure>
      )}
      <PostPillBar onImageSelected={setImage} />
    </div>
  );
}
