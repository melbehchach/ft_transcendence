import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";

type Props = {
  card: boolean;
  setBlocked: any;
  setBlocker: any;
};

function AddFriend({ card, setBlocked, setBlocker }: Props) {
  const params = useParams();
  const { fetchFriendsReqData, fetchData } = useAuth();

  async function postData() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios
          .post(
            "http://localhost:3000/user/sendRequest",
            { receiverId: params.id },
            {
              headers: {
                Authorization: `Bearer ${jwt_token}`,
              },
              withCredentials: true,
            }
          )
          .then(() => fetchFriendsReqData());
      } else throw new Error("bad req");
    } catch (error) {
      // console.log("an error occured");
    }
  }

  useEffect(() => {
    setBlocked(false);
    setBlocker(false);
    fetchData(params.id);
  }, []);

  function handleClick() {
    postData();
  }

  const className1: string =
    "w-[10rem] h-[3rem] bg-[#D9923B] flex justify-center items-center rounded-[25px] text-sm";
  const className2: string =
    "w-full h-[2.5rem] p-[1rem] flex items-center gap-3 text-white border border-gray-500 rounded-[8px]";

  return (
    <button className={card ? className2 : className1} onClick={handleClick}>
      Add Friend
    </button>
  );
}

export default AddFriend;
