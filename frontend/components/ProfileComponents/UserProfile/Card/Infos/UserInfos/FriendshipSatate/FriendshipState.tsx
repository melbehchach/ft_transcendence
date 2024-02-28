import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";
import AcceptFriend from "../AcceptFriend/AcceptFriend";
import AddFriend from "../AddFriend/AddFriend";
import BlockUser from "../BlockUser/BlockUser";
import CancelRequest from "../CancelReq/CancelRequest";
import ChallengeFriend from "../Challenge/ChallengeFriend";
import MessageFriend from "../Message/MessageFriend";
import UnblockUser from "../UnblockUser/UnblockUser";
import BlockedBy from "../Blockedby/BlockedBy";
import { useParams } from "next/navigation";

type props = {
  setBlocker: any;
  setBlocked: any;
  id?: any;
};

function FriendshipState({ setBlocker, setBlocked, id }: props) {
  const param = useParams();
  const {
    fetchFriendsReqData,
    fetchFriendsData,
    fetchData,
    state: { friendRequests, friends, user, profile },
  } = useAuth();

  const buttonType = useMemo(() => {
    if (
      friendRequests?.sentRequests.find(
        (elem) => elem.receiverId === id && elem.status === "PENDING"
      )
    ) {
      return "cancel";
    } else if (
      friendRequests?.receivedRequests.find(
        (elem) => elem.senderId === id && elem.status === "PENDING"
      )
    ) {
      return "accept";
    } else if (friends?.friends.find((elem) => elem.id === id)) {
      return "challenge";
    } else if (user.blockedByUsers.find((elem) => elem.id === id)) {
      return "bolcked";
    } else if (user.blockedUsers.find((elem) => elem.id === id)) {
      return "unblock";
    } else {
      return "add";
    }
  }, [friendRequests, friends,  user]);

  useEffect(() => {
    fetchFriendsData();
    fetchFriendsReqData();
  }, []);

  return (
    <div className="w-full">
      {buttonType === "add"  && (
        <div className="flex justify-center flex-row gap-3">
          <AddFriend
            card={false}
            setBlocked={setBlocked}
            setBlocker={setBlocker}
          />{" "}
          <BlockUser isFriend={false} setBlocker={setBlocker} />
        </div>
      )}
      {buttonType === "cancel"  && (
        <div className="flex justify-center flex-row gap-3">
          <CancelRequest card={false} />
        </div>
      )}
      {buttonType === "accept"  && (
        <div className="flex justify-center flex-row gap-3">
          <AcceptFriend isCard={true} profileId="" />
        </div>
      )}
      {buttonType === "challenge"  && (
        <div className="flex justify-center flex-row gap-2">
          <ChallengeFriend
            isFriendCard={false}
            id={id}
          />
          <MessageFriend isFriendCard={false} />
          <BlockUser
            isFriend={true}
            setBlocker={setBlocker}
            id={id}
          />
        </div>
      )}
      {buttonType === "unblock"  && (
        <div className="flex justify-center flex-row gap-3">
          <UnblockUser setBlocker={setBlocker} />
        </div>
      )}
      {buttonType === "bolcked"  && (
        <div className="flex justify-center flex-row gap-3">
          <BlockedBy setBlocked={setBlocked} />
        </div>
      )}
    </div>
  );
}

export default FriendshipState;
