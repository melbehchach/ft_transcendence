import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../app/context/AuthContext";
import { useParams } from "next/navigation";

const Scores = () => {
  const { state: { user, loading } } = useAuth();
  const jwt_token = Cookies.get("JWT_TOKEN");
  const { id } = useParams();
  const [loses, setLoses] = useState(0);
  const [wins, setWins] = useState(0);
  const [achievements, setAchievements] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false); 

  async function totalLoses(userId) {
    try {
      if (jwt_token) {
        const url = `http://localhost:3000/game/getLoses/${userId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        return response.data;
      } else {
        throw new Error("bad req");
      }
    } catch (error) {
      console.error("Error fetching total loses:", error);
      return 0;
    }
  }

  async function totalWins(userId) {
    try {
      if (jwt_token) {
        const url = `http://localhost:3000/game/getWins/${userId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        return response.data;
      } else {
        throw new Error("bad req");
      }
    } catch (error) {
      console.error("Error fetching total wins:", error);
      return 0;
    }
  }

  async function totalAchievements(userId) {
    try {
      if (jwt_token) {
        const url = `http://localhost:3000/game/TotalAchievement/${userId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        return response.data;
      } else {
        throw new Error("bad req");
      }
    } catch (error) {
      console.error("Error fetching total achievements:", error);
      return 0;
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = id || user.id;
        const totalLosesCount = await totalLoses(userId);
        const totalWinsCount = await totalWins(userId);
        const totalAchievementsCount = await totalAchievements(userId);

        setLoses(totalLosesCount);
        setWins(totalWinsCount);
        setAchievements(totalAchievementsCount);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    }

    fetchData();
  }, [id, user.id]);

  if (loading || !dataLoaded) {
    return <p>Loading...</p>;
  }
  
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