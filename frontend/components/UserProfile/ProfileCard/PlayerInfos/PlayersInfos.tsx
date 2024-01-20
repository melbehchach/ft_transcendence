import Achievements from "./Achievements/Achievements";
import Scores from "./Scores/Scores";
import Avatar from "../../../Avatar/Avatar";
import data from "./Scores/RecordsData";
import achievementsData from "./Achievements/AchievementsData";

function PlayersInfos() {
  return (
    <div className="flex flex-col justify-center items-center gap-[1rem] mt-[2rem]">
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
      <div className="w-11/12 h-[23.5rem] flex justify-start rounded-[5px] overflow-auto border border-black border-solid border-1">
        <Achievements achievementsArray={achievementsData} />
      </div>
    </div>
  );
}

export default PlayersInfos;
