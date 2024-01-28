import Avatar from "../../../Avatar/Avatar";
import AddAvatarButton from "./AddAvatarButton";
import DarkTheme from "./DarkTheme";
import LightTheme from "./LightTheme";
import GrayTheme from "./GrayTheme";
import { DataFetch } from "../../../types/Avatar.type";
import { AvatarProps } from "../../../types/Avatar.type";

type settingsProps = {
  data: DataFetch;
  openSettings: () => void;
};

function ProfileSettings({ data, openSettings }: settingsProps) {
  const avatarObj: AvatarProps = {
    src: data.avatar,
    width: 100,
    height: 100,
    userName: "",
    imageStyle: "w-[8rem] h-[8rem] rounded-full object-cover",
    fontSize: "text-2xl",
    positiosn: true,
  };

  function handleSave() {
    openSettings();
  }

  return (
    <div className="w-full h-full flex flex-col gap-[1.3rem] p-[0.5rem] ">
      <h1 className="font-semibold text-3xl">Settings</h1>
      <div className="relative w-fit flex flex-row">
        <Avatar {...avatarObj} />
        <button className="absolute bottom-0 right-0 mb-[1rem]">
          <AddAvatarButton />
        </button>
      </div>
      <div className="flex flex-col justify-strat">
        <form className="flex flex-col gap-[0.5rem] ">
          <label className="text-xl font-light">Username: </label>
          <input
            type="text"
            className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-lg font-light outline-none"
            placeholder="new username"
          />
        </form>
      </div>
      <div className="flex flex-col justify-strat  ">
        <form className="flex flex-col gap-[0.5rem] ">
          <label className="text-xl font-light">Pssword: </label>
          <input
            type="password"
            className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-lg font-light outline-none"
            placeholder="current password"
          />
          <input
            type="password"
            className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-lg font-light outline-none"
            placeholder="new password"
          />
        </form>
      </div>
      <div className="flex flex-col justify-center gap-[0.5rem] text-xl font-light">
        <h1>Game theme: </h1>
        <div className="flex flex-row gap-[1.2rem]">
          <button>
            <DarkTheme />
          </button>
          <button>
            <LightTheme />
          </button>
          <button>
            <GrayTheme />
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col gap-[1rem]">
        <h1 className="text-base">Two-Factor authentication</h1>
        <p className="text-xs text-gray-500">
          Scan this with Google Authenticator app and enter the code below in
          order to activate 2FA
        </p>
        <div className="w-[6rem] h-[6rem] border border-black border-2">
          <p>QR code</p>
        </div>
        <form className="w-full h-[2rem] flex flex-col gap-[0.5rem] ">
          <input
            type="number"
            className="w-full h-[3rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-base font-light outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="6-digit code"
          />
        </form>
        <p className="text-xs font-light text-gray-500">Press Enter to continue</p>
      </div>
      <div className="w-full relative flex flex-row">
        <button
          type="button"
          className="w-[8rem] h-[2.5rem]  bg-[#D9923B] flex justify-center items-center rounded-[20px] text-sm "
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="w-[8rem] h-[2.5rem] absolute right-0 flex justify-center items-center border border-gray-500 border-solid rounded-[20px] text-sm "
          onClick={handleSave}
        >
          Discrad
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
