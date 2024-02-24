"use client";
import { useState } from "react";
import ScoreBoard from "../../../../components/Game/scoreBoard";
import InviteModal from "../../../../components/Game/InviteModal";
import InviteMatch from "../../../../components/Game/inviteMatch";
import GameRules from "../rules/page";
import DeclineModal from "../issue/page";

const InviteFriendPage = () => {
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
        <InviteModal loading={loading} setLoading={setLoading} />
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
          setrules={setrules}
          setLoading={setLoading}
          setIssue={setIssue}
          issue={issue}
        />
      </div>
    </>
  );
};

export default InviteFriendPage;
