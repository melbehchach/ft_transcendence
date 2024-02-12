import React, { useEffect, useState } from "react";
import AddFriend from "../AddFriend/AddFriend";
import CancelRequest from "../CancelReq/CancelRequest";
import BlockUser from "../BlockUser/BlockUser";
import AcceptFriend from "../AcceptFriend/AcceptFriend";
import { useAuth } from "../../../../../../../app/context/AuthContext";

function FriendshipState() {
  const {
    fetchData,
    state: { user, profile },
  } = useAuth();

  let isSenderReq = false;
  let isReceivedReq = false;

  function friendshipChecker() {
    user.sentRequests.forEach((item) => {
      if (item.receiverId === profile.id) {
        isSenderReq = true;
      }
    });
    if (isSenderReq) return;
    user.receivedRequests.forEach((item) => {
      if (item.senderId === profile.id) {
        isReceivedReq = true;
      }
    });
  }

  const [added, setAdded] = useState(true);
  const [canceled, steCanceled] = useState(false);

  function addFriend() {
    setAdded(false);
    steCanceled(true);
  }

  function cancelFriend() {
    setAdded(true);
    steCanceled(false);
  }

  useEffect(() => {
    fetchData(user.id);
  }, []);

  friendshipChecker();

  return (
    <div className="w-full flex flex-row gap-1">
      {!isSenderReq && !isReceivedReq && added && !canceled && (
        <AddFriend addFriend={addFriend} />
      )}
      {(isSenderReq || (!added && canceled)) && (
        <CancelRequest cancelFriend={cancelFriend} />
      )}
      {isReceivedReq && <AcceptFriend />}
      <BlockUser isFriend={true} />
    </div>
  );
}

export default FriendshipState;
