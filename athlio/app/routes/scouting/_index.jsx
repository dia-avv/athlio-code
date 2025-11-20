// Scouting index: renders the comparison header and tabbed content
// using context provided by the parent layout.
import { useOutletContext } from "react-router";
import PlayerComparisonHeader from "../../components/domain/Scouting/PlayerComparisonHeader";
import Tables from "../../components/domain/Scouting/Tables";
import TableInfo from "../../components/domain/Scouting/TableInfo";
import ExperienceList from "../../components/domain/Scouting/ExperienceList";
import Availability from "../../components/domain/Scouting/Availability";

export default function ScoutingIndex() {
  // Consume players + UI handlers from ScoutingLayout's Outlet context
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
      {/* Header: tab controls, add/remove players, season filter */}
      <PlayerComparisonHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={handleRemovePlayer}
        players={players}
        onSeasonChange={handleSeasonChange}
      />
      {/* Tab: Stats tables for selected players */}
      {activeTab === "stats" && <Tables players={players} />}
      {/* Tab: General info table */}
      {activeTab === "info" && (
        <>
          <TableInfo players={players} />
        </>
      )}
      {/* Tab: Playing experience history */}
      {activeTab === "experience" && (
        <>
          <ExperienceList players={players} />
        </>
      )}
      {/* Tab: Injury/availability overview */}
      {activeTab === "availability" && <Availability players={players} />}
    </>
  );
}
