"use client";
import Image from "next/image";
import { AvatarProps } from "../types/Avatar.type";

export default function Avatar(avatrObj: AvatarProps) {
  if (!avatrObj.src) return null;
  return (
    <div className={avatrObj.positiosn ? "flex flex-col items-center gap-[0.5rem]" : "flex flex-row items-center gap-[0.5rem]"}>
      <Image
        src={avatrObj.src}
        width={100}
        height={100}
        alt={avatrObj.userName}
        className={`${avatrObj.imageStyle}`}
        priority={true}
      />
      <div className={`${avatrObj.fontSize}`}>
        <h1>{avatrObj.userName}</h1>
      </div>
    </div>
  );
}
