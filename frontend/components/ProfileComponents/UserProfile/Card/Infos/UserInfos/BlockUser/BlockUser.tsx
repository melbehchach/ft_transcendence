import { useParams } from "next/navigation";
import React from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import BlockIcon from "../UnfriendUser/BlockIcon";

type props = {
  isFriend: boolean;
};

function BlockUser({ isFriend }: props) {
  const param = useParams();
  const {
    fetchFriendsReqData,
    fetchFriendsData,
    state: { friends },
  } = useAuth();

  function getId() {
    return friends?.friends.find((elem) => elem.id === param.id).id;
  }

  async function postData() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/block",
          { friendId: getId() },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  return (
    <button
      className="w-[10rem] h-[3rem]  flex justify-center items-center border border-gray-500 border-solid rounded-[25px] text-sm "
      onClick={postData}
    >
      Block User
    </button>
  );
}

export default BlockUser;
