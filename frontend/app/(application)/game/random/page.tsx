"use client";
import { useState } from "react";
import RandomMatch from "../../../../components/Game/RandomGame";
import ScoreBoard from "../../../../components/Game/scoreBoard";
import WaitaingModal from "../../../../components/Game/WaitingModal";
import GameRules from "../rules/page";
import DeclineModal from "../issue/page";

const RandomMatchPage = () => {
  const [Playerscore, setPlayerScore] = useState(0);
  const [OpponentScore, setOpponentScore] = useState(0);
  const [playerAvatar, setPlayerAvatar] = useState("");
  const [OpponentAvatar, setOpponnetAvatr] = useState("");
  const [loading, setLoading] = useState(true);
  const [rules, setrules] = useState(false);
  const [issue , setIssue] = useState(false);
  return (
    <>
      <div className="pl-[10%] bg-background h-screen w-screen justify-center ">
        <WaitaingModal loading={loading} />
        {issue ? <DeclineModal /> : null}
        {rules ? (
          <GameRules setLoading={setLoading} setrules={setrules} loading={loading} />
        ) : null}
        <ScoreBoard
          playerScore={Playerscore}
          opponentScore={OpponentScore}
          playerAvatar={playerAvatar}
          OpponentAvatar={OpponentAvatar}
        />
        <RandomMatch
          setPlayerScore={setPlayerScore}
          setOpponentScore={setOpponentScore}
          setPlayerAvatar={setPlayerAvatar}
          setOpponnetAvatr={setOpponnetAvatr}
          setrules={setrules}
          setLoading={setLoading}
          setIssue={setIssue}
          issue={issue}
          loading={loading}
        />
      </div>
    </>
  );
};

export default RandomMatchPage;
