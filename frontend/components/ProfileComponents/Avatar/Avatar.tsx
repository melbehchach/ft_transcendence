"use client";
import Image from "next/image";
import { AvatarProps } from "../types/Avatar.type";

export default function Avatar({ avatarObj }) {
  if (!avatarObj) {
    console.log("makayn walo");
    return null;
  }

  // console.log(avatarObj.src);

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
      <span className={`${avatarObj.fontSize}`}>{avatarObj.userName}</span>
    </div>
  );
}
