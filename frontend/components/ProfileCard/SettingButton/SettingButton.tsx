import Image from "next/image";
import SettingsButton from "./settingsButton.svg";

const SettingButton = () => {
  return (
    <button type="button">
      <Image
        src={SettingsButton}
        alt="setting icon"
        className="w-[2rem] h-[2rem]"
      />
    </button>
  );
};

export default SettingButton;
