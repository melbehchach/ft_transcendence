"use client";
import { useState } from "react";
import NavbarItems from "./NavbarItems";
import MenuButton from "./MenuButton";
import CloseMenuButton from "./CloseMenuButton";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

  return (
    <div className="w-48 h-screen">
      <MenuButton navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
      <CloseMenuButton navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
      <NavbarItems navbarOpen={navbarOpen} />
    </div>
  );
}

// sm:w-1/5 xl:w-1/6 2xl:w-[10%]
// h-screen flex flex-col justify-between sm:w-1/5 xl:w-1/6 2xl:w-[10%]