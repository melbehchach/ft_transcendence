'use client';
import { useEffect } from "react";
import LeaderBoard from "../../../components/Game/leaderBoard";
import socket from "./client";

const GamePage: React.FC = () => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("connected: ", socket.id);
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <>
      <LeaderBoard />
    </>
  )
}

export default GamePage;