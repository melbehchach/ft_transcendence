import React from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";

type Props = {
  accepteState: () => void;
};

function AcceptFriend() {
  const param = useParams();
  const {
    fetchFriendsReqData, fetchFriendsData,
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
  return (
    <button
      className="w-[10rem] h-[3rem] bg-[#D9923B] flex justify-center items-center rounded-[25px] text-sm "
      onClick={postData}
    >
      Accept Friend
    </button>
  );
}

export default AcceptFriend;
