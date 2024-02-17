import {
  faEarthAmericas,
  faKey,
  faLock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState } from "react";
import Typography from "../../../../components/Typography";
import Button from "./Button";

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
    <div className="flex gap-16 items-center">
      {/* <div className="w-1/4 shrink-0"> */}
      <div className={clsx("w-1/4 shrink-0", { "self-start": alignStart })}>
        <Typography content={label} type="paragraphe" variant="body" />
      </div>
      {children}
    </div>
  );
};

const NewChannel = () => {
  const [avatar, setAvatar] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Update state with the selected image
        setAvatar(reader.result);
      };

      // Read the selected image as a data URL
      reader.readAsDataURL(file);
    }
  };

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
          {avatar && (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
      </NewChannelRow>
      <NewChannelRow label="Channel Name">
        <input
          className="w-full border rounded-sm px-6 py-2 bg-transparent text-white rounded-md"
          placeholder="Type The Channel Name"
        />
      </NewChannelRow>
      <NewChannelRow alignStart label="Channel Type">
        <div className="flex flex-col gap-4">
          <div>
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
          <div>
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
          <div>
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
        <input
          className="w-full border px-6 py-2 bg-transparent text-white rounded-md"
          placeholder="Only if the channel is protected"
        />
      </NewChannelRow>
      <NewChannelRow label="Channel Members">
        <Button content="Add members" />
      </NewChannelRow>
    </>
  );
};
export default NewChannel;
