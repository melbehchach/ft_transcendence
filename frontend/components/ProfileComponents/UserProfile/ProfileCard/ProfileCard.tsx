import { useState } from "react";
import PlayersInfos from "./PlayerInfos/PlayersInfos";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import SettingIcon from "./SettingIcon";

function ProfileCard() {
  const [infos, setInfos] = useState<boolean>(true);
  const [setting, setSetting] = useState<boolean>(false);

  function closeSetting() {
    setInfos(false);
    setSetting(true);
  }

  function openSettings() {
    setInfos(true);
    setSetting(false);
  }

  return (
    <div className="w-[22rem] h-full p-[0.5rem] text-white flex flex-col border border-black border-solid rounded-[15px]">
      <div className={!infos ? "hidden" : "place-self-end"}>
        <button onClick={closeSetting}>
          <SettingIcon />
        </button>
      </div>
      {infos && <PlayersInfos />}
      {setting && <ProfileSettings openSettings={openSettings} />}
    </div>
  );
}

export default ProfileCard;
