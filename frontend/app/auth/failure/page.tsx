"use client";
import { useRouter } from "next/navigation";

export default function Failure() {
  const router = useRouter();
  return (
    <>
      <div className="h-screen w-screen bg-login bg-center bg-cover bg-no-repeat flex justify-center items-center font-sans">
        <div className="backdrop-blur-md bg-white/10 w-full md:w-auto py-8 px-6 md:py-12 md:px-14 rounded-2xl flex flex-col items-center gap-5 md:gap-10">
          <div className="flex flex-col gap-2.5 items-center">
            <h1 className=" text-2xl font-bold md:text-title md:font-semibold text-text text-center">
              Oops
            </h1>
            <span className="text-text text-opacity-20 text-small text-center">
              It looks like shit hit the fan. Please Try Again Later
            </span>
          </div>
          <button
            className="block bg-primary text-text text-small px-6 py-3 mb-4 rounded-lg w-1/2 sm:w-2/3"
            onClick={() => {
              router.push("/auth/login");
            }}
          >
            GO BACK
          </button>
        </div>
      </div>
    </>
  );
}
