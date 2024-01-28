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
    userName: data.username,
    imageStyle: "w-[8rem] h-[8rem] rounded-full object-cover",
    fontSize: "text-2xl",
    positiosn: true,
  };

  function handleSave() {
    openSettings();
  }

  return (
    <div className="h-fit flex flex-col">
      <div className="font-semibold text-3xl m-[1rem]">
        <h1>Settings</h1>
      </div>
      {/* Modify Avatar component */}
      <div className="flex flex-col text-xl font-light ml-[1rem] gap-[1rem] ">
        <div className="flex jusitfy-start ">
          <Avatar {...avatarObj} />
          <button type="button" className="w-29 h-29 mt-[4.5rem] ml-[-1.5rem] ">
            <AddAvatarButton />
          </button>
        </div>
        {/* Modify username component */}
        <div className="flex flex-col justify-strat  ">
          <form className="flex flex-col gap-[0.5rem] ">
            <label className="text-xl font-light">Username: </label>
            <input
              type="text"
              className="w-11/12 h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-sm font-light outline-none"
              placeholder="new username"
            />
          </form>
        </div>
        <div className="flex flex-col justify-strat  ">
          <form className="flex flex-col gap-[0.5rem] ">
            <label className="text-xl font-light">Pssword: </label>
            <input
              type="password"
              className="w-11/12 h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-sm font-light outline-none"
              placeholder="current password"
            />
            <input
              type="password"
              className="w-11/12 h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-sm font-light outline-none"
              placeholder="new password"
            />
          </form>
        </div>
        {/* Choose game theme component */}
        <div className="flex flex-col justify-center gap-[0.5rem]  text-xl font-light">
          <h1>Game theme: </h1>
          <div className="flex gap-[0.5rem]">
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
        {/* 2F auth component */}
        <div className="flex flex-col gap-[0.5rem] w-11/12 ">
          <h1 className="text-base">Two-Factor authentication</h1>
          <p className="text-xs text-gray-500">
            Scan this with Google Authenticator app and enter the code below in
            order to activate 2FA
          </p>
          <div className="w-[6rem] h-[6rem] border border-black border-2">
            <p>QR code</p>
          </div>
          <form className="flex flex-col gap-[0.5rem] ">
            <input
              type="number"
              className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-base font-light outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="6-digit code"
            />
          </form>
          <p className="text-xs font-ligh">Press Enter to continue</p>
        </div>
        {/* Save and Discard */}
        <div className="w-full flex flex-row gap-[1rem] ml-[-1rem] ">
          <div className="w-[6rem] h-[2rem]">
            <button
              type="button"
              className="w-[6rem] h-[2rem] bg-[#D9923B] flex justify-center items-center rounded-[15px] text-sm ml-[1rem]"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          <div className="w-[6rem] h-[2rem]">
            <button
              type="button"
              className="w-[6rem] h-[2rem] flex justify-center items-center border border-gray-500 border-solid border-b-1 rounded-[15px] text-sm ml-[4rem]"
              onClick={handleSave}
            >
              Discrad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
