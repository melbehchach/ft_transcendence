"use client";

export default function RandomImage() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-lg"
      src="/img/random.png"
      width={250}
      height={250}
      alt="Challenge Friends"
    />
  );
}
