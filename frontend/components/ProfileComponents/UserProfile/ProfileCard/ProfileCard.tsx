import { useState } from "react";
import PlayersInfos from "./PlayerInfos/PlayersInfos";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import SettingIcon from "./SettingIcon";

function ProfileCard() {
  const [setting, setSetting] = useState<boolean>(false);

  function closeSettings() {
    setSetting(false);
  }

  return (
    <div className="w-[22rem] h-full p-[0.5rem] text-white flex flex-col border border-black border-solid rounded-[15px]">
      <div className={!setting ? "place-self-end" : "hidden"}>
        <button onClick={() => setSetting(true)}>
          <SettingIcon />
        </button>
      </div>
      {!setting ? (
        <PlayersInfos />
      ) : (
        <ProfileSettings openSettings={closeSettings} />
      )}
    </div>
  );
}

export default ProfileCard;
