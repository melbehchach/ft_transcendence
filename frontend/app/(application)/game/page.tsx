"use client";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const router = useRouter();
  return (
    <>
      <div className="bg-background w-full h-screen flex px-5 py-10 justify-center ">
        <div className="flex justify-center content-center gap-5 w-full">
          <div className="w-11/12 flex flex-col md:place-content-evenly">
            <h1 className="text-text font-bold text-3xl md:text-5xl min-[2000px]:text-7xl text-center">
              READY TO PONG?
            </h1>
            <div className="py-5 text-small lg:text-body leading-tight text-center text-textSecondary">
              {
                "You can challenge your friends or find random opponents online. Let's GO !"
              }
            </div>
            <div className="w-full h-full gap-2 flex flex-col md:flex-row md:gap-6 justify-center">
              <div className="w-full h-full gap-2 md:gap-4 flex flex-col">
                <div className="text-text text-body min-[2000px]:text-title text-center">
                  Random opponent
                </div>
                <div className="text-small leading-tight text-center md:hidden text-textSecondary">
                  {"Find a random opponent"}
                </div>
                <div className="h-full w-full bg-[url('/img/random.png')] bg-no-repeat bg-center bg-cover rounded-lg"></div>
                <div className="text-small min-[2000px]:text-body leading-tight text-center hidden md:block text-textSecondary">
                  {"Find a random opponent"}
                </div>
                <button
                  className="block bg-primary text-text text-body px-6 py-3 rounded-lg min-[2000px]:rounded-full w-auto mb-10 md:mb-0"
                  onClick={() => router.push("/game/random")}
                >
                  Find Opponent
                </button>
              </div>
              <div className="w-full h-full gap-2 md:gap-4 flex flex-col">
                <div className="text-text text-body min-[2000px]:text-title text-center">
                  Challenge a friend
                </div>
                <div className="text-small leading-tight text-center md:hidden text-textSecondary">
                  {"challenge your friends for a 1v1"}
                </div>
                <div className="w-full h-full bg-[url('/img/friend.png')] bg-no-repeat bg-center bg-cover rounded-lg"></div>
                <div className="text-small min-[2000px]:text-body leading-tight text-center hidden md:block text-textSecondary">
                  {"challenge your friends for a 1v1"}
                </div>
                <button
                  className="block bg-primary text-text text-body px-6 py-3 rounded-lg min-[2000px]:rounded-full w-auto"
                  onClick={() => router.push("/game/friend")}
                >
                  Challenge a Friend
                </button>
              </div>
            </div>
          </div>
          <div className="hidden 2xl:block m-auto w-full h-full rounded-lg bg-[url('/img/GameIntro.png')] bg-no-repeat bg-center bg-cover" />
        </div>
      </div>
    </>
  );
}
