"use client";
import FriendImage from "@/../../components/Game/Dashboad/Images/friendImage";
import FriendButton from "@/../../components/Game/Dashboad/Buttons/friendButton";

export default function FriendMode() {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-10">
        <div className="gap-2 flex flex-col justify-center items-center">
          <FriendImage/>
          <h1 className="text-text not-italic font-bold text-[30px] ml-10 text-left max-w-[291px]">
            Challenge friends online
          </h1>
          <h2 className="text-gray-600 not-italic font-normal max-w-[258px]">
            challenge your online friends for a 1v1 pong party
          </h2>
        </div>
        <FriendButton />
      </div>
    </>
  );
}
