import { useEffect, useState } from "react";
import { useAuth } from "../../../../app/context/AuthContext";
import Avatar from "../../Avatar/Avatar";
import { AvatarProps } from "../../types/Avatar.type";
import { useRouter } from "next/navigation";

type props = {
  item: any;
};

const ProfileFriends = ({ item }: props) => {
  const {
    fetchFriendsData,
    fetchData,
    state: { user, loading },
  } = useAuth();
  const router = useRouter();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetchFriendsData();
    setTimeout(() => {
      setDataLoaded(true);
    }, 1000);
  }, []);

  const avatarObj: AvatarProps = {
    src: item.avatar,
    width: 100,
    height: 100,
    userName: item.username,
    imageStyle: "rounded-t-[15px] w-[15.9rem] h-[11rem] object-cover",
    fontSize: "text-base text-white",
    positiosn: true,
    existStatos: false,
  };

  function handleClick() {
    router.push(`/profile/${item.id}`);
  }

  return (
    <div className="w-[16rem] h-full flex flex-col gap-3 border border-black border-solid border-b-1 rounded-[15px]">
      {!dataLoaded && <p>Loading...</p>}
      {dataLoaded && (
        <>
          <div
            className="w-full flex justify-center items-center"
            onClick={handleClick}
          >
            <Avatar avatarObj={avatarObj} />
          </div>
          {user.friends.some((player) => player.id === item.id) ? (
            <div className="w-full h-full flex justify-center items-center p-[0.5rem]">
              <div className="w-full h-[2.5rem] flex justify-center items-center">
                Common Friend{" "}
              </div>
            </div>
          ) : (
            <div className="p-[0.5rem]">
              <button
                className="w-full h-[2.5rem] p-[1rem] flex items-center gap-3 text-white border border-gray-500 rounded-[8px] hover:bg-primary/5"
                onClick={handleClick}
              >
                See profile
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileFriends;
