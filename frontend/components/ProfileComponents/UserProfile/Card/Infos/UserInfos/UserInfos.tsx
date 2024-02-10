import Avatar from "../../../../Avatar/Avatar";
import { AvatarProps } from "../../../../types/Avatar.type";
import Challenge from "../../../Friends/Challenge/Challenge";
import Achievements from "../Achievements/Achievements";
import achievementsData from "../Achievements/AchievementsData";
import fakeData from "../Scores/RecordsData";
import Scores from "../Scores/Scores";
import AddFriend from "./AddFriend/AddFriend";
import BlockUser from "./BlockUser/BlockUser";
import CancelRequest from "./CancelReq/CancelRequest";

function UserInfos({ avatar, username }) {
  const avatarObj: AvatarProps = {
    src: avatar,
    width: 100,
    height: 100,
    userName: username,
    imageStyle: "w-[13rem] h-[13rem] rounded-full object-cover",
    fontSize: "text-2xl font-bold",
    positiosn: true,
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-[1rem]">
      <div className="w-full flex justify-center items-center">
        <Avatar avatarObj={avatarObj} />
      </div>
      <div className="w-full relative flex flex-row gap-1">
        {/* <AddFriend /> */}
        {/* <CancelRequest /> */}
        {/* <BlockUser isFriend={true} /> */}
        <Challenge isFriendCard={false} />
        <BlockUser isFriend={false} />
      </div>
      <Scores myScoresArray={fakeData} />
      <Achievements achievementsArray={achievementsData} />
    </div>
  );
}

export default UserInfos;
