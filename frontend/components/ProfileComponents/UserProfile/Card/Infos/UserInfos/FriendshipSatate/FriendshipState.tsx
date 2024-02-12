import React, { useEffect, useMemo, useState } from "react";
import AddFriend from "../AddFriend/AddFriend";
import CancelRequest from "../CancelReq/CancelRequest";
import BlockUser from "../BlockUser/BlockUser";
import AcceptFriend from "../AcceptFriend/AcceptFriend";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import ChallengeFriend from "../Challenge/ChallengeFriend";

// case 1: send friend request => add friend
// case 2: cancel the request => cancel request
// case 3: Accept received request => accept request

function FriendshipState() {
  const {
    fetchFriendsReqData,
    fetchFriendsData,
    state: { friendRequests, friends, profile },
  } = useAuth();

  const buttonType = useMemo(() => {
    console.log({ friendRequests });
    if (
      friendRequests?.sentRequests.find(
        (elem) => elem.receiverId === profile.id && elem.status === "PENDING"
      )
    ) {
      return "cancel";
    } else if (
      friendRequests?.receivedRequests.find(
        (elem) => elem.senderId === profile.id && elem.status === "PENDING"
      )
    ) {
      return "accept";
    } else if (friends?.friends.find((elem) => elem.id === profile.id)) {
      return "challenge";
    } else {
      return "add";
    }
  }, [friendRequests, friends]);

  useEffect(() => {
    fetchFriendsReqData();
    fetchFriendsData();
  }, []);

  useEffect(() => {
    console.log(friends);
  }, [friends]);

  return (
    <div className="w-full flex flex-row gap-1">
      {buttonType === "add" && <AddFriend />}
      {buttonType === "cancel" && <CancelRequest />}
      {buttonType === "accept" && <AcceptFriend />}
      {buttonType === "challenge" && <ChallengeFriend />}
    </div>
  );
}

export default FriendshipState;
