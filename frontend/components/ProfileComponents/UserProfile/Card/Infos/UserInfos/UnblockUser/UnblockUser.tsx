import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";

type props = {
  setBlocker: any;
};

function UnblockUser({ setBlocker }: props) {
  const param = useParams();
  const {
    fetchData,
    state: { user },
  } = useAuth();

  function getId() {
    return user.blockedUsers.find((elem) => elem.id === param.id).id;
  }

  async function blockSate(id: string) {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios
          .patch(
            "http://localhost:3000/user/unblock",
            { friendId: id },
            {
              headers: {
                Authorization: `Bearer ${jwt_token}`,
              },
              withCredentials: true,
            }
          )
          .then(() => {
            fetchData();
          })
          .then(() => {
            fetchData(id);
          });
      } else throw new Error("bad req");
    } catch (error) {}
  }

  useEffect(() => {
    setBlocker(true);
    fetchData(param.id);
  }, []);

  function unblockUser() {
    blockSate(getId());
  }

  return (
    <button
      className="w-full h-[3rem] bg-[#D9923B] flex justify-center items-center  rounded-[25px] text-sm "
      onClick={unblockUser}
    >
      Unblock User
    </button>
  );
}

export default UnblockUser;
