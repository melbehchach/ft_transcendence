import React, { useReducer } from "react";
import { useAuth } from "../../../app/context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import ProfileCard from "./Card/ProfileCard";
import RecentGames from "./RecentGames/RecentGames";
import Friends from "./Friends/Friends";
import FriendsRequest from "./FriendsRequest/FriendsRequest";
import { stat } from "fs";

function reducer(state, action) {
  switch (action.type) {
    case "oldFriends":
      return {
        ...state,
        friends: (state.friends = true),
        friendsRq: (state.friendsRq = false),
      };
    case "newFriendsRq":
      return {
        ...state,
        friends: (state.friends = false),
        friendsRq: (state.friendsRq = true),
      };
    default:
      throw new Error();
  }
}

function ProfilePage() {
  const [state, dispatch] = useReducer(reducer, {
    friends: true,
    friendsRq: false,
  });

  function handleFriendsClick() {
    dispatch({ type: "oldFriends" });
  }
  function handleFriendsrR() {
    dispatch({ type: "newFriendsRq" });
  }

  const {
    state: { user, friendRequests, friends },
  } = useAuth();

  return (
    <div className="w-screen h-fit flex gap-[1.5rem] p-[1rem] pt-[1.5rem]">
      <ProfileCard />
      <div className="w-screen h-full">
        <div className="w-full h-[14rem] flex flex-col gap-[1rem]">
          <h1 className="w-screen h-fit border-b border-gray-500 text-white font-semibold text-3xl">
            Recent Games
          </h1>
          <div className="w-full">
            {/* <Swiper spaceBetween={10} slidesPerView={3}>
              {db.map((item, index) => (
                <SwiperSlide className="!w-fit" key={index}>
                  <RecentGames />
                </SwiperSlide>
              ))}
            </Swiper> */}
          </div>
        </div>
        <div className="w-full h-[25rem] flex flex-col gap-[1rem]">
          <div className=" flex gap-[2rem] text-white font-semibold text-3xl border-gray-500 border-b">
            <button onClick={handleFriendsClick}>Friends</button>
            <button onClick={handleFriendsrR}>Friends Requets</button>
          </div>
          {state.friends && (
            <div className="h-full gap-[1rem] z-0">
              <Swiper spaceBetween={10} slidesPerView={3}>
                {friends?.friends.map((item, index) => (
                  <SwiperSlide className="!w-fit" key={index}>
                    <Friends item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          {state.friendsRq && (
            <div className="h-full">
              <Swiper spaceBetween={10} slidesPerView={4}>
                {friendRequests.receivedRequests.map((item, index) => {
                  if (item.status === "PENDING")
                    return (
                      <SwiperSlide className="!w-fit" key={index}>
                        <FriendsRequest item={item} />
                      </SwiperSlide>
                    );
                })}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
