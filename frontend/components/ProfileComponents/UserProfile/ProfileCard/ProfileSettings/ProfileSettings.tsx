import { DataFetch } from "../../../types/Avatar.type";
import Username from "./Username/Username";
import Password from "./Password/Password";
import GameTheme from "./GameTheme/GameTheme";
import Auth from "./Auth/Auth";
import SaveDiscard from "./SaveDiscard/SaveDiscard";
import ProfileAvatar from "./ProfileAvatar/ProfileAvatar";

type settingsProps = {
  data: DataFetch;
  openSettings: () => void;
};

function ProfileSettings({ data, openSettings }: settingsProps) {
  function handleSave(): void {
    openSettings();
  }

  return (
    <div className="w-full h-full flex flex-col gap-[1.3rem] p-[0.5rem] ">
      <h1 className="font-semibold text-3xl">Settings</h1>
      <ProfileAvatar data={data} />
      <Username />
      <Password />
      <GameTheme />
      <Auth />
      <SaveDiscard handleSave={handleSave} />
    </div>
  );
}

export default ProfileSettings;
