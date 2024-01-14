import Image from "next/image";
import MessageIcon from "./MessageIcon";

const Message = () => {
  return (
    <button
      type="button"
      className="w-[14.5rem] h-[2.5rem] flex items-center gap-[0.5rem] ml-3 text-white border border-gray-500 border-solid border-b-1 rounded-[8px]"
    >
      <div className="ml-[1rem]">
        <MessageIcon />
      </div>
      Message
    </button>
  );
};

export default Message;
