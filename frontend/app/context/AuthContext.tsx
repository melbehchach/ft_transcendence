"use client";
import axios from "axios";
import Cookies from "js-cookie";
import React, { createContext, useContext, useReducer } from "react";

type LoadingStatus = "idle" | "loading" | "success" | "error";

type AuthContext = {
  isAuthenticated: boolean;
  status: LoadingStatus;
  user: any;
  tfa: "idle" | true | false;
};

const initialeState: AuthContext = {
  isAuthenticated: false,
  status: "idle",
  user: null,
  tfa: "idle",
};

const actionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  UPDATE_USER: "UPDATE_USER",
  TFA: "TFA",
  LOAD_USER_DATA: "LOAD_USER_DATA",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        tfa: false,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case actionTypes.TFA: {
      return { ...state, tfa: action.payload.tfa };
    }
    case actionTypes.UPDATE_USER: {
      return { ...state, user: action.payload.user, isAuthenticated: true };
    }
    default:
      return state;
  }
};

const Auth = createContext<any>(null);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialeState);

  const jwt_token = Cookies.get("JWT_TOKEN");

  async function fetchData() {
    try {
      if (jwt_token) {
        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        dispatch({
          type: actionTypes.UPDATE_USER,
          payload: { user: response.data },
        });
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }
  async function login(username: string, password: string) {
    const response = await fetch("http://localhost:3000/auth/signin", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (response.ok) {
      const res = await response.json();
      if (res.TFA) {
        dispatch({ type: actionTypes.TFA, payload: { tfa: res.TFA } });
      } else {
        dispatch({ type: actionTypes.LOGIN, payload: { user: null } });
      }
    } else {
      alert("Failed To Signin");
    }
  }

  const logout = () => {
    dispatch({ type: actionTypes.LOGOUT });
  };

  return (
    <Auth.Provider value={{ state, login, logout, fetchData }}>
      {children}
    </Auth.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(Auth);

  if (!context) {
    throw new Error("");
  }

  return context;
};

export default AuthContextProvider;
