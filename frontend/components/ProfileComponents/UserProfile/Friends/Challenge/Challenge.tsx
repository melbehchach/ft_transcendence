import Joystick from "./Joystick";

type props = {
  isFriendCard: boolean;
};

function Challenge({ isFriendCard }: props) {
  const className1: string =
    "w-[14.5rem] h-[2.5rem] flex items-center gap-3 ml-3 text-white border border-gray-500 border-solid border-b-1 rounded-[8px]";
  const className2: string =
    "w-[10rem] h-[3rem] gap-3 bg-[#D9923B] flex justify-center items-center rounded-[25px] text-sm ";

  return (
    <button className={isFriendCard ? className1 : className2}>
      {/* change it to fit the friend card */}
      {/* <div className="ml-[1rem]"> */}
      <Joystick className="w-5 h-5" />
      {/* </div> */}
      Challenge
    </button>
  );
}

export default Challenge;
