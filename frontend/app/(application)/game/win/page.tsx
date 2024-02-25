"use client";
import { useRouter } from "next/navigation";
import GameModalComponent from "../../../../components/Game/Modal";
import Lottie from "lottie-react";
import WinnerAnimation from "../../../../public/svg/winner.json";

export default function WinnerGame() {
  const router = useRouter();
  const cancelCallback = () => router.push("/game");
  const content = (
    <div className="h-3/4 flex justify-center content-center bg-black rounded-xl my-6 bg-background">
      <Lottie className="mb-5 rounded-lg" animationData={WinnerAnimation} />
    </div>
  );
  return (
    <>
      <GameModalComponent
        title="Congratulations!"
        subtitle="You won the game! 🎉"
        content={content}
        cancelCallback={cancelCallback}
        btn1="Exit"
        btn2={null}
        btn2Callback={cancelCallback}
      ></GameModalComponent>
      ;
    </>
  );
}
