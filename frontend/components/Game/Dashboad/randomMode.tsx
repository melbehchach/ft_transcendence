"use client";
import RandomButton from "./Buttons/randomButton";
import RandomImage from "./Images/randomImage";


export default function RandomMode() {
  return (
    <section className="flex flex-col justify-center items-center w-auto h-auto p-7">
      <RandomImage />
      <h1 className="text-text not-italic font-bold text-[20px]">
        Find a random opponent
      </h1>
      <h2 className="text-gray-600 not-italic font-normal text-[10px]">
        Let us find you a random opponent online
      </h2>
      <RandomButton />
    </section>
  );
}
