import Avatar from "../../Avatar/Avatar";
import { AvatarProps } from "../../types/Avatar.type";
import ChallengeFriend from "../Card/Infos/UserInfos/Challenge/ChallengeFriend";
import MessageFriend from "../Card/Infos/UserInfos/Message/MessageFriend";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../app/context/AuthContext";
import AddFriend from "../Card/Infos/UserInfos/AddFriend/AddFriend";
import { useEffect, useState } from "react";

type props = {
  item: any;
};

const UserFriends = ({ item }: props) => {
  const {
    fetchFriendsData,
    fetchData,
    state: { friends, loading },
  } = useAuth();

  const router = useRouter();

  const avatarObj: AvatarProps = {
    src: item.avatar,
    width: 100,
    height: 100,
    userName: item.username,
    imageStyle: "rounded-t-[15px] w-[15.9rem] h-[11rem] object-cover",
    fontSize: "text-base text-white",
    positiosn: true,
    existStatos: false,
  };

  function handleClick() {
    router.push(`/profile/${item.id}`);
  }

  useEffect(() => {
    fetchData(item.data);
    fetchFriendsData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <div className="w-[16rem] h-full flex flex-col gap-3 border border-black border-solid border-b-1 rounded-[15px]">
      <div
        className="w-full flex justify-center items-center"
        onClick={handleClick}
      >
        <Avatar avatarObj={avatarObj} />
      </div>
      <div className="w-full h-full flex flex-col items-center gap-3 p-[0.5rem]">
        <ChallengeFriend isFriendCard={true} id={item.id} />
        <MessageFriend isFriendCard={true} />
      </div>
    </div>
  );
};

export default UserFriends;
