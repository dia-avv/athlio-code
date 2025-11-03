import { useState } from "react";
import PlayerComparisonHeader from "../components/domain/Scouting/PlayerComparisonHeader";
import InfoCards from "../components/UI/InfoCards";

export default function Intro() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <>
      <PlayerComparisonHeader activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'info' && <InfoCards />}
    </>
  );
}
