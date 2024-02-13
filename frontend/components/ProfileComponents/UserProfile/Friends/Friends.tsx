import Avatar from "../../Avatar/Avatar";
import Message from "../Card/Infos/UserInfos/Message/MessageFriend";
import { AvatarProps } from "../../types/Avatar.type";
import ChallengeFriend from "../Card/Infos/UserInfos/Challenge/ChallengeFriend";
import MessageIcon from "../Card/Infos/UserInfos/Message/MessageIcon";
import MessageFriend from "../Card/Infos/UserInfos/Message/MessageFriend";

type props = {
  item: any;
};

const Friends = ({ item }: props) => {
  const avatarObj: AvatarProps = {
    src: item.avatar,
    width: 100,
    height: 100,
    userName: item.username,
    imageStyle: "rounded-t-[15px] w-[15.9rem] h-[11rem] object-cover",
    fontSize: "text-base text-white",
    positiosn: true,
  };
  return (
    <div className="w-[16rem] h-full flex flex-col gap-3 border border-black border-solid border-b-1 rounded-[15px]">
      <div className="w-full flex justify-center items-center">
        <Avatar avatarObj={avatarObj} />
      </div>
      <div className="w-full h-full flex flex-col items-center gap-3 p-[0.5rem]">
        <ChallengeFriend isFriendCard={true} />
        <MessageFriend isFriendCard={true} />
      </div>
    </div>
  );
};

export default Friends;
