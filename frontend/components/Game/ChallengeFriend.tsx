import { useRouter } from "next/navigation";
import { useAuth } from "../../app/context/AuthContext";
import Modal from "../Modal";
import { useState } from "react";

const ChallengeFriend = () => {
  const {
    state: {
      friends: { friends },
      user,
    },
    GameRequest,
  } = useAuth();
  const router = useRouter();
  const [text, setText] = useState(Array(friends.length).fill("Challenge"));

  const handleChallengeClick = (index: number, friend: string) => {
    const newTexts = [...text];
    newTexts[index] = `waiting for ${friend} to accept challenge`;
    setText(newTexts);
    GameRequest(friends[index].id);
  };

  return (
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
            {friends.map((friend, index) =>
              friends[index].status === "ONLINE" ? (
                <ul key={index} className="flex justify-between items-center ">
                  <figure className="flex items-center text-center gap-5 p-2">
                    <img
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
                    onClick={() => handleChallengeClick(index, friend.username)}
                    className="border-solid border-2 border-textSecondary rounded-3xl pr-5 pl-5 pt-2 pb-2 text-text text-center"
                  >
                    {text[index]}
                  </button>
                </ul>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFriend;
