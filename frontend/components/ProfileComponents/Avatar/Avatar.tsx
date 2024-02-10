"use client";
import Image from "next/image";
import { AvatarProps } from "../types/Avatar.type";

export default function Avatar({ avatarObj }) {
  if (!avatarObj) return null;

  return (
    <div
      className={
        (avatarObj.positiosn ? "flex flex-col" : "flex flex-row") +
        " items-center gap-[0.5rem]"
      }
    >
      <Image
        src={avatarObj.src}
        width={100}
        height={100}
        alt={avatarObj.userName ? avatarObj.userName : ""}
        className={`${avatarObj.imageStyle}`}
        priority={true}
      />
      <span className={`${avatarObj.fontSize}`}>{avatarObj.userName}</span>
    </div>
  );
}
