import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import React from "react";

type addFriendProps = {
  addFriend: () => void;
}

function AddFriend({addFriend}: addFriendProps) {
  const params = useParams();
  async function postData() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.post(
          "http://localhost:3000/user/sendRequest",
          { receiverId: params.id },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        addFriend();
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
      className="w-[10rem] h-[3rem] bg-[#D9923B] flex justify-center items-center rounded-[25px] text-sm "
      onClick={handleClick}
    >
      Add Friend
    </button>
  );
}

export default AddFriend;
