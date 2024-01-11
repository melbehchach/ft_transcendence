"use client";
import Image from "next/image";



export default function FriendImage() {
  return (
    <Image
      className="rounded-lg"
      src="/img/ChallengeFriends.png"
      width={250}
      height={250}
      propriority="false"
      alt="Challenge Friends"
    />
  );
}