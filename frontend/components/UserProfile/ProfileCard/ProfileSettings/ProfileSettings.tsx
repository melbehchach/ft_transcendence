import Avatar from "../../../Avatar/Avatar";
import AddAvatarButton from "./AddAvatarButton";
import DarkTheme from "./DarkTheme";
import LightTheme from "./LightTheme";
import GrayTheme from "./GrayTheme";

function ProfileSettings({ setInfos, setSetting }) {
  function handleSave() {
    setInfos(true);
    setSetting(false);
  }

  return (
    <div className="flex flex-col gap-[1rem] ml-[2rem]">
      <div className="font-semibold text-3xl mt-[1rem]">
        <h1>Settings</h1>
      </div>
      {/* Modify Avatar component */}
      <div className="flex flex-col text-xl font-light  ">
        <div className="flex jusitfy-start mt-[0.5rem]">
          <Avatar
            src="https://images.unsplash.com/photo-1559624989-7b9303bd9792?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            width={100}
            height={100}
            userName=""
            imageStyle="w-[8rem] h-[8rem] rounded-full object-cover"
            fontSize="text-2xl"
          />
          <button type="button" className="w-29 h-29 mt-[4.5rem] ml-[-1.5rem] ">
            <AddAvatarButton />
          </button>
        </div>
        {/* Modify username component */}
        <div className="flex flex-col justify-strat mt-[1rem] ">
          <form className="flex flex-col gap-[0.5rem] ">
            <label className="text-xl font-light">Username: </label>
            <input
              type="text"
              className="w-11/12 h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-sm font-light outline-none"
              placeholder="new username"
            />
          </form>
        </div>
        <div className="flex flex-col justify-strat mt-[1rem] ">
          <form className="flex flex-col gap-[0.5rem] ">
            <label className="text-xl font-light">Pssword: </label>
            <input
              type="text"
              className="w-11/12 h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-sm font-light outline-none"
              placeholder="current password"
            />
            <input
              type="text"
              className="w-11/12 h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-sm font-light outline-none"
              placeholder="new password"
            />
          </form>
        </div>
        {/* Choose game theme component */}
        <div className="flex flex-col justify-center gap-[0.5rem] mt-[1rem] text-xl font-light">
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
        <div className="flex flex-col gap-[0.5rem] w-11/12 mt-[1rem]">
          <h1 className="text-base">Two-Factor authentication</h1>
          <p className="text-xs text-gray-500">
            Scan this with Google Authenticator app and enter the code below in
            order to activate 2FA
          </p>
          <div className="w-[7rem] h-[7rem] border border-black border-2">
            <p>QR code</p>
          </div>
          <form className="flex flex-col gap-[0.5rem] ">
            <input
              type="number"
              className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-base font-light outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="6-digit code"
            />
          </form>
        </div>
        {/* Save and Discard */}
        <div className="w-full flex flex-row gap-[1rem] mt-[2rem] ml-[-1rem] ">
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
