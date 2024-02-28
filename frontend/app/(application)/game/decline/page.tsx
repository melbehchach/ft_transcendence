"use client";
import { useRouter } from "next/navigation";
import GameModalComponent from "../../../../components/Game/Modal";

export default function DeclineGame() {
  const router = useRouter();
  const cancelCallback = () => router.push("/profile");
  const btn1Callback = () => router.push("/profile");
  const btn2Callback = () => router.push("/profile");
  const modalContent = (
    <div className="bg-[url('/img/failure.png')] bg-no-repeat bg-center bg-cover flex-col items-center text-center border-solid border-2 rounded-xl border-textSecondary m-5 h-5/6" />
  );
  return (
    <>
      <GameModalComponent
        title="Oops"
        subtitle="Looks like your friend chickened out 🐔"
        content={modalContent}
        cancelCallback={cancelCallback}
        btn1="Play Again"
        btn1Callback={btn1Callback}
        btn2="Exit"
        btn2Callback={btn2Callback}
      ></GameModalComponent>
      ;
    </>
  );
}
