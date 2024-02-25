"use client";
import { AvatarProps } from "../types/Avatar.type";

export default function Avatar({ avatarObj }) {
  if (!avatarObj) {
    return null;
  }
  return (
    <div
      className={
        (avatarObj.positiosn ? "flex flex-col" : "flex flex-row") +
        " items-center gap-[0.5rem]"
      }
    >
      <img
        src={avatarObj.src}
        width={100}
        height={100}
        alt={avatarObj.userName ? avatarObj.userName : ""}
        className={`${avatarObj.imageStyle}`}
      />
      <div className="flex flex-row justify-center items-center gap-[1rem]">
        <span className={`${avatarObj.fontSize}`}>{avatarObj.userName}</span>
        {avatarObj.existStatos && avatarObj.statos === "ONLINE" && (
          <div className="flex flex-row justify-center items-center gap-[0.1rem]">
            <div className="w-[10px] h-[10px] bg-green-500 rounded-full text-grey-500"></div>
            online
          </div>
        )}
        {avatarObj.existStatos && avatarObj.statos === "OFFLINE" && (
          <div className="flex flex-row justify-center items-center gap-[0.1rem]">
            <div className="w-[10px] h-[10px] bg-red-500 rounded-full text-grey-500"></div>
            offline
          </div>
        )}
        {avatarObj.existStatos && avatarObj.statos === "PLAYING" && (
          <div className="flex flex-row justify-center items-center gap-[0.1rem]">
            <div className="w-[10px] h-[10px] bg-red-500 rounded-full text-orange-300"></div>
            playing
          </div>
        )}
      </div>
    </div>
  );
}
