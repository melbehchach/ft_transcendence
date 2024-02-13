import React from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import AcceptIcon from "./AcceptIcon";

type props = {
  isCard: boolean;
};

function AcceptFriend({ isCard }: props) {
  const param = useParams();
  const {
    fetchFriendsReqData,
    fetchFriendsData,
    state: { friendRequests },
  } = useAuth();

  function getId() {
    return friendRequests?.receivedRequests.find(
      (elem) => elem.senderId === param.id && elem.status === "PENDING"
    ).id;
  }

  async function postData() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/acceptRequest",
          { friendRequestId: getId() },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        fetchFriendsReqData();
        fetchFriendsData();
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  const className1: string =
    "w-[10rem] h-[3rem] bg-[#D9923B] flex justify-center items-center rounded-[25px] text-sm ";
  const className2: string =
    "w-full h-[2.5rem] p-[1rem] flex items-center gap-[0.5rem] text-white border border-gray-500 border-solid rounded-[8px]";

  return (
    <button className={isCard ? className1 : className2} onClick={postData}>
      {!isCard ? <AcceptIcon clasName="w-5 h-5" /> : <></>}
      {!isCard ? <p>Accept</p> : <p>Accept friend</p>}
    </button>
  );
}

export default AcceptFriend;
