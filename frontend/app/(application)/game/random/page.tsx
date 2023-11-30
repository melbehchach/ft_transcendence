'use client';
import { useState } from "react";
import RandomMatch from "../../../../components/Game/RandomGame";
import ScoreBoard from "../../../../components/Game/scoreBoard";



const RandomMatchPage = () => {
  const [Playerscore, setPlayerScore] = useState(0);
  const [OpponentScore, setOpponentScore] = useState(0);
  return (
    <>
      <div className="pl-[10%] bg-background h-screen w-screen justify-center ">
        <ScoreBoard playerScore={Playerscore} opponentScore={OpponentScore}/>
        <RandomMatch setPlayerScore={setPlayerScore} setOpponentScore={setOpponentScore}/>
      </div>
    </>
  );
};

export default RandomMatchPage;
