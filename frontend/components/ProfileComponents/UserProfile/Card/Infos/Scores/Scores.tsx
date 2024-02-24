import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../app/context/AuthContext";
import { useParams } from "next/navigation";

const Scores = () => {
  const {
    state: { user },
  } = useAuth();

  const jwt_token = Cookies.get("JWT_TOKEN");
  const [loses, setLoses] = useState(0);
  const [wins, setWins] = useState(0);
  const [achievements, setAchievements] = useState(0);

  const param = useParams();

  async function totalLoses() {
    let id: string | string[];
    if (param.id) id = param.id;
    else id = user.id;
    try {
      if (jwt_token) {
        let url: string = "http://localhost:3000/game/getLoses/" + id;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        setLoses(response.data);
      } else throw new Error("bad req");
    } catch (error) {}
  }

  async function totalWins() {
    let id: string | string[];
    if (param.id) id = param.id;
    else id = user.id;
    try {
      if (jwt_token) {
        let url: string = "localhost:3000/game/getWins/" + id;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        setWins(response.data);
      } else throw new Error("bad req");
    } catch (error) {}
  }

  async function totlaAchievments() {
    let id: string | string[];
    if (param.id) id = param.id;
    else id = user.id;
    try {
      if (jwt_token) {
        let url: string = "localhost:3000/game/TotalAchievement/" + id;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        setAchievements(response.data);
      } else throw new Error("bad req");
    } catch (error) {}
  }

  useEffect(() => {
    totalLoses();
    totalWins();
    totlaAchievments();
  }, []);

  return (
    <div className="w-full h-[4rem] p-5 items-center flex justify-center rounded-[5px] gap-[0.5rem] border border-black border-solid">
      <div className="flex flex-col gap-[0.2rem]">
        <h6 className="flex justify-center text-bold font-bold text-lg">
          {loses + wins}
        </h6>
        <p className="text-gray-500 text-sm">Games</p>
      </div>
      <div className="flex flex-col gap-[0.2rem]">
        <h6 className="flex justify-center font-bold text-lg">
          {achievements}
        </h6>
        <p className="text-gray-500 text-sm">Achievements</p>
      </div>
      <div className="flex flex-col gap-[0.2rem]">
        <h6 className="flex justify-center font-bold text-lg">{loses}</h6>
        <p className="text-gray-500 text-sm">Loses</p>
      </div>
      <div className="flex flex-col gap-[0.2rem]">
        <h6 className="flex justify-center font-bold text-lg">{wins}</h6>
        <p className="text-gray-500 text-sm">Wins</p>
      </div>
    </div>
  );
};

export default Scores;
