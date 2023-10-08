import NavbarButton from "./NavbarButton";
import Logo from "./Logo";
import ProfileIcon from "./icons/ProfileIcon";
import ChatIcon from "./icons/ChatIcon";
import GameIcon from "./icons/GameIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function logout(router: AppRouterInstance) {
  const response = await fetch("http://localhost:3000/auth/signout", {
    credentials: "include",
    method: "GET",
  });
  const res = await response.json();
  if (response.ok) {
    router.push("/auth/login");
  } else alert("FAILED TO SIGN OUT");
}

export default function NavbarItems({ navbarOpen }: any) {
  const [ProfileClicked, setProfileClicked] = useState<boolean>(true);
  const [ChatClicked, setChatClicked] = useState<boolean>(false);
  const [GameClicked, setGameClicked] = useState<boolean>(false);
  const router = useRouter();
  return (
    <>
      <div
        className={
          (navbarOpen ? "flex pt-20" : "hidden") +
          " sm:flex sm:pt-10 w-full h-full bg-background border-black border-r-2 xl:border-r-4 flex-col items-center gap-5 py-10"
        }
      >
        <div className={(navbarOpen ? "hidden" : "block") + " sm:block mb-5"}>
          <button
            className="w-full"
            onClick={() => {
              router.push("/profile");
              setProfileClicked(true);
              setChatClicked(false);
              setGameClicked(false);
            }}
          >
            <Logo />
          </button>
        </div>
        <div className="flex flex-col place-content-between w-full h-full">
          <div className="flex flex-col  gap-5 w-full">
            <button
              className="w-full"
              onClick={() => {
                router.push("/profile");
                setProfileClicked(true);
                setChatClicked(false);
                setGameClicked(false);
              }}
            >
              <div className="w-full">
                <NavbarButton
                  label={"Profile"}
                  icon={<ProfileIcon clicked={ProfileClicked} />}
                  clicked={ProfileClicked}
                />
              </div>
            </button>
            <button
              className="w-full"
              onClick={() => {
                // router.push("/Chat");
                setChatClicked(true);
                setProfileClicked(false);
                setGameClicked(false);
              }}
            >
              <div className="w-full">
                <NavbarButton
                  label={"Chat"}
                  icon={<ChatIcon clicked={ChatClicked} />}
                  clicked={ChatClicked}
                />
              </div>
            </button>
            <button
              className="w-full"
              onClick={() => {
                router.push("/game");
                router.push("/game");
                setGameClicked(true);
                setChatClicked(false);
                setProfileClicked(false);
              }}
            >
              <div className="w-full">
                <NavbarButton
                  label={"Game"}
                  icon={<GameIcon clicked={GameClicked} />}
                  clicked={GameClicked}
                />
              </div>
            </button>
          </div>
          <button
            className="w-full"
            onClick={() => {
              logout(router);
            }}
          >
            <div className="w-full">
              <NavbarButton label={"Logout"} icon={<LogoutIcon />} />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
