import { useParams } from "next/navigation";
import React from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import BlockIcon from "./BlockIcon";

function UnfriendUser() {
  const param = useParams();
  const {
    fetchFriendsReqData,
    fetchFriendsData,
    state: { friends },
  } = useAuth();

  function getId() {
    console.log(friends?.friends.find((elem) => elem.id === param.id).id);
    return friends?.friends.find((elem) => elem.id === param.id).id;
  }

  async function postData() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/unfriendUser",
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
      className="w-[5rem] h-[3rem] bg-[#D9923B] flex justify-center items-center  rounded-[25px] text-sm "
      onClick={postData}
    >
      <BlockIcon />
    </button>
  );
}

export default UnfriendUser;
