import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import axios from "axios";

function checkToken(token: string) {
  return new Promise(async (resolve, reject) => {
    try {
      await axios.get("http://localhost:3000/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      resolve(true);
    } catch (e) {
      reject(false);
    }
  });
}

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    // Check authentication state
    const {
      fetchFriendsReqData,
      fetchFriendsData,
      getUserInfo,
      state: { isAuthenticated },
      fetchData,
    } = useAuth();
    useEffect(() => {
      const jwt_token = Cookies.get("JWT_TOKEN");
      checkToken(jwt_token)
        .then(() => {
          if (!isAuthenticated) router.push("/auth/login");
          fetchFriendsReqData().then(() => {
            fetchFriendsData().then(() => {
              if (window.location.pathname === "/profile")
                router.push("/profile");
              if (window.location.pathname === "/game") router.push("/game");
              if (window.location.pathname === "/chat") router.push("/chat");
              if (window.location.pathname === "/game/random")
                router.push("/game/issue");
            });
          });
        })
        .catch(() => {
          router.push("/auth/login");
        });
    }, [isAuthenticated, router]);

    // Render the wrapped component if authenticated
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;
