"use client";
import { memo, useMemo } from "react";
import Avatar from "../../../../components/Avatar";
import Typography from "../../../../components/Typography";
import { useChat } from "../../../context/ChatContext";

function getTimeDifferenceFromNow(apiTime) {
  const apiDate = new Date(apiTime);

  const currentDate = new Date();

  const timeDifference = currentDate - apiDate;

  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  if (daysDifference > 0) {
    return `${daysDifference} days ago`;
  } else if (hoursDifference > 0) {
    return `${hoursDifference} hours ago`;
  } else if (minutesDifference > 0) {
    return `${minutesDifference} minutes ago`;
  } else {
    return "Just now";
  }
}
const Message = ({ message }) => {
  const {
    state: { members },
  } = useChat();

  const sender = useMemo(() => {
    return members.find((member) => member.id === message.senderId);
  }, [members]);

  if (!sender) return;
  return (
    <div className="flex gap-4 items-start">
      <Avatar src={sender?.avatar} />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <Typography
            content={sender?.username}
            type="paragraphe"
            variant="body"
          />
          <Typography
            content={getTimeDifferenceFromNow(message.createdAt)}
            type="paragraphe"
            variant="body2"
            colorVariant="secondary"
          />
        </div>
        <Typography content={message.body} type="paragraphe" variant="body2" />
      </div>
    </div>
  );
};

export default memo(Message);
