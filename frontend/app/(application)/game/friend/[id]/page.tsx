"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import cookie from "js-cookie";
import InviteMatch from "../../../../../components/Game/inviteMatch";
import ScoreBoard from "../../../../../components/Game/scoreBoard";

export default function Page() {
  const { id } = useParams();
  const [loadingGame, setLoadingGame] = useState(true);
    const [Playerscore, setPlayerScore] = useState(0);
    const [OpponentScore, setOpponentScore] = useState(0);
    const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const checkUser = async () => {
  //     try {
  //       const res = await axios.post("http://localhost:3000/game/play", {
  //         token: cookie.get("USER_ID"),
  //         gameId: id,
  //       });
  //       res && setLoadingGame(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
     
  //   };
  //   checkUser();
  // }, []);
  return (
    <>
      <div className="pl-[10%] bg-background h-screen w-screen justify-center ">
        <ScoreBoard playerScore={Playerscore} opponentScore={OpponentScore} />
        <InviteMatch
          setPlayerScore={setPlayerScore}
          setOpponentScore={setOpponentScore}
          setLoading={setLoading}
        />
      </div>
    </>
  );
}
