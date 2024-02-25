import { useEffect, useState } from "react";
import { useAuth } from "../../../../app/context/AuthContext";
import { AvatarProps } from "../../types/Avatar.type";
import Avatar from "../../Avatar/Avatar";
import Scores from "./Infos/Scores/Scores";
import Achievements from "./Infos/Achievements/UserAchievements";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import SettingIcon from "./ProfileSettings/SettingIcon";
import achievementsData from "./Infos/Achievements/AchievementsData";

type props = {
  setting: boolean;
  setSetting: any;
};

function ProfileCard({ setting, setSetting }: props) {
  const {
    state: { user },
  } = useAuth();

  const avatarObj: AvatarProps = {
    src: user.avatar,
    width: 100,
    height: 100,
    userName: user.username,
    imageStyle: "w-[13rem] h-[13rem] rounded-full object-cover",
    fontSize: "text-2xl font-bold",
    positiosn: true,
  };

  function closeSettings() {
    setSetting(false);
  }

  return (
    <div className="w-[22rem] h-full p-[0.5rem] text-white flex flex-col border border-black border-solid rounded-[15px]">
      <button
        className={!setting ? "place-self-end" : "hidden"}
        onClick={() => setSetting(true)}
      >
        <SettingIcon />
      </button>
      {!setting ? (
        <div className="w-full h-full flex flex-col justify-center items-center gap-[1rem]">
          <div className="w-full flex justify-center items-center">
            <Avatar avatarObj={avatarObj} />
          </div>
          <Scores />
          <Achievements achievementsArray={achievementsData} />
        </div>
      ) : (
        <ProfileSettings openSettings={closeSettings} />
      )}
    </div>
  );
}

export default ProfileCard;
