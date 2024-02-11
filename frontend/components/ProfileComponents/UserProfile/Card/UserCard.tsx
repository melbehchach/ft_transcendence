import { useEffect } from "react";
import { useAuth } from "../../../../app/context/AuthContext";
import UserInfos from "./Infos/UserInfos/UserInfos";

function UserCard() {


  return (
    <div className="w-[22rem] h-full p-[0.5rem] text-white flex flex-col border border-black border-solid rounded-[15px]">
      <UserInfos  />
    </div>
  );
}

export default UserCard;
