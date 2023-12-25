import Image from "next/image";
import Joystick from "./Joystick.svg";

const Challenge = () => {
  return (
    <button
      type="button"
      className="w-[233px] h-[39px] border border-[#000000] rounded-[10px] flex inline-flex items-center gap-3"
    >
      <Image src={Joystick} alt="Joystick icon" width="19" height="15" className="ml-[10px]"/>
      Challenge
    </button>
  );
};

export default Challenge;
