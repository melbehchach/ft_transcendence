import Image from "next/image";
import SettingsButton from "./settingsButton.svg";

const SettingButton = () => {
  return (
    <div className="w-[24] h-[24] self-end pr-1 ">
      <button type="button">
        <Image src={SettingsButton} alt="setting icon" className="w-[20] h-[20]"/>
      </button>
    </div>
  );
};

export default SettingButton;
