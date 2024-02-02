"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-[#36132d] w-full h-screen bg-[url('../public/img/landing.gif')] bg-no-repeat bg-center bg-cover">
      <div className=" w-full h-screen bg-black/50 flex flex-col items-center justify-center">
        <h1 className="text-5xl pb-3 text-white font-bold text-center">
          PONGCLUB
        </h1>
        <h5 className="text-md pb-8 text-textSecondary text-center px-2">
          {"🎮 IT'S LEVELS, IT'S LAYERS, SO PRAY FOR THE PLAYERS 🎮"}
        </h5>
        <Link href={"/auth/login"}>
          <button className="block bg-accent text-text px-6 py-3 rounded-lg font-bold">
            {"LET'S GO 🚀"}
          </button>
        </Link>
      </div>
    </div>
  );
}
