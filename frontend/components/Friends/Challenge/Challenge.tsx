import Image from "next/image";
import Joystick from "./Joystick";

const Challenge = () => {
  return (
    <button
      type="button"
      className="w-[14.5rem] h-[2.5rem] flex items-center gap-3 ml-3 text-white border border-gray-500 border-solid border-b-1 rounded-[8px]"
    >
      <div className="ml-[1rem]">
        <Joystick />
      </div>
      Challenge
    </button>
  );
};

export default Challenge;
