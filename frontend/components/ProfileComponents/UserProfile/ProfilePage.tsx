import React, { useEffect, useReducer, useState } from "react";
import { useAuth } from "../../../app/context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import ProfileCard from "./Card/ProfileCard";
import FriendsRequest from "./FriendsRequest/FriendsRequest";
import UserFriends from "./Friends/UserFriends";
import UserRecentGames from "./RecentGames/UserRecentGames";
import ProfileRecentGames from "./RecentGames/ProfileRecentGames";

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
  const {
    fetchData,
    state: { friendRequests, friends, recentGames },
  } = useAuth();

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
  const [setting, setSetting] = useState<boolean>(false);

  return (
    <div className="w-screen h-full flex gap-[1.5rem] p-[1rem] pt-[1.5rem]">
      <ProfileCard setting={setting} setSetting={setSetting} />
      <div className="w-screen h-full">
        <div className="w-full h-[14rem] flex flex-col gap-[1rem]">
          <h1 className="w-screen h-fit border-b border-gray-500 text-white font-semibold text-3xl">
            Recent Games
          </h1>
          <div className="w-full">
            <Swiper spaceBetween={10} slidesPerView={3}>
              {recentGames?.map((item, index) => (
                <SwiperSlide className="!w-fit" key={index}>
                  <ProfileRecentGames player={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="w-full h-[25rem] flex flex-col gap-[1rem]">
          <div className=" flex gap-[2rem] text-white font-semibold text-3xl border-gray-500 border-b">
            <button
              className={state.friends ? "w-fit border-black border-b-8" : ""}
              onClick={handleFriendsClick}
            >
              Friends
            </button>
            <button className={state.friendsRq ? "w-fit border-black border-b-8" : ""} onClick={handleFriendsrR}>Friends Requests</button>
          </div>
          {state.friends && (
            <div className="h-full gap-[1rem] z-0">
              <Swiper spaceBetween={10} slidesPerView={3}>
                {friends?.friends.map((item, index) => (
                  <SwiperSlide className="!w-fit" key={index}>
                    <UserFriends item={item} />
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
