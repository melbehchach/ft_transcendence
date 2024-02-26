import React from "react";
import Joystick from "./Joystick";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import { useParams } from "next/navigation";


type props = {
  isFriendCard: boolean;
  id: string;
};

function ChallengeFriend({ isFriendCard, id }: props) {
  const param = useParams();
  const {
    state: {
      friends,
      user,
    },
    GameRequest,
  } = useAuth();

  function handleClick() {
    if (id) {
      friends.friends.map((friend, index) => {
        GameRequest(id);
      })
    }
    else if (param.id){
      GameRequest(param.id);
    }
    else {
      GameRequest();
    }
  }
  const className1: string =
    "w-full h-[2.5rem] p-[1rem] flex items-center gap-3 text-white border border-gray-500 rounded-[8px] hover:bg-primary/5";
  const className2: string =
    "w-[10rem] h-[3rem] gap-3 bg-[#D9923B] flex justify-center items-center rounded-[25px] text-sm ";

  return (
    <button className={isFriendCard ? className1 : className2} onClick={handleClick} >
      <Joystick className="w-5 h-5" />
      Challenge
    </button>
  );
}

export default ChallengeFriend;
