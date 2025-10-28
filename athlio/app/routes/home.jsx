import Button from "../components/UI/Button";

export default function Home() {
  return (
    <Button
      size="medium"
      type="subtle"
      label="Click Me"
      onClick={() => alert("Button Clicked!")}
    />
  );
}
