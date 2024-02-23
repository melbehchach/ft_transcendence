import { useEffect } from "react";
import { useAuth } from "../../../../app/context/AuthContext";
import Avatar from "../../Avatar/Avatar";
import { AvatarProps } from "../../types/Avatar.type";

type props = {
  player: any;
};

function RecentGames({ player }: props) {
  const {
    fetchData,
    state: { user, profile },
  } = useAuth();

  const avatarObj: AvatarProps = {
    src: user.avatar,
    width: 100,
    height: 100,
    userName: user.username,
    imageStyle: "w-[4rem] h-[4rem] rounded-full object-cover",
    fontSize: "text-sm",
    positiosn: true,
  };

  const avatarObj2: AvatarProps = {
    src: profile.avatar,
    width: 100,
    height: 100,
    userName: profile.username,
    imageStyle: "w-[4rem] h-[4rem] rounded-full object-cover",
    fontSize: "text-sm",
    positiosn: true,
  };

  const calculateTiem = () => {
    let playMatch: any = new Date(player.createdAt);
    let currentTime: any = new Date();
    let timeDifference = currentTime - playMatch;
    let secondsPassed = Math.floor(timeDifference / 1000);
    var minutesPassed = Math.floor(secondsPassed / 60);
    let hoursPassed = Math.floor(minutesPassed / 60);
    if (hoursPassed > 1) return hoursPassed + " hour ago";
    return minutesPassed + " minute ago";
  };

  useEffect(() => {
    if (user.id === player.opponentId) {
      fetchData(player.playerId);
    } else {
      fetchData(player.opponentId);
    }
  }, [user]);

  return (
    <div
      className={
        player.playerScore > player.opponentScore
          ? "w-[16rem] h-[9rem] rounded-[15px] flex items-center flex-col gap-[0.5rem] border border-green-500"
          : "w-[16rem] h-[9rem] rounded-[15px] flex items-center flex-col gap-[0.5rem] border border-red-500"
      }
    >
      <div className="flex justify-start items-center text-white mt-[0.5rem]">
        <h2>{calculateTiem()}</h2>
      </div>
      <div className="flex justify-center items-center w-full gap-[2rem]">
        <div className="flex justify-center items-center mb-[1.5rem] gap-[0.5rem] text-white">
          <Avatar avatarObj={avatarObj} />
          <p className="mt-[-1.2rem]">{player.playerScore}</p>
        </div>
        <div className="flex flex-row-reverse items-center mb-[1.5rem] gap-[0.5rem] text-white">
          <Avatar avatarObj={avatarObj2} />
          <p className="mt-[-1.2rem]">{player.opponentScore}</p>
        </div>
      </div>
    </div>
  );
}

export default RecentGames;
