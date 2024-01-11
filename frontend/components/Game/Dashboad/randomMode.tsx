"use client";
import FriendImage from "@/../../components/Game/Dashboad/Images/friendImage";
import RandomButton from "./Buttons/randomButton";


export default function RandomMode() {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-10">
        <div className="gap-2 flex flex-col justify-center items-center">
          <FriendImage />
          <h1 className="text-text not-italic font-bold text-[30px] ml-10 text-left max-w-[291px]">
            Find a random opponent
          </h1>
          <h2 className="text-gray-600 not-italic font-normal max-w-[258px]">
            Let us find you a random opponent online
          </h2>
        </div>
        <RandomButton />
      </div>
    </>
  );
}
