import { style } from "./Achievements.styles";
import Avatar from "./Avatar";
import Achievements from "./Achievements";
import Scores from "./Scores";
import data from "./Scores/RecordsData";
import achievementsData from "./Achievements/AchievementsData";
import SettingButton from "./SettingButton";

const ProfileCard = () => {
  return (
    <div className={style.wrapper}>
      <SettingButton />
      <Avatar
        src="https://images.unsplash.com/photo-1621478374422-35206faeddfb?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        userName="mel-behc"
      />
      <Scores myScoresArray={data} />
      <Achievements achievementsArray={achievementsData} />
    </div>
  );
};

export default ProfileCard;
