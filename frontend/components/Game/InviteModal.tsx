import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const InviteModal = ({ loading }: any) => {
    const [friends, setFriends] = useState([]);
    const [text, setText] = useState(["Challenge"]);
    const router = useRouter();
    const initailText: string = "Challenge";
    const [senderId, setSenderId] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [senderUsername, setSenderUsername] = useState("");
    const [receiverUsername, setReceiverUsername] = useState("");
    const [friendAvatar, setFriendAvatar] = useState("");

    const handleSendInvite = (friendId) => {
        axios.post(`http://localhost:3000/game/${friendId}/send-game-request`, {
            id: senderId,
        },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        )
        .catch((error) => {
            console.log(error);
        });
    };
    
    const ChangeTextandSendRequest = (friend) => {
        setReceiverId(friend.id)
        setReceiverUsername(friend.username);
        handleSendInvite(friend.id);
        changeText(`Waiting for ${friend.username} to accept the challenge`);
    };


    useEffect(() => {
        if (text != initailText)
            setTimeout(() => {
                setText(initailText);
            }, 60000); /// the opponent has 1 minute to accept the challenge
    }, [text]);


    const changeText = (text: string) => setText(text);
    // if (!loading) return;
 useEffect(() => {
    if (!loading) return;
    const fetchData = () => {
        axios.get(`http://localhost:3000/user/${Cookies.get("USER_ID")}/profile`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
            .then((res) => {
                setSenderId(res.data.id); // the sender Id
                setSenderUsername(res.data.username); // the sender username
                setFriends(res.data.friends); // the friends of the current user
                    
            })
            .catch((error) => {
                console.log(error);
            });
    };
    fetchData();
}, [loading]);

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
                {friends.map((friend: any, index: any) => (
                    (
                      <ul
                        key={index}
                        className="flex justify-between items-center "
                      >
                        <figure className="flex items-center text-center gap-5">
                          <Image
                            className="rounded-full"
                            src={friend.avatar}
                            width={55}
                            height={55}
                            alt="Friend's picture"
                          />
                          <figcaption className="text-text ">
                            {friend.username}
                          </figcaption>
                        </figure>
                        <button
                          onClick={() => ChangeTextandSendRequest(friend)}
                          className="border-solid border-2 border-textSecondary rounded-3xl pr-5 pl-5 pt-2 pb-2 text-text text-center">
                          {text}
                        </button>
                      </ul>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default InviteModal;