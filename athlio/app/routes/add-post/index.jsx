import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AddPostIndex() {
  const nav = useNavigate();
  useEffect(() => {
    nav("./post", { replace: true });
  }, [nav]);
  return null;
}
