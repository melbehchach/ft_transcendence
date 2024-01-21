"use client";
import { useState } from "react";
import RandomMatch from "../../../../components/Game/RandomGame";
import ScoreBoard from "../../../../components/Game/scoreBoard";
import InviteModal from "../../../../components/Game/InviteModal";

const InviteFriendPage = () => {
  const [Playerscore, setPlayerScore] = useState(0);
  const [OpponentScore, setOpponentScore] = useState(0);
  const [loading, setLoading] = useState(true);
  return (
    <>
      <div className="pl-[10%] bg-background h-screen w-screen justify-center ">
        <InviteModal loading={loading} setLoading={setLoading} />
        <ScoreBoard playerScore={Playerscore} opponentScore={OpponentScore} />
        <RandomMatch
          setPlayerScore={setPlayerScore}
          setOpponentScore={setOpponentScore}
          setLoading={setLoading}
        />
      </div>
    </>
  );
};

export default InviteFriendPage;
