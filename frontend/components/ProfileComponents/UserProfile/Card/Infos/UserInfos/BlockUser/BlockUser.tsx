import { useParams } from "next/navigation";
import React from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import BlockIcon from "./BlockIcon";

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
    // const jwt_token = Cookies.get("JWT_TOKEN");
    // try {
    //   if (jwt_token) {
    //     const response = await axios.patch(
    //       "http://localhost:3000/user/unblock",
    //       { friendRequestId: getId() },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${jwt_token}`,
    //         },
    //         withCredentials: true,
    //       }
    //     );
    //     fetchFriendsReqData();
    //     fetchFriendsData();
    //   } else throw new Error("bad req");
    // } catch (error) {
    //   console.log("an error occured");
    // }
  }

  const className1: string =
    "w-[10rem] h-[3rem]  flex justify-center items-center border border-gray-500 border-solid rounded-[25px] text-sm ";
  const className2: string =
    "w-[5rem] h-[3rem] bg-[#D9923B] flex justify-center items-center  rounded-[25px] text-sm ";
  return (
    <button className={isFriend ? className1 : className2} onClick={postData}>
      {isFriend ? <p>Block User</p> : <BlockIcon />}
    </button>
  );
}

export default BlockUser;
