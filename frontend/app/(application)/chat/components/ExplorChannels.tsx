import {
  faCompass,
  faEarthAmericas,
  faKey,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import Modal from "../../../../components/Modal";
import Typography from "../../../../components/Typography";
import { useChat } from "../../../context/ChatContext";
import Button from "./Button";
import ChatButton from "./ChatButton";

const Channel = ({ channel, setSelectedChat, closeModal }) => {
  const [pwd, setPwd] = useState("");
  const {
    joinChannel,
    state: { allChats },
  } = useChat();
  const join = (channel) => {
    joinChannel(channel.id, pwd).then(() => {
      if (channel?.id && allChats.find((c) => c.id === channel.id))
        setSelectedChat(channel.id);
    });
    setPwd("");
    closeModal();
  };
  function onSubmit(e, channel) {
    e.preventDefault();
    join(channel);
  }
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-[85px] h-[85px] p-2">
          <img
            className="w-full  h-full flex items-center gap-4"
            src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <Typography
              content={channel.name}
              type="header"
              variant="secondaryTitle"
              style="whitespace-nowrap text-ellipsis overflow-hidden w-[300px] max-w-full"
            />
          </div>
          <div className="flex gap-4 justify-between">
            <Typography
              content={channel.Members.length + " members"}
              type="paragraphe"
              variant="body2"
              colorVariant="secondary"
              
            />
            <div className="flex gap-1 items-center">
              {channel.type === "PUBLIC" ? (
                <FontAwesomeIcon className="w-3 h-3" icon={faEarthAmericas} />
              ) : (
                <FontAwesomeIcon className="w-3 h-3" icon={faKey} />
              )}
              <Typography
                content={channel.type}
                type="paragraphe"
                variant="body2"
                colorVariant="secondary"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        {channel.type === "PUBLIC" ? (
          <Button
            icon={faPlus}
            content="Join Channel"
            onClick={() => join(channel)}
          />
        ) : (
          <form onSubmit={(e) => onSubmit(e, channel)}>
            <input
              onChange={(e) => {
                setPwd(e.target.value);
              }}
              value={pwd}
              type="password"
              className="w-full border px-6 py-2 bg-transparent text-white rounded-md"
              placeholder="Only if the channel is protected"
            />
          </form>
        )}
      </div>
    </div>
  );
};

const ExplorChannels = ({ setSelectedChat }) => {
  const modalRef = useRef();
  const [channels, setChannels] = useState(null);
  const [pwd, setPwd] = useState("");
  function openModel() {
    exploreChannels().then((res) => {
      setChannels(res);
    });
    modalRef?.current?.showModal();
  }
  function closeModal() {
    modalRef?.current.close();
  }
  const { exploreChannels } = useChat();
  useEffect(() => {
    exploreChannels().then((res) => {
      setChannels(res);
    });
  }, []);

  if (!channels) return;
  return (
    <>
      <ChatButton icon={faCompass} onClick={openModel}>
        <Typography
          content="Explore Channels"
          type="header"
          variant="secondaryTitle"
        />
      </ChatButton>
      <Modal
        forwardedRef={modalRef}
        bordered={true}
        title="Explore new Channels"
        onCancel={() => {
          //   setStep(0);
        }}
        // actions={step === 1 ? NewChannelActions : null}
      >
        {channels.length === 0 && (
          <Typography
            content="no channels to explore"
            type="header"
            variant="secondaryTitle"
          />
        )}
        {channels.map((channel) => {
          return (
            <>
              <Channel
                channel={channel}
                closeModal={closeModal}
                setSelectedChat={setSelectedChat}
              />
            </>
          );
        })}
      </Modal>
    </>
  );
};

export default ExplorChannels;
