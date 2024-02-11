import React from "react";

type props = {
  isFriend: boolean;
};
function BlockUser({ isFriend }: props) {
  const className1: string =
    "w-[10rem] h-[3rem]  flex justify-center items-center border border-gray-500 border-solid rounded-[25px] text-sm ";
  const className2: string =
    "w-[5rem] h-[3rem] bg-[#D9923B] flex justify-center items-center  rounded-[25px] text-sm ";
  return (
    <button className={isFriend ? className1 : className2}>
      {isFriend ? <p>Block User</p> : <div></div>}
    </button>
  );
}

export default BlockUser;
