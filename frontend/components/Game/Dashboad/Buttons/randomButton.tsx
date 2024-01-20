"use client";
import { useRouter } from "next/navigation";

export default function RandomButton() {
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => router.push("/game/random")}
        className="w-max p-[0.70rem] px-[5rem] rounded-full bg-primary justify-center cursor-pointer"
      >
        <h1 className="text-text not-italic text-sm font-normal text-center ">
          Find opponent
        </h1>
      </button>
    </>
  );
}
