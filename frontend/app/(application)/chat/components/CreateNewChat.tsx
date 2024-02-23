"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useReducer, useRef, useState } from "react";
import Modal from "../../../../components/Modal";
import Typography from "../../../../components/Typography";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import Button from "./Button";
import ChatButton from "./ChatButton";
import NewChannel from "./NewChannel";
import SelectNewChat from "./SelectNewChat";

const initialeState = {
  avatar: "",
  channelName: null,
  type: 0,
  members: [],
};
export const newChannelActionTypes = {
  CHANNEL_NAME: "CHANNEL_NAME",
  CHANNEL_AVATAR: "CHANNEL_AVATAR",
  CHANNEL_TYPE: "CHANNEL_TYPE",
  UPDATE_MEMBERS: "UPDATE_MEMBERS",
};

const newChannelReducer = (state, action) => {
  switch (action.type) {
    case newChannelActionTypes.CHANNEL_NAME:
      return { ...state, channelName: action.payload };
    case newChannelActionTypes.CHANNEL_AVATAR:
      return { ...state, avatar: action.payload };
    case newChannelActionTypes.CHANNEL_TYPE:
      return { ...state, type: action.payload };
    case newChannelActionTypes.UPDATE_MEMBERS: {
      if (state.members.find((elem) => elem === action.payload))
        return {
          ...state,
          members: state.members.filter((elem) => elem != action.payload),
        };
      else return { ...state, members: [...state.members, action.payload] };
    }
    default:
      return state;
  }
};

const CreateNewChat = ({ setSelectedChat }) => {
  const modalRef = useRef();
  const [state, dispatch] = useReducer(newChannelReducer, initialeState);
  function openModel() {
    modalRef?.current?.showModal();
  }
  function closeModal() {
    modalRef?.current.close();
  }
  const {
    newChannel,
    state: { allChats },
  } = useChat();
  const {
    state: {
      friends: { friends },
      user,
    },
  } = useAuth();
  const [step, setStep] = useState(0);
  const NewChannelActions = (
    <>
      <Button content="Cancel" onClick={() => setStep(0)} />
      <Button
        type="primary"
        content="Create"
        onClick={async () => {
          let params = {
            name: state.channelName,
            type: "PUBLIC",
            password: "",
            Members: state.members,
          };
          let id = await newChannel(params, state.avatar);
          setSelectedChat(id);
          closeModal();
        }}
      />
    </>
  );
  const content =
    step === 0 ? (
      <SelectNewChat
        setStep={setStep}
        closeModal={closeModal}
        setSelectedChat={setSelectedChat}
      />
    ) : (
      <>
        <NewChannel dispatch={dispatch} state={state} />
      </>
    );
  return (
    <>
      <ChatButton icon={faPlus} onClick={openModel}>
        <Typography content="New Chat" type="header" variant="secondaryTitle" />
      </ChatButton>
      <Modal
        forwardedRef={modalRef}
        bordered={true}
        title="Talk to someone or start a new channel"
        onCancel={() => {
          setStep(0);
        }}
        actions={step === 1 ? NewChannelActions : null}
      >
        {content}
      </Modal>
    </>
  );
};

export default CreateNewChat;
