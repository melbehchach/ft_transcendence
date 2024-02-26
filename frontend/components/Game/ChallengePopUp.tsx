import axios from "axios";
import GameModalComponent from "./Modal";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import PongAnimation from "../../public/img/PongAnimation.json";
import Cookies from "js-cookie";
import { useSocket } from "../../app/context/SocketContext";
import { useAuth } from "../../app/context/AuthContext";


export default function ChallengePopUp({ sender }: any) {
  const { setNotifications} = useSocket();

  const handleAccept = () => {
    try {
     const res =  axios.post(`http://localhost:3000/game/accept/${Cookies.get("USER_ID")}`, {
        id: sender.senderId,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (res) {
        setNotifications(false);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleRefuse = () => {
    try {
     const res = axios.post(`http://localhost:3000/game/refuse/${Cookies.get("USER_ID")}`, {
        id: sender.senderId,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (res) {
        setNotifications(false);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }
  const router = useRouter();
  const content = (
    <div className="h-3/4 flex justify-center content-center bg-black rounded-xl my-6">
      <Lottie className="mb-5 rounded-lg" animationData={PongAnimation} />
    </div>
  );

  // setTimeout(() => {
  //   if (sender.sender === Cookies.get("USER_NAME")) {
  //     router.push("/game/decline");
  //   }
  // }, 5000);
  return (
    <>
      <GameModalComponent
        title="Heads UP!"
        subtitle={sender.sender + " has challenged you to a game of pong now!"}
        content={content}
        cancelCallback={handleRefuse}
        btn1="Accept"
        btn1Callback={handleAccept}
        btn2="Decline"
        btn2Callback={handleRefuse}
      ></GameModalComponent>
      ;
    </>
  );
}