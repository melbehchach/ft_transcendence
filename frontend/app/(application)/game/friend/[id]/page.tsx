"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import InviteMatch from "../../../../../components/Game/InviteMatch";
import ScoreBoard from "../../../../../components/Game/scoreBoard";
import GameRules from "../../rules/page";
import DeclineModal from "../../issue/page";

export default function Page() {
  const [Playerscore, setPlayerScore] = useState(0);
  const [OpponentScore, setOpponentScore] = useState(0);
  const [playerAvatar, setPlayerAvatar] = useState("");
  const [OpponentAvatar, setOpponnetAvatr] = useState("");
  const [loading, setLoading] = useState(true);
  const [rules, setrules] = useState(false);
  const [issue, setIssue] = useState(false);

  return (
    <>
      <div className="pl-[10%] bg-background h-screen w-screen justify-center ">
        {rules ? (
          <GameRules setLoading={setLoading} setrules={setrules} />
        ) : null}
        {issue ? <DeclineModal /> : null}
        <ScoreBoard
          playerScore={Playerscore}
          opponentScore={OpponentScore}
          playerAvatar={playerAvatar}
          OpponentAvatar={OpponentAvatar}
        />
        <InviteMatch
          setPlayerScore={setPlayerScore}
          setOpponentScore={setOpponentScore}
          setPlayerAvatar={setPlayerAvatar}
          setOpponnetAvatr={setOpponnetAvatr}
          setLoading={setLoading}
          setrules={setrules}
          setIssue={setIssue}
          issue={issue}
        />
      </div>
    </>
  );
}
