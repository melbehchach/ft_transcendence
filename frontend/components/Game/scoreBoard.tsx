import Avatar from "@mui/material/Avatar";
import { User } from "../../types";
import axios from 'axios';

async function ScoreBoard() {
    const uploadAvatar = () => {
        axios.get('https://api.intra.42.fr/oauth/authorize').
        then((response) => {
            console.log(response);
        })
    };
  return (
    <>
      <div className="flex justify-around items-center border-2 m-5 p-5">
        <div className="flex items-center justify-center gap-1">
          <Avatar alt="player2" src="/static/images/avatar/1.jpg" />
          <span className="mx-2 text-text">Score</span>
        </div>
        <button><span className="mx-2">Start</span></button>
        <div className="flex items-center justify-center gap-1">
          <span className="mx-2 text-text">Score</span>
          <Avatar alt="player1" src="/static/images/avatar/1.jpg" />
        </div>
      </div>
    </>
  );
}

export default ScoreBoard;
