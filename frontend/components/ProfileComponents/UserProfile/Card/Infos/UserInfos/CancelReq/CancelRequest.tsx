import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { send } from "process";
import React from "react";

type cancelFriendProps = {
  cancelFriend: () => void;
};

function CancelRequest({ cancelFriend }: cancelFriendProps) {
  const params = useParams();
  console.log(params.id);
  async function postData() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/cancelRequest",
          { friendRequestId: params.id },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        cancelFriend();
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  function handleClick() {
    postData();
  }

  return (
    <button
      className="w-[10rem] h-[3rem] bg-background flex justify-center items-center border border-gray-500 border-solid rounded-[25px] text-sm"
      onClick={handleClick}
    >
      Cancel Request
    </button>
  );
}

export default CancelRequest;
