import {
  faEarthAmericas,
  faKey,
  faLock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Avatar from "../../../../components/Avatar";
import Modal from "../../../../components/Modal";
import Typography from "../../../../components/Typography";
import UserAvatar from "../../../../components/UserAvatar";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import Button from "./Button";
import { newChannelActionTypes } from "./CreateNewChat";
import { RowWrapper } from "./SelectNewChat";

const NewChannelRow = ({
  label,
  children,
  alignStart,
}: {
  label: string;
  children: JSX.Element;
  alignStart?: boolean;
}) => {
  return (
    <div
      className={clsx("flex gap-16 items-center", {
        "items-baseline": label === "Channel Name",
      })}
    >
      {/* <div className="w-1/4 shrink-0"> */}
      <div className={clsx("w-1/4 shrink-0", { "self-start": alignStart })}>
        <Typography content={label} type="paragraphe" variant="body" />
      </div>
      {children}
    </div>
  );
};

const NewChannel = ({
  dispatch,
  state,
  channel,
}: {
  dispatch: any;
  state: any;
  channel?: any;
}) => {
  const modalRef = useRef();
  const [inputErrors, setInputErrors] = useState({
    channelName: "",
    password: "",
  });
  // const [channel, setChannel] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    state && state.avatar ? state.avatar : ""
  );
  const {
    getChannelByID,
    unbanMember,
    state: { members, allChats },
  } = useChat();
  useEffect(() => {
    if (channel) {
      setPreviewUrl(state.avatar);
    }
  }, [state]);
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    // Validate input based on field
    if (field === "channelName") {
      if (value.length < 3) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          channelName: "Channel Name must be at least 3 characters long",
        }));
      } else {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          channelName: "",
        }));
      }
      dispatch({
        type: newChannelActionTypes.CHANNEL_NAME,
        payload: e.target.value,
      });
    } else if (field === "password") {
      if (value.length < 6) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be at least 6 characters long",
        }));
      } else {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          password: "",
        }));
      }
      dispatch({
        type: newChannelActionTypes.UPDATE_PASSWORD,
        payload: e.target.value,
      });
    }
  };
  function openModel() {
    modalRef?.current?.showModal();
  }
  function closeModal() {
    modalRef?.current.close();
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const maxFileSize = 1024 * 1024 * 5;
      if (file.size > maxFileSize) {
        alert("File is too large. Please upload a file smaller than 5 MB.");
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      dispatch({
        type: newChannelActionTypes.CHANNEL_AVATAR,
        payload: file,
      });
    }
  };
  const {
    state: {
      friends: { friends },
      user,
    },
  } = useAuth();
  useEffect(() => {
    dispatch({
      type: newChannelActionTypes.UPDATE_PASSWORD,
      payload: "",
    });
  }, [state?.type]);
  if (!state) return;
  return (
    <>
      <NewChannelRow label="Channel Photo">
        <div className=" flex w-40 h-40 rounded-full border relative">
          <input
            type="file"
            accept="image/*"
            id="file-input"
            name="file-input"
            onChange={handleFileChange}
            className="absolute bottom-0 right-0 "
          />
          <label
            htmlFor="file-input"
            className="absolute w-8 h-8 bottom-0 right-0 bg-black flex justify-center items-center border border-white rounded-full"
            // onChange={handleFileChange}
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="w-6 h-6 absolute  text-white rounded-full"
            />
          </label>
          {state.avatar && (
            <img
              src={previewUrl}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
      </NewChannelRow>
      <NewChannelRow label="Channel Name">
        <div className="flex flex-col gap-2 grow">
          <input
            value={state.channelName}
            onChange={(e) => handleInputChange(e, "channelName")}
            className="w-full border rounded-sm px-6 py-2 bg-transparent text-white rounded-md"
            placeholder="Type The Channel Name"
          />
          {inputErrors.channelName && (
            <span className="text-red-500">{inputErrors.channelName}</span>
          )}
        </div>
      </NewChannelRow>
      <NewChannelRow alignStart label="Channel Type">
        <div className="flex flex-col gap-4">
          <div
            onClick={() =>
              dispatch({ type: newChannelActionTypes.CHANNEL_TYPE, payload: 0 })
            }
            className={clsx("p-4 cursor-pointer", {
              "rounded-[12px] border": state.type === 0,
            })}
          >
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon className="w-4 h-4" icon={faEarthAmericas} />
              <Typography content="Public" type="paragraphe" variant="body" />
            </div>
            <Typography
              type="paragraphe"
              variant="body2"
              content="Any user can join the channel and start sending messages"
              colorVariant="secondary"
            ></Typography>
          </div>
          <div
            onClick={() =>
              dispatch({ type: newChannelActionTypes.CHANNEL_TYPE, payload: 1 })
            }
            className={clsx("p-4 cursor-pointer ", {
              "rounded-[12px] border": state.type === 1,
            })}
          >
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon className="w-4 h-4" icon={faKey} />
              <Typography
                content="Protected"
                type="paragraphe"
                variant="body"
              />
            </div>
            <Typography
              type="paragraphe"
              variant="body2"
              content="Any user can find the channel but needs a password to join"
              colorVariant="secondary"
            ></Typography>
          </div>
          <div
            className={clsx("p-4 cursor-pointer ", {
              "rounded-[12px] border": state.type === 2,
            })}
            onClick={() =>
              dispatch({ type: newChannelActionTypes.CHANNEL_TYPE, payload: 2 })
            }
          >
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon className="w-4 h-4" icon={faLock} />
              <Typography content="Private" type="paragraphe" variant="body" />
            </div>
            <Typography
              type="paragraphe"
              variant="body2"
              content="Only users that you invite will have access to the channel"
              colorVariant="secondary"
            ></Typography>
          </div>
        </div>
      </NewChannelRow>
      <NewChannelRow label="Channel Password">
        <div className="flex flex-col gap-2 grow">
          <input
            onChange={(e) => {
              handleInputChange(e, "password");
            }}
            disabled={state.type !== 1}
            value={state.password}
            type="password"
            className="w-full border px-6 py-2 bg-transparent text-white rounded-md"
            placeholder="Only if the channel is protected"
          />
          {inputErrors.password && state.type === 1 && (
            <span className="text-red-500">{inputErrors.password}</span>
          )}
        </div>
      </NewChannelRow>
      <NewChannelRow label="Channel Members">
        <>
          <div className="flex items-center gap-4">
            <div className="mr-[25px]">
              <Button content="Add members" onClick={openModel} />
            </div>
            <div className="flex items-center">
              {state?.members?.map((id, key) => {
                return (
                  <div key={key} className="ml-[-25px]">
                    <Avatar
                      src={friends.find((friend) => friend.id === id)?.avatar}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <Modal
            forwardedRef={modalRef}
            bordered={true}
            title="Talk to someone or start a new channel"
            onCancel={() => {}}
          >
            {friends.map((friend, index) => {
              if (
                channel &&
                channel.name &&
                channel?.bannedMembers?.find((el) => el.id === friend.id)
              ) {
                return (
                  <RowWrapper key={index}>
                    <UserAvatar src={friend.avatar} name={friend.username} />
                    <Button
                      content="Unban"
                      onClick={() => {
                        unbanMember(channel.id, friend.id);
                      }}
                    />
                  </RowWrapper>
                );
              } else if (state?.members?.find((elem) => elem === friend.id))
                return (
                  <RowWrapper key={index}>
                    <UserAvatar src={friend.avatar} name={friend.username} />
                    <Button
                      content="Remove"
                      onClick={() => {
                        dispatch({
                          type: newChannelActionTypes.UPDATE_MEMBERS,
                          payload: friend.id,
                        });
                      }}
                    />
                  </RowWrapper>
                );
              return (
                <RowWrapper key={index}>
                  <UserAvatar src={friend.avatar} name={friend.username} />
                  <Button
                    content="Add"
                    type="primary"
                    onClick={() => {
                      dispatch({
                        type: newChannelActionTypes.UPDATE_MEMBERS,
                        payload: friend.id,
                      });
                    }}
                  />
                </RowWrapper>
              );
            })}
          </Modal>
        </>
      </NewChannelRow>
    </>
  );
};
export default NewChannel;
