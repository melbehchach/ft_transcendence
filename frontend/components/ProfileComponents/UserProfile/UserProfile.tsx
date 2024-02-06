import { useEffect, useReducer, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProfileCard from "./ProfileCard/ProfileCard";
import FriendsRequest from "./FriendsRequest/FriendsRequest";
import db from "../../../Dummydata/db.json";
import Friends from "./Friends/Friends";
import { useAuth } from "../../../app/context/AuthContext";

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

function UserProfile() {
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
    state: { user },
  } = useAuth();

  useEffect(() => {
    console.log({user})
    // if (user) {
    //   console.log({ ...user.sentRequests });
    // }
  }, [user]);

  return (
    <div className="w-screen h-screen flex gap-[1.5rem] p-[1rem]">
      <ProfileCard />
      <div className="w-screen h-full">
        <div className="w-full h-[14rem] flex flex-col gap-[1rem]">
          <h1 className="w-screen h-fit border-b border-gray-500 text-white font-semibold text-3xl">
            Recent Games
          </h1>
          <div className="w-full">
            <Swiper spaceBetween={10} slidesPerView={3}>
              {/* {db.map((item, index) => (
                <SwiperSlide className="!w-fit" key={index}>
                  <RecentGames />
                </SwiperSlide>
              ))} */}
            </Swiper>
          </div>
        </div>
        <div className="w-full h-[25rem] flex flex-col gap-[1rem]">
          <div
            className={
              "w-screen h-fit flex gap-[2rem] text-white font-semibold text-3xl border-b border-gray-500"
            }
          >
            <button onClick={handleFriendsClick}>Friends</button>
            <button onClick={handleFriendsrR}>Friends Requets</button>
          </div>
          {/* <div className="w-full h-full"> */}
          {state.friends && (
            <div className="h-full gap-[1rem]">
              {/* <Swiper spaceBetween={10} slidesPerView={3}>
                {db.map((item, index) => (
                  <SwiperSlide className="!w-fit" key={index}>
                    <Friends />
                  </SwiperSlide>
                ))}
              </Swiper> */}
            </div>
          )}
          {state.friendsRq && (
            <div className="h-full">
              <Swiper spaceBetween={10} slidesPerView={4}>
                {user.receivedRequests.map((item, index) => {
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
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
