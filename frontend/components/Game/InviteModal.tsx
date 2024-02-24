import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../../app/context/AuthContext";

const InviteModal = ({ loading }: any) => {
  const [text, setText] = useState(["Challenge"]);
  const router = useRouter();
  const initailText: string = "Challenge";
  const [receiverId, setReceiverId] = useState("");
  const [senderUsername, setSenderUsername] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const { state } = useAuth();
  console.log(state.profile.id);
  const handleSendInvite = (friendId) => {
    axios
      .post(
        `http://localhost:3000/game/${friendId}/send-game-request`,
        {
          id: state.profile.id.toString(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("Request sent successfully");
        } else {
          console.log("Request failed");
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const ChangeTextandSendRequest = () => {
    setReceiverId(state.profile.friends[0].id);
    setReceiverUsername(state.profile.friends[0].username);
    handleSendInvite(state.profile.friends[0].id);
    changeText(
      `Waiting for ${state.profile.friends.username} to accept the challenge ...`
    );
  };

  useEffect(() => {
    if (text != initailText)
      setTimeout(() => {
        router.push("/game/decline");
      }, 10000); /// the opponent has 10s to accept the challenge
  }, [text]);

  const changeText = (text: string) => setText(text);
  return (
    <>
      <div className="h-screen fixed inset-0 backdrop-blur-sm bg-black/60 flex justify-center items-center z-30">
        <div className="max-h-1/2 w-1/2 rounded-lg bg-background z-60 ">
          <svg
            onClick={() => router.push("/game")}
            className="cursor-pointer float-right mr-4 mt-4"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L21 21M3 21L21 3"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex-col justify-center items-center text-center mt-10">
            <h1 className="text-text font-bold text-2xl not-italic font-sans mb-5 mt-2">
              Who do you want to challenge ?
            </h1>
            <div className="flex-col  items-center text-center border-solid border-2 rounded-xl border-textSecondary m-10 p-5">
              {state.profile.friends.map((friend: any, index: any) => (
                <ul key={index} className="flex justify-between items-center ">
                  <figure className="flex items-center text-center gap-5">
                    <Image
                      className="rounded-full"
                      src={state.profile.friends[0].avatar}
                      width={55}
                      height={55}
                      alt="Friend's picture"
                    />
                    <figcaption className="text-text ">
                      {state.profile.friends[0].username}
                    </figcaption>
                  </figure>
                  <button
                    onClick={() => ChangeTextandSendRequest()}
                    className="border-solid border-2 border-textSecondary rounded-3xl pr-5 pl-5 pt-2 pb-2 text-text text-center"
                  >
                    {text}
                  </button>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteModal;
