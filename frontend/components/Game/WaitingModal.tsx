"use client";
import PongAnimation from "../../public/img/PongAnimation.json";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";

const WaitaingModal = ({ loading }: any) => {
  const router = useRouter();
  if (!loading) return;
  return (
    <>
      <div className="h-screen fixed inset-0 backdrop-blur-sm bg-black/60 flex justify-center items-center z-30">
        <div className="max-h-1/2 w-1/2 rounded-lg bg-background z-60 ">
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
            <div className="w-full flex justify-center items-center">
              <div className="w-11/12">
                <Lottie className="mb-5 rounded-lg" animationData={PongAnimation} />
              </div>
            </div>
            <button
              onClick={() => router.push("/game")}
              className="mb-12 w-64 justify-center text-white py-4 items-center rounded-3xl border-white border"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WaitaingModal;
