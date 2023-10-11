import NavbarButton from "./NavbarButton";
import Logo from "./Logo";
import ProfileIcon from "./icons/ProfileIcon";
import ChatIcon from "./icons/ChatIcon";
import GameIcon from "./icons/GameIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const profile: string = "profile",
    chat: string = "chat",
    game: string = "game";
  const [currentPage, setCurrentPage] = useState<string>(
    pathname.substring(1) || "profile"
  );
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
              setCurrentPage(profile);
              router.push("/profile");
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
                setCurrentPage(profile);
                router.push("/profile");
              }}
            >
              <div className="w-full">
                <NavbarButton
                  label={"Profile"}
                  icon={<ProfileIcon clicked={currentPage == profile} />}
                  clicked={currentPage == profile}
                />
              </div>
            </button>
            <button
              className="w-full"
              onClick={() => {
                setCurrentPage(chat);
                router.push("/chat");
              }}
            >
              <div className="w-full">
                <NavbarButton
                  label={"Chat"}
                  icon={<ChatIcon clicked={currentPage == chat} />}
                  clicked={currentPage == chat}
                />
              </div>
            </button>
            <button
              className="w-full"
              onClick={() => {
                setCurrentPage(game);
                router.push("/game");
              }}
            >
              <div className="w-full">
                <NavbarButton
                  label={"Game"}
                  icon={<GameIcon clicked={currentPage == game} />}
                  clicked={currentPage == game}
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
