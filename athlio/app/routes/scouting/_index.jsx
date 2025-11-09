import { useOutletContext } from "react-router";
import PlayerComparisonHeader from "../../components/domain/Scouting/PlayerComparisonHeader";
import Tables from "../../components/domain/Scouting/Tables";
import InfoCards from "../../components/UI/InfoCards";
import Position from "../../components/domain/Scouting/Position";
import TableInfo from "../../components/domain/Scouting/TableInfo";
import ExperienceList from "../../components/domain/Scouting/ExperienceList";
import Availability from "../../components/domain/Scouting/Availability";

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
      {activeTab === "info" && (
        <>
          <TableInfo players={players} />
          <InfoCards />
          <Position
            label="Preferred Position"
            value={players[0]?.info?.position || "Midfielder"}
          />
        </>
      )}
      {activeTab === "experience" && (
        <>
          <ExperienceList players={players} />
        </>
      )}
      {activeTab === "availability" && <Availability players={players} />}
    </>
  );
}
