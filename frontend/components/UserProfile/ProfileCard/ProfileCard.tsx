import PlayersInfos from "./PlayerInfos/PlayersInfos";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import SettingIcon from "./SettingIcon";
import { useState } from "react";

function ProfileCard() {
  const [infos, setInfos] = useState<boolean>(true);
  const [setting, setSetting] = useState<boolean>(false);

  function handleClick() {
    setInfos(false);
    setSetting(true);
  }

  return (
    <div className="w-[20rem] h-[53rem] text-white flex flex-col mt-[2rem] ml-[2rem] border border-black border-solid border-1 rounded-[15px]">
      <div className="mr-[0.5rem] mt-[0.5rem] flex justify-start place-self-end">
        <button type="button" onClick={handleClick}>
          <div className={(!infos ? "hidden" : "")}>
            <SettingIcon />
          </div>
        </button>
      </div>
      {infos && (
        <div>
          <PlayersInfos />
        </div>
      )}
      {setting && (
        <div>
          <ProfileSettings setInfos={setInfos} setSetting={setSetting} />
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
