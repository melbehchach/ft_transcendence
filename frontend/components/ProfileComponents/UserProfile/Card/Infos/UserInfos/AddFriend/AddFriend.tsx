import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import React from "react";

function AddFriend() {
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
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  function addFriend() {
    postData();
  }

  function acceptClick() {
    console.log("clicked");
  }

  return (
    <button
      className="w-[10rem] h-[3rem] bg-[#D9923B] flex justify-center items-center rounded-[25px] text-sm "
      onClick={acceptClick}
    >
      Add Friend
    </button>
  );
}

export default AddFriend;
