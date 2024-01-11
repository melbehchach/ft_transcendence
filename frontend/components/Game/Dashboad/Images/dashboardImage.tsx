"use client";
import Image from "next/image";

export default function DashboadImage() {
  return (
    <Image
      className="rounded-lg hidden 2xl:inline-block 2xl:shrink-0"
      src="/img/GameIntro.png"
      width={750}
      height={750}
      alt="Challenge Friends"
    />
  );
}
