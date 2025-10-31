import BasicPost from "../components/domain/Post/BasicPost";
import Image from "../assets/images/Image.png";
import MatchPost from "../components/domain/Post/MatchPost";

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
      <MatchPost
        id={1}
        author="Kylian Mbappe"
        author_role="Midfielder for @RealMadrid"
        createdAt="21/10"
        content="Important 3 points tonight 🙏⚽. Every game is another chance to grow. Grateful for my family and my teammates for always guiding me through the journey. Let’s keep pushing"
        goalsCount={2}
        assistsCount={5}
        minCount={45}
        date="21 Jan"
        league="La Liga"
        yourTeam="Real Madrid"
        opponent="FC Barcelona"
        yourScore={3}
        opponentScore={1}
      />
    </>
  );
}
