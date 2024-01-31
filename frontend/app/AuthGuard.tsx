import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    // Check authentication state
    const {
      state: { isAuthenticated },
      fetchData,
    } = useAuth();

    useEffect(() => {
      const jwt_token = Cookies.get("JWT_TOKEN");
      // Redirect to login page if user is not authenticated
      if (jwt_token) {
        fetchData();
        router.push("/profile");
      } else if (!isAuthenticated) {
        router.push("/auth/login");
      }
    }, [isAuthenticated, router]);

    // Render the wrapped component if authenticated
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;
