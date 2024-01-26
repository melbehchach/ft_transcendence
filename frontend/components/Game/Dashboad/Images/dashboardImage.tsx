"use client";

export default function DashboadImage() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-lg hidden lg:block xl:block 2xl:block"
      height={750}
      width={750}
      src="/img/GameIntro.png"
      alt="Game Intro Image"
    />
  );
}
