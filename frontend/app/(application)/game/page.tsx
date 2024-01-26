"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GamePage() {
  const router = useRouter();
  return (
    <>
      <div className="bg-background w-full h-vh flex px-5 py-10 justify-center ">
        <div className="flex justify-center gap-5 xl:gap-10 ">
          <div className="m-auto">
            <h1 className="text-text font-bold text-3xl md:text-5xl lg:text-7xl xl:text-8xl min-[2560px]:text-[10rem] text-center">
              READY TO PONG?
            </h1>
            <div className="py-5 text-small xl:text-body min-[2560px]:text-title leading-tight text-center text-textSecondary">
              {
                "You can challenge your friends or find random opponents online. Let's GO !"
              }
            </div>
            <div className="w-full gap-2 flex flex-col md:flex-row md:gap-6 justify-center">
              <div className="w-full gap-2 md:gap-4 flex flex-col">
                <div className="text-text text-body text-center min-[2560px]:text-title">
                  Find a random opponent
                </div>
                <div className="text-small leading-tight text-center md:hidden text-textSecondary">
                  {"Let us find you a random opponent"}
                </div>
                <div>
                  <Image
                    className="rounded-lg"
                    src="/img/random.png"
                    layout="responsive"
                    width={100}
                    height={100}
                    alt="Challenge Friends"
                  />
                </div>
                <div className="text-small leading-tight text-center hidden md:block xl:text-body min-[2560px]:text-title text-textSecondary">
                  {"Let us find you a random opponent"}
                </div>
                <button
                  className="block bg-primary text-text text-body px-6 py-3 rounded-lg xl:rounded-full w-auto mb-10"
                  onClick={() => router.push("/game/random")}
                >
                  Find Opponent
                </button>
              </div>
              <div className="w-full gap-2 md:gap-4 flex flex-col">
                <div className="text-text text-body text-center min-[2560px]:text-title">
                  Challenge a friend
                </div>
                <div className="text-small leading-tight text-center md:hidden text-textSecondary">
                  {"challenge your friends for a 1v1"}
                </div>
                <div>
                  <Image
                    className="rounded-lg"
                    layout="responsive"
                    width={100}
                    height={100}
                    src="/img/friend.png"
                    alt="Challenge Friends"
                  />
                </div>
                <div className="text-small leading-tight text-center hidden md:block xl:text-body min-[2560px]:text-title text-textSecondary">
                  {"challenge your friends for a 1v1"}
                </div>
                <button
                  className="block bg-primary text-text text-body px-6 py-3 rounded-lg xl:rounded-full w-auto"
                  onClick={() => router.push("/game/friend")}
                >
                  Challenge a Friend
                </button>
              </div>
            </div>
          </div>
          <div className="hidden xl:flex m-auto w-full justify-center">
            <Image
              className="rounded-lg"
              layout="responsive"
              width={100}
              height={100}
              src="/img/GameIntro.png"
              alt="Game Intro Image"
            />
          </div>
        </div>
      </div>
    </>
  );
}
