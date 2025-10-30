import BasicPost from "../components/domain/Post/BasicPost";
import Image from "../assets/images/Image.png";

export default function Home() {
  return (
    <>
      <BasicPost
        id={1}
        author="Kylian Mbappe"
        author_role="Midfielder for @RealMadrid"
        createdAt="21/10"
        content="Important 3 points tonight 🙏⚽. Every game is another chance to grow. Grateful for my family and my teammates for always guiding me through the journey. Let’s keep pushing"
        imageUrl={Image}
      />
    </>
  );
}
