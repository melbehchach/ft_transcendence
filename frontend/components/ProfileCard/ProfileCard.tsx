import Avatar from "../Avatar/Avatar";
import Achievements from "./Achievements/Achievements";
import Scores from "./Scores/Scores";
import data from "./Scores/RecordsData";
import achievementsData from "./Achievements/AchievementsData";
import SettingButton from "./SettingButton/SettingButton";

const ProfileCard = () => {
  return (
    <div className="w-[20rem] h-[53rem] text-white flex flex-col justify-center items-center gap-[1rem] mt-[2rem] ml-[2rem] border border-black border-solid border-1 rounded-[15px]">
      <div className="w-[3rem] h-[3rem] place-self-end pr-[0.5rem] ">
        <SettingButton />
      </div>
      <div className="w-full flex justify-center items-center">
        <Avatar
          src="https://images.unsplash.com/photo-1559624989-7b9303bd9792?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width={100}
          height={100}
          userName="mel-behc"
          imageStyle="w-[16rem] h-[16rem] rounded-full object-cover"
          fontSize="text-2xl"
        />
      </div>
      <div className="w-11/12 h-[4rem] rounded-[5px] border border-black border-solid border-1 flex justify-center ">
        <Scores myScoresArray={data} />
      </div>
      <div className="w-11/12 h-[23rem] flex justify-start rounded-[5px] overflow-auto border border-black border-solid border-1">
        <Achievements achievementsArray={achievementsData} />
      </div>
    </div>
  );
};

export default ProfileCard;
