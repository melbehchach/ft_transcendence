import Link from "next/link";
import { buttounObject } from "../buttonObject.types";

interface buttonProps {
  page: buttounObject;
  active: boolean;
}

function SideBarButton({ page, active }: buttonProps) {
  return (
    <Link
      href={page.link}
      className="flex items-center h-[4rem] w-full hover:bg-primary/5"
    >
      <div
        className={`w-2 h-full ${active ? "bg-primary" : "transparent"} mr-9`}
      />
      <div
        className={`flex justify-center gap-x-3 text-2xl ${
          active ? "text-orange-300" : "text-white"
        }`}
      >
        {page.icon}
        <span className="text-xl">{page.pageName}</span>
      </div>
    </Link>
  );
}

export default SideBarButton;
