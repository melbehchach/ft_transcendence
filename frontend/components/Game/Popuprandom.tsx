"use client";
import PongAnimation from "/Users/yamzil/Desktop/ft_transcendence/frontend/public/img/PongAnimation.json";
import {useRouter} from "next/navigation";
import Lottie from "lottie-react";

const PopupRandom = ({loading} : any) => {
  const router = useRouter();
  if (!loading) return ; 
  return (
    <>
      <div className="h-screen fixed inset-0 backdrop-blur-sm flex justify-center items-center z-30">
        <div className="h-1/2 w-1/2 bg-background z-60">
          <svg
            className="cursor-pointer float-right mr-4 mt-4"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L21 21M3 21L21 3"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex-col justify-center items-center text-center mt-10">
            <h1 className="text-text font-bold text-2xl not-italic font-sans mb-5 mt-2">
              Hold on
            </h1>
            <p className="text-text text-lg font-normal font-sans mb-5">
              we’re trying to find you an opponent...
            </p>
            <Lottie className='mb-5' animationData={PongAnimation} />
            <button onClick={() => router.push('/game')}   className="w-64 justify-center text-white py-4 items-center rounded-3xl border-white border">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupRandom;
