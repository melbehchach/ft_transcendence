"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GameModalComponent from "../../../../components/Game/Modal";

export default function GameRules() {
  const router = useRouter();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [counter, router]);

  const pongIcon = (
    <svg
      width="42"
      height="46"
      viewBox="0 0 42 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35.625 27.5C38.775 27.5 41.25 29.975 41.25 33.125C41.25 36.275 38.775 38.75 35.625 38.75C32.475 38.75 30 36.275 30 33.125C30 29.975 32.475 27.5 35.625 27.5ZM9.75 29.75C9.75 29.75 12 32 12 34.25V42.125C12 43.925 13.575 45.5 15.375 45.5C17.175 45.5 18.75 43.925 18.75 42.125V34.25C18.75 32 21 29.75 21 29.75H9.75ZM12 27.5H18.75C18.75 27.5 30 27.5 30 16.25C30 5 21 0.5 15.375 0.5C9.75 0.5 0.75 5 0.75 16.25C0.75 27.5 12 27.5 12 27.5Z"
        fill="#4D5960"
      />
    </svg>
  );
  const cancelCallback = () => router.push("/game");
  const btn1Callback = () => router.push("/game/friend");
  const modalContent = (
    <div className="flex flex-col justify-center content-center gap-8 md:gap-4 border-2 rounded-xl border-textSecondary text-small xl:text-body text-text m-5 p-5 h-5/6">
      <div className="flex content-center gap-5 justify-center">
        <div className="hidden md:block">{pongIcon}</div>
        <div className="flex flex-col justify-center">
          {"If you leave before the game is over, you lose"}
        </div>
      </div>
      <div className="flex content-center gap-5 justify-center">
        <div className="hidden md:block">{pongIcon}</div>
        <div className="flex flex-col justify-center">
          {"First player to score FIVE wins the game"}
        </div>
      </div>
      <div className="flex content-center gap-5 justify-center">
        <div className="hidden md:block">{pongIcon}</div>
        <div className="flex flex-col justify-center">
          {"Have fun! it's mandatory"}
        </div>
      </div>
      <div className="text-text text-body md:text-title font-bold">
        Starting in
      </div>
      <div className="font-bold text-3xl lg:text-4xl"> {counter} </div>
    </div>
  );

  return (
    <>
      <GameModalComponent
        title="Matched!"
        subtitle="Here are the game rules:"
        content={modalContent}
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
