import { memo } from "react";
import Avatar from "../../../../components/Avatar";
import Typography from "../../../../components/Typography";
import { useAuth } from "../../../context/AuthContext";

const Message = ({ message }) => {
  //   const {
  const {
    state: {
      user,
      friends: { friends },
    },
  } = useAuth();
  const { getUserInfo } = useAuth();
  //   const sender = useMemo(() => {
  //     return getUserInfo(message.senderId);
  //   }, [message]);
  const sender = getUserInfo(message.senderId);
  //     state: { allChats },
  //   } = useChat();
  //   const {
  //     state: {
  //       friends: { friends },
  //     },
  //   } = useAuth();
  //   console.log(allChats);
  //   console.log(getMessageSender());
  //   console.log(message.senderId);
  //   console.log(getUserInfo(message.senderId));
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
            content={message.createdAt}
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
