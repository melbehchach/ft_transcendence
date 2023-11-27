"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GameIntro() {
  const random = useRouter();

  return (
    <>
      <div className=" flex justify-center bg-background items-center">
        <div className="ml-auto mr-7 flex justify-center items-center gap-10">
          <div>
            <div className="flex flex-col">
              <h1 className="text-white font-sans text-7xl font-bold">
                READY TO PONG?
              </h1>
              <span className="text-textSecondary text-lg font-sans ml-0.5">
                You can challenge your friends or play against random opponents
                online. Let’s go!
              </span>
            </div>
            <div className="flex justify-between items-center mt-10">
              <div className="flex flex-col gap-4">
                <Image
                  className="rounded-lg"
                  src="/img/ChallengeFriends.png"
                  width={200}
                  height={200}
                  alt="Challenge friends"
                />
                <h1 className="w-[18.1875rem] text-white font-sans text-3xl font-bold">
                  Challenge friends online
                </h1>
                <span className="w-[16.125rem] text-textSecondary font-sans text-lg">
                  challenge your online friends for a 1v1 pong party
                </span>
                <button className="w-9/12 p-[0.75rem] rounded-full bg-primary text-white font-sans text-sm">
                  Challenge your friends
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <Image
                  className="rounded-lg"
                  src="/img/FindRandomOpponent.png"
                  width={200}
                  height={200}
                  alt="find random opponenet"
                />
                <h1 className="w-[18.1875rem] text-white font-sans text-3xl font-bold">
                  Find random opponents
                </h1>
                <span className="w-[16.125rem] text-textSecondary font-sans text-lg">
                  find random opponents to play against
                </span>
                <button
                  type="button"
                  onClick={() => random.push("/game/random")}
                  className="w-9/12 p-[0.75rem] rounded-full bg-primary text-white font-sans text-sm"
                >
                  Find opponent
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <Image
              src="/img/GameIntro.png"
              width={600}
              height={570}
              alt="intro game"
            />
          </div>
        </div>
      </div>
    </>
  );
}
