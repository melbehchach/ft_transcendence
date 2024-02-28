"use client";
import PongAnimation from "../../public/img/PongAnimation.json";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import GameModalComponent from "./Modal";
import io from 'socket.io-client';

import {useState} from 'react'

const socket = io('http://localhost:3000/game')
const WaitaingModal = ({loading} : any) => {
  const router = useRouter();
  // const [socket, setSocket] = useState<Socket>();

  if (! loading) return
  const cancelCallback = () => router.push("/game");
  const btn1Callback = () => {
    socket.emit('leaveBeforeStart')
    console.log('one player leave the room before start the game : [[[[22222]]]]]');
    
    router.push("/game");
  }
  const content = (
    <div className="h-3/4 flex justify-center content-center bg-black rounded-xl my-6">
      <Lottie className="mb-5 rounded-lg" animationData={PongAnimation} />
    </div>
  );
  return (
    <>
      <GameModalComponent
        title="Hold on"
        subtitle="we’re trying to find you an opponent..."
        content={content}
        cancelCallback={cancelCallback}
        btn1="Exit"
        btn1Callback={btn1Callback}
        btn2={null}
        btn2Callback={null}
      ></GameModalComponent>
      ;
    </>
  );
};

export default WaitaingModal;
