"use client";
import { useRouter } from "next/navigation";
import GameModalComponent from "../../../../components/Game/Modal";
import PongAnimation from "../../../../public/img/PongAnimation.json";
import Lottie from "lottie-react";

export default function DeclineModal() {
  const router = useRouter();
  const cancelCallback = () => router.push("/profile");
  const btn1Callback = () => router.push("/profile");
  const content = (
    <div className="h-3/4 flex justify-center content-center bg-black rounded-xl my-6">
      <Lottie className="mb-5 rounded-lg" animationData={PongAnimation} />
    </div>
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
        btn2Callback={cancelCallback}
      ></GameModalComponent>
      ;
    </>
  );
}
