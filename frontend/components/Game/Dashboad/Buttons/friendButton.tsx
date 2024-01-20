"use client";
import { useRouter } from "next/navigation";

export default function FriendButton() {
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => router.push("/game/friend")}
        className="w-max p-[0.70rem] px-[3rem] rounded-full bg-primary justify-center cursor-pointer"
      >
        <h1 className="text-text not-italic text-sm font-normal text-center ">
          Challenge your friends
        </h1>
      </button>
    </>
  );
}
