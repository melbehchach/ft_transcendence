import Auth from "./Auth/Auth";
import GameTheme from "./GameTheme/GameTheme";
import Password from "./Password/Password";
import ProfileAvatar from "./ProfileAvatar/ProfileAvatar";
import SaveDiscard from "./SaveDiscard/SaveDiscard";
import Username from "./Username/Username";

type settingsProps = {
  openSettings: () => void;
};

function ProfileSettings({ openSettings }: settingsProps) {
  function handleSave(): void {
    openSettings();
  }

  return (
    <div className="w-[21rem] h-full flex flex-col gap-[1.3rem] ">
      <h1 className="w-full font-semibold text-3xl">Settings</h1>
      <ProfileAvatar />
      <Username />
      <Password />
      <GameTheme />
      <Auth />
      <SaveDiscard handleSave={handleSave} />
    </div>
  );
}

export default ProfileSettings;
