import React, { useEffect, useMemo, useState } from "react";
import AddFriend from "../AddFriend/AddFriend";
import CancelRequest from "../CancelReq/CancelRequest";
import BlockUser from "../BlockUser/BlockUser";
import AcceptFriend from "../AcceptFriend/AcceptFriend";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import ChallengeFriend from "../Challenge/ChallengeFriend";
import MessageFriend from "../Message/MessageFriend";
import UnfriendUser from "../UnfriendUser/UnfriendUser";

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

  return (
    <div className="w-full">
      {buttonType === "add" && (
        <div className="flex justify-center flex-row gap-3">
          <AddFriend /> <BlockUser isFriend={true} />
        </div>
      )}
      {buttonType === "cancel" && (
        <div className="flex justify-center flex-row gap-3">
          <CancelRequest /> <BlockUser isFriend={true} />
        </div>
      )}
      {buttonType === "accept" && (
        <div className="flex justify-center flex-row gap-3">
          <AcceptFriend isCard={true} profileId={""} />{" "}
          <BlockUser isFriend={true} />
        </div>
      )}
      {buttonType === "challenge" && (
        <div className="flex justify-center flex-row gap-2">
          <ChallengeFriend isFriendCard={false} />
          <MessageFriend isFriendCard={false} />
          <UnfriendUser />
        </div>
      )}
    </div>
  );
}

export default FriendshipState;
