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
