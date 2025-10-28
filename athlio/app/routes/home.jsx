import StarIcon from "../assets/icons/star.svg?react";
import IconButton from "../components/UI/IconButton";

export default function Home() {
  return (
    <IconButton
      size="small"
      type="primary"
      icon={StarIcon}
      onClick={() => alert("Button Clicked!")}
    />
  );
}
