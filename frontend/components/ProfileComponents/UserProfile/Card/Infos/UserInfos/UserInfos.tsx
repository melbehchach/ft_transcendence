import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../app/context/AuthContext";
import Avatar from "../../../../Avatar/Avatar";
import { AvatarProps } from "../../../../types/Avatar.type";
import Achievements from "../Achievements/Achievements";
import achievementsData from "../Achievements/AchievementsData";
import fakeData from "../Scores/RecordsData";
import Scores from "../Scores/Scores";
import FriendshipState from "./FriendshipSatate/FriendshipState";

type infosProps = {
  isSenderReq: boolean;
  isReceivedReq: boolean;
};

function UserInfos() {
  const {
    state: { profile },
  } = useAuth();

  const avatarObj: AvatarProps = {
    src: profile.avatar,
    width: 100,
    height: 100,
    userName: profile.username,
    imageStyle: "w-[13rem] h-[13rem] rounded-full object-cover",
    fontSize: "text-2xl font-bold",
    positiosn: true,
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-[1rem]">
      <div className="w-full flex justify-center items-center">
        <Avatar avatarObj={avatarObj} />
      </div>
      <FriendshipState />
      <Scores myScoresArray={fakeData} />
      <Achievements achievementsArray={achievementsData} />
    </div>
  );
}

export default UserInfos;
