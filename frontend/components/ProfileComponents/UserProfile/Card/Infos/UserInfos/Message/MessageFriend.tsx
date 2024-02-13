import Image from "next/image";
import MessageIcon from "./MessageIcon";

type props = {
  isFriendCard: boolean;
}

const MessageFriend = ({isFriendCard}: props) => {

  const className1: string="w-full p-[1rem] h-[2.5rem] flex items-center gap-[0.5rem] text-white border border-gray-500 border-solid rounded-[8px]"
  const className2: string = "w-[5rem] h-[3rem] bg-[#D9923B] flex justify-center items-center  rounded-[25px] text-sm ";
  return (
    <button className={isFriendCard ? className1 : className2}>
      <MessageIcon clasName="w-5 h-5" />
      {isFriendCard ? <p>Message</p> : <></>}
    </button>
  );
};

export default MessageFriend;
