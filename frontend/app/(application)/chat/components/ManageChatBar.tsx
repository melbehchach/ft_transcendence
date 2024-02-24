import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Typography from "../../../../components/Typography";
import UserAvatar from "../../../../components/UserAvatar";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";

const ManageChatBar = ({ chat }) => {
  const [owner, setOwner] = useState();
  const { fetchData } = useAuth();
  const {
    state: { members },
  } = useChat();
  async function fetchOwnerData() {
    fetchData(chat.owner.id, true).then((res) => setOwner(res));
  }
  useEffect(() => {
    // console.log(chat.Members, members);
    fetchOwnerData();
  }, []);

  if (!owner) return;
  return (
    <div className="flex flex-col gap-4  p-4">
      <div className="flex flex-col justify-center gap-2 py-2">
        <div className="pl-4">
          <Typography
            content="Owner"
            type="paragraphe"
            variant="body2"
            colorVariant="secondary"
          />
        </div>
        <UserAvatar name={owner.username} src={owner.avatar} />
      </div>
      {/* <div className="flex flex-col justify-center gap-2 py-2">
        <div className="pl-4">
          <Typography
            content="Admins"
            type="paragraphe"
            variant="body2"
            colorVariant="secondary"
          />
        </div>
        <UserAvatar />
        <UserAvatar />
      </div> */}
      <div className="flex flex-col justify-center gap-4 py-2">
        <div className="pl-4">
          <Typography
            content={`Members (${chat.Members.length})`}
            type="paragraphe"
            variant="body2"
            colorVariant="secondary"
          />
        </div>
        {chat.Members.map((m, index) => {
          let mem = members.find((elem) => elem.id === m.id);
          return (
            <>
              <div className="flex justify-between items-center">
                <UserAvatar src={mem.avatar} name={mem.username} />
                <div className="dropdown bg-transparent">
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
                        content="Make admine"
                        type="paragraphe"
                        variant="body2"
                      />
                    </li>
                    <li className="w-[200px]">
                      <Typography
                        content="Mute"
                        type="paragraphe"
                        variant="body2"
                      />
                    </li>
                    <li className="w-[200px]">
                      <Typography
                        content="Kick"
                        type="paragraphe"
                        variant="body2"
                      />
                    </li>
                    <li className="w-[200px]">
                      <Typography
                        content="Ban"
                        type="paragraphe"
                        variant="body2"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ManageChatBar;
