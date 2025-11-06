import { useState } from "react";
import PlayerComparisonHeader from "../components/domain/Scouting/PlayerComparisonHeader";
import InfoCards from "../components/UI/InfoCards";
import Tables from "../components/domain/Scouting/Tables";
import Position from "../components/domain/Scouting/Position";
import SearchBarCard from "../components/domain/Scouting/SearchBarCard";

export default function Intro() {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <>

      <PlayerComparisonHeader activeTab={activeTab} onTabChange={setActiveTab} />   
        {activeTab === 'stats' && <Tables/>}
      {activeTab === 'info' && <InfoCards /> && <Position label="Preferred Position" value="Midfielder" />  }
        <SearchBarCard/>
    </>
  );
}
