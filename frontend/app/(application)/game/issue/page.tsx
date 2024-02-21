"use client";
import { useRouter } from "next/navigation";
import GameModalComponent from "../../../../components/Game/Modal";
import PongAnimation from "../../../../public/img/PongAnimation.json";
import Lottie from "lottie-react";

export default function GamePage() {
  const router = useRouter();
  const cancelCallback = () => router.push("/game");
  const btn1Callback = () => router.push("/game");
  const content = (
    <Lottie className="mb-5 rounded-lg" animationData={PongAnimation} />
  );

  return (
    <>
      <GameModalComponent
        title="Heads UP!"
        subtitle="Something is not working right. We're working on it..."
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
}
