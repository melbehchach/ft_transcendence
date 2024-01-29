"use client";
import Image from "next/image";
import { AvatarProps } from "../types/Avatar.type";

export default function Avatar(avatrObj: AvatarProps) {
  if (!avatrObj.src) return null;
  return (
    <div className={(avatrObj.positiosn ? "flex flex-col" : "flex flex-row") + " items-center gap-[0.5rem]"}>
      <Image
        src={avatrObj.src}
        width={100}
        height={100}
        alt={avatrObj.userName}
        className={`${avatrObj.imageStyle}`}
        priority={true}
      />
      <span className={`${avatrObj.fontSize}`}>{avatrObj.userName}</span>
    </div>
  );
}
