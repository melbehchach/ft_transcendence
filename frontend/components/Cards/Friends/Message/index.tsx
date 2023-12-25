import Image from "next/image";
import MessageIcon from "./MessageIcon.svg";

const Message = () => {
  return (
    <button
      type="button"
      className="w-[233px] h-[39px] border border-[#000000] rounded-[10px] flex inline-flex items-center gap-3"
    >
      <Image src={MessageIcon} alt="Message icon" width="19" height="15" className="ml-[10px]"/>
      Message
    </button>
  );
};

export default Message;
