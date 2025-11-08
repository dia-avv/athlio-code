import { useOutletContext } from "react-router";
import PlayerComparisonHeader from "../../components/domain/Scouting/PlayerComparisonHeader";
import Tables from "../../components/domain/Scouting/Tables";
import InfoCards from "../../components/UI/InfoCards";
import Position from "../../components/domain/Scouting/Position";
import SearchBarCard from "../../components/domain/Scouting/SearchBarCard";

export default function ScoutingIndex() {
  const {
    players,
    activeTab,
    setActiveTab,
    handleAddPlayer,
    handleRemovePlayer,
    handleSeasonChange,
  } = useOutletContext();

  return (
    <>
      <PlayerComparisonHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={handleRemovePlayer}
        players={players}
        onSeasonChange={handleSeasonChange}
      />
      {activeTab === "stats" && <Tables players={players} />}
      {activeTab === "info" && <InfoCards /> && (
        <Position label="Preferred Position" value="Midfielder" />
      )}
    
    </>
  );
}
