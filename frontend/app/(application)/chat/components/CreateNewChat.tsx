"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import Modal from "../../../../components/Modal";
import Typography from "../../../../components/Typography";
import Button from "./Button";
import ChatButton from "./ChatButton";
import NewChannel from "./NewChannel";
import SelectNewChat from "./SelectNewChat";

const CreateNewChat = ({ setSelectedChat }) => {
  const modalRef = useRef();
  function openModel() {
    modalRef?.current?.showModal();
  }
  function closeModal() {
    modalRef?.current.close();
  }
  const [step, setStep] = useState(0);
  const NewChannelActions = (
    <>
      <Button content="Cancel" onClick={() => setStep(0)} />
      <Button type="primary" content="Create" />
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
      <NewChannel />
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
