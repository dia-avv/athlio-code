import { useRef, useState, useEffect } from "react";
import ProfilePicture from "../../UI/ProfilePicture";

export default function AvatarPicker({ value, onChange }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(value || "");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      if (typeof onChange === "function") onChange(dataUrl);
    };
    reader.readAsDataURL(f);
  }

  // Present the picture on the left and the upload control on the right.
  // This restores the prior layout where the photo and the "Select picture"
  // button sit side-by-side.
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div>
        <ProfilePicture imgUrl={preview || ""} size="large" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="button button--small button--outline"
            onClick={() => fileRef.current?.click()}
          >
            Select picture
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
