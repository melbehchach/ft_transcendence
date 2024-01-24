"use client";
import FriendImage from "@/../../components/Game/Dashboad/Images/friendImage";
import FriendButton from "@/../../components/Game/Dashboad/Buttons/friendButton";

export default function FriendMode() {
  return (
    <section className="flex flex-col justify-center items-center space-y-1 lg:space-y-5 lg:w-min">
      <FriendImage />
      <h1 className="text-text not-italic font-bold text-[20px] lg:text-[25px] lg:text-left">
        Challenge friends online
      </h1>
      <h2 className="text-gray-600 not-italic font-normal text-[10px] xl:text-[16px]">
        Challenge your online friends for a 1v1 pong party
      </h2>
      <FriendButton />
    </section>
  );
}
