import { useState } from "react";
import { useAuth } from "../../../app/context/AuthContext";
import ProfilePage from "./ProfilePage";
import UserPage from "./UserPage";

type props = {
  isProfile: boolean;
};

function UserProfile({ isProfile }: props) {

  return (
    <div className="w-screen h-full flex">
      {isProfile  ? <ProfilePage /> : <UserPage />}
    </div>
  );
}

export default UserProfile;
