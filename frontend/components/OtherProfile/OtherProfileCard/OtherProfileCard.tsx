import { useState } from "react";
import PlayersInfos from "./PlayerInfos/PlayersInfos";

function OtherProfileCard() {
  const [add, setAdd] = useState<boolean>(true);

  return (
    <div className="w-[20rem] h-[53rem] text-white flex flex-col mt-[1.5rem] ml-[2rem] border border-black border-solid border-1 rounded-[15px]">
      <PlayersInfos add={add} setAdd={setAdd} />
    </div>
  );
}

export default OtherProfileCard;
