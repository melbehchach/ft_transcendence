import ProfilePage from "./ProfilePage";
import UserPage from "./UserPage";

type props = {
  isProfile: boolean;
};

function UserProfile({ isProfile }: props) {
  return <div>{isProfile ? <ProfilePage /> : <UserPage />}</div>;
}

export default UserProfile;
