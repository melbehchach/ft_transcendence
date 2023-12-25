import Image from "next/image";
import { AchievementsProps, achievementsObj } from "./Achievements.types";
import Freshman from "./svgs/Freshman.svg";

const Achievements = ({ achievementsArray }: AchievementsProps) => {
  const array: achievementsObj[] = achievementsArray.filter((achievements) => achievements.state);

  return (
    <div className="w-[325px] h-[436px] border border-[#000000] rounded-[15px] flex flex-col gap-3">
      <h3 className="font-inter font-bold text-lg ml-3 mt-3">Achievements</h3>
      <ul className="flex flex-col justify-center ml-4 gap-1">
        {array.map((array) => (
          <li className="flex gap-5" key={array.id}>
            <Image
              src={array.icon}
              alt={array.type}
              width="25"
              height="25"
            />
            <div className="flex flex-col">
              <h2>{array.type}</h2>
              <p>{array.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Achievements;
