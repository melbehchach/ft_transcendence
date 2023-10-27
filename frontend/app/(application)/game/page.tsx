'use client';
import { useEffect } from "react";
import LeaderBoard from "../../../components/Game/leaderBoard";
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  reconnection: false,
  autoConnect: true,
});


const GamePage: React.FC = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected: ", socket.id);
    });
    socket.connect();
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