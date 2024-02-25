import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Typography from "../../../../components/Typography";
import UserAvatar from "../../../../components/UserAvatar";

const ChatHeader = ({ headerInfo: { avatar, name } }) => {
  return (
    <div className="border-b border-black py-4 fixed w-full flex items-center">
      <UserAvatar src={avatar} name={name} />
      <div className="dropdown bg-transparent ">
        <div tabIndex={0} role="button" className="">
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="w-6 h-6 text-white rounded-full"
          />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box pos w-fit"
        >
          <li className="w-[200px]">
            <Typography
              content="edit channel"
              type="paragraphe"
              variant="body2"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatHeader;
