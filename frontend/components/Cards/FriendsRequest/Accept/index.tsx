import Image from "next/image";
import AcceptMark from "./AcceptMark.svg";

const Accept = () => {
  return (
    <button
      type="button"
      className="w-[233px] h-[39px] border border-[#000000] rounded-[10px] flex inline-flex items-center gap-3"
    >
      <Image
        src={AcceptMark}
        alt="Accept icon"
        width="19"
        height="15"
        className="ml-[10px]"
      />
      Accept
    </button>
  );
};

export default Accept;
