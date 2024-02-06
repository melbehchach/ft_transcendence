import { useEffect, useState } from "react";
import PlayersInfos from "./PlayerInfos/PlayersInfos";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import SettingIcon from "./SettingIcon";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../app/context/AuthContext";

function ProfileCard() {
  const [setting, setSetting] = useState<boolean>(false);
  const params = useParams();
  const {
    state: { profile, user },
  } = useAuth();
  function closeSettings() {
    setSetting(false);
  }

  const infos = params.id ? (
    <PlayersInfos avatar={profile.avatar} username={profile.userName} />
  ) : (
    <PlayersInfos avatar={user.avatar} username={user.userName} />
  );
  return (
    <div className="w-[22rem] h-full p-[0.5rem] text-white flex flex-col border border-black border-solid rounded-[15px]">
      <div className={!setting ? "place-self-end" : "hidden"}>
        <button onClick={() => setSetting(true)}>
          <SettingIcon />
        </button>
      </div>
      {!setting ? infos : <ProfileSettings openSettings={closeSettings} />}
    </div>
  );
}

export default ProfileCard;
