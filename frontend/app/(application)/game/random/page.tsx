"use client";
import { useState } from "react";
import RandomMatch from "../../../../components/Game/RandomGame";
import ScoreBoard from "../../../../components/Game/scoreBoard";
import WaitaingModal from "../../../../components/Game/WaitingModal";

const RandomMatchPage = () => {
  const [Playerscore, setPlayerScore] = useState(0);
  const [OpponentScore, setOpponentScore] = useState(0);
  const [playerAvatar, setPlayerAvatar] = useState("");
  const [OpponentAvatar, setOpponnetAvatr] = useState("");
  const [loading, setLoading] = useState(true);
  return (
    <>
      <div className="pl-[10%] bg-background h-screen w-screen justify-center ">
        <WaitaingModal loading={loading} />
        <ScoreBoard
          playerScore={Playerscore}
          opponentScore={OpponentScore}
          playerAvatar={playerAvatar}
          OpponentAvatar={OpponentAvatar}
        />
        <RandomMatch
          setPlayerScore={setPlayerScore}
          setOpponentScore={setOpponentScore}
          setLoading={setLoading}
          setPlayerAvatar={setPlayerAvatar}
          setOpponnetAvatr={setOpponnetAvatr}
        />
      </div>
    </>
  );
};

export default RandomMatchPage;
