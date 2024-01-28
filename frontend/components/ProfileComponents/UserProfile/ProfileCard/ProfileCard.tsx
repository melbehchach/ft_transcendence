import PlayersInfos from "./PlayerInfos/PlayersInfos";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import SettingIcon from "./SettingIcon";
import { useState } from "react";
import { DataFetch } from "../../types/Avatar.type";

function ProfileCard(data: DataFetch) {
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
    <div className="h-fit text-white flex flex-col border border-black border-solid border-1 rounded-[15px]">
      <div className="mr-[0.5rem] mt-[0.5rem] flex justify-start place-self-end">
        <button type="button" onClick={closeSetting}>
          <div className={(!infos ? "hidden" : "")}>
            <SettingIcon />
          </div>
        </button>
      </div>
      {infos && (
        <div>
          <PlayersInfos {...data} />
        </div>
      )}
      {setting && (
        <div className="flex flex-col gap-[1rem] mb-[1rem] ">
          <ProfileSettings data={data} openSettings={openSettings} />
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
