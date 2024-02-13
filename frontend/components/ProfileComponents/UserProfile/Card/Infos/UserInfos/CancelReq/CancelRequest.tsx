import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import React from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";


function CancelRequest() {
  const param = useParams();
  const {
    fetchFriendsReqData, manageFreindReq,
    state: { friendRequests },
  } = useAuth();

  function getId() {
    return friendRequests?.sentRequests.find(
      (elem) => elem.receiverId === param.id && elem.status === "PENDING"
    ).id;
  }

  async function postData() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    console.log("cancel player");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/cancelRequest",
          { friendRequestId: getId() },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        fetchFriendsReqData();
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  return (
    <button
      className="w-[10rem] h-[3rem] bg-background flex justify-center items-center border border-gray-500 border-solid rounded-[25px] text-sm"
      onClick={postData}
    >
      Cancel Request
    </button>
  );
}

export default CancelRequest;
