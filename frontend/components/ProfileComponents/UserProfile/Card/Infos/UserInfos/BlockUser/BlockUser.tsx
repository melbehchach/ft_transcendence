import { useParams } from "next/navigation";
import React from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import BlockIcon from "./BlockIcon";

type props = {
  isFriend: boolean;
  setBlocker: any;
};

function BlockUser({ isFriend, setBlocker }: props) {
  const param = useParams();
  const { fetchFriendsData, fetchData } = useAuth();

  async function blockSate(id: string | string[]) {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios
          .patch(
            "http://localhost:3000/user/block",
            { friendId: id },
            {
              headers: {
                Authorization: `Bearer ${jwt_token}`,
              },
              withCredentials: true,
            }
          )
          .then(() => {
            fetchFriendsData();
          })
          .then(() => {
            fetchData();
          })
          .then(() => {
            fetchData(id);
          })
          .then(() => setBlocker(true));
      } else throw new Error("bad req");
    } catch (error) {}
  }

  function blockUser() {
    blockSate(param.id);
  }

  const className1: string =
    "w-[10rem] h-[3rem] flex justify-center items-center border border-gray-500 border-solid rounded-[25px] text-sm hover:bg-primary/5";
  const className2: string =
    "w-[5rem] h-[3rem] bg-[#D9923B] flex justify-center items-center  rounded-[25px] text-sm ";

  return (
    <button className={isFriend ? className2 : className1} onClick={blockUser}>
      {isFriend ? <BlockIcon /> : <p>Block User</p>}
    </button>
  );
}

export default BlockUser;
