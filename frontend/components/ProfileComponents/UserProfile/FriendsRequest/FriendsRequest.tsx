import Avatar from "../../Avatar/Avatar";
import Accept from "./Accept/Accept";
import Delete from "./Delete/Delete";
import { AvatarProps } from "../../types/Avatar.type";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../app/context/AuthContext";
import { useParams } from "next/navigation";

const FriendsRequest = ({ item }) => {
  const [user, setUser] = useState({
    name: "",
    avatar: "",
  });

  const { fetchData, manageFreindReq } = useAuth();

  useEffect(() => {
    fetchData(item.senderId, true).then((result) => {
      setUser({
        name: result.username,
        avatar: result.avatar,
      });
    });
  }, []);

  const avatarObj = {
    src: user.avatar,
    userName: user.name,
    width: 100,
    height: 100,
    imageStyle: "rounded-t-[15px] w-[15.9rem] h-[11rem] object-cover",
    fontSize: "text-base text-white",
    positiosn: true,
  };

  return (
    <div className="w-[16rem] h-full flex flex-col gap-3 border border-black border-solid border-b-1 rounded-[15px]">
      <div className="w-full flex justify-center items-center">
        <Avatar avatarObj={avatarObj} />
      </div>
      <div className="w-full h-full flex flex-col items-center gap-3 mb-[0.5rem]">
        <div className="w-full h-full">
          <Accept />
        </div>
        <div className="w-full h-full">
          <Delete manageFriends={() => manageFreindReq(item.id, "decline")} />
        </div>
      </div>
    </div>
  );
};

export default FriendsRequest;
