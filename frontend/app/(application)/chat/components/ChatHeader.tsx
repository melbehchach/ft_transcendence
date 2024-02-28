import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useRef, useState } from "react";
import Modal from "../../../../components/Modal";
import Typography from "../../../../components/Typography";
import UserAvatar from "../../../../components/UserAvatar";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import Button from "./Button";
import { newChannelActionTypes, newChannelReducer } from "./CreateNewChat";
import NewChannel from "./NewChannel";

const ChatHeader = ({ headerInfo, chat }) => {
  const { avatar, name } = headerInfo;
  const modalRef = useRef();
  const {
    state: { user },
  } = useAuth();
  const [state, dispatch] = useReducer(
    newChannelReducer,
    chat?.name
      ? {
          avatar: chat.image,
          channelName: chat.name,
          type: chat.type === "PUBLIC" ? 0 : chat.type === "PROTECTED" ? 1 : 2,
          members: chat.Members.filter((elem) => elem.id !== user.id).map(
            (elem) => elem.id
          ),
          password: chat?.password,
        }
      : null
  );
  const {
    updateChannelAvatar,
    updateChannelName,
    updateChannelType,
    kick,
    addMembers,
    getAllChats,
    state: { allChats },
    getChannelByID,
  } = useChat();
  const [channel, setChannel] = useState(null);
  async function fetchChannelData() {
    getChannelByID(chat.id).then((res) => {
      setChannel(res);
    });
  }
  useEffect(() => {
    if (chat?.name) fetchChannelData();
  }, [chat, allChats]);

  useEffect(() => {
    if (chat?.name) {
      let c = allChats.find((cha) => chat.id === cha.id);
      if (channel && c) {
        dispatch({
          type: newChannelActionTypes.UPDATE_STATE,
          payload: {
            avatar: channel.image,
            channelName: channel.name,
            type:
              channel.type === "PUBLIC"
                ? 0
                : channel.type === "PROTECTED"
                ? 1
                : 2,
            members: channel.Members.filter((elem) => elem.id !== user.id).map(
              (elem) => elem.id
            ),
            password: c?.password,
          },
        });
      }
    }
  }, [channel]);
  const NewChannelActions =
    !chat?.name || !state ? (
      <></>
    ) : (
      <>
        {/* <Button content="Cancel" onClick={() => setStep(0)} /> */}

        <Button
          type="primary"
          content="Update"
          disabled={
            state.channelName < 3 || (state.password < 6 && state.type === 1)
          }
          onClick={async () => {
            try {
              let mem = allChats.find((c) => c.id === chat.id);
              let newMembers = state.members?.filter(
                (elem) => !mem?.Members?.find((l) => l.id === elem)
              );
              let kickedMembers = mem?.Members?.filter(
                (elem) =>
                  !state?.members?.find((l) => l === elem.id) &&
                  elem.id !== chat.owner.id
              );
              let arr = [];
              if (chat.name !== state.name)
                arr.push(updateChannelName(chat.id, state.channelName));
              // if (
              //   (chat.type === "PUBLIC" && state.type !== 0) ||
              //   (chat.type === "PROTECTED" && state.type !== 1) ||
              //   (chat.type === "PRIVATE" && state.type !== 2)
              // )
              arr.push(
                updateChannelType(
                  chat.id,
                  state.type === 0
                    ? "PUBLIC"
                    : state.type === 1
                    ? "PROTECTED"
                    : "PRIVATE",
                  state.password
                )
              );
              arr.push(updateChannelAvatar(chat.id, state.avatar));
              if (kickedMembers.length !== 0)
                arr.push(
                  kick(
                    chat.id,
                    kickedMembers.map((elem) => elem.id)
                  )
                );
              if (addMembers.length !== 0)
                arr.push(addMembers(chat.id, newMembers));
              Promise.all(arr).then(() => {
                getAllChats();
              });
              closeModal();
            } catch {}
          }}
        />
      </>
    );
  function openModel() {
    // @ts-ignore
    modalRef?.current?.showModal();
  }
  function closeModal() {
    // @ts-ignore
    modalRef?.current.close();
  }
  return (
    <div className="w-full border-b border-black py-4 fixed">
      <div className="flex items-center w-[300px]">
        {channel?.name ? (
          <UserAvatar src={channel?.image} name={channel?.name} />
        ) : (
          <UserAvatar src={avatar} name={name} />
        )}
        {chat?.name && user.id === chat.owner.id && (
          <div>
            <div className="dropdown bg-transparent">
              <div tabIndex={0} role="button" className="">
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className="w-6 h-6 text-white rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-gray-600 rounded-box pos w-fit"
              >
                <li className="w-[200px]" onClick={openModel}>
                  <Typography
                    content="edit channel"
                    type="paragraphe"
                    variant="body2"
                  />
                </li>
              </ul>
            </div>
            <Modal
              forwardedRef={modalRef}
              bordered={true}
              title="Talk to someone or start a new channel"
              actions={NewChannelActions}
            >
              <NewChannel dispatch={dispatch} state={state} channel={channel} />
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
