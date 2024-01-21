import Link from "next/link";
import { buttounObject } from "../buttonObject.types";

interface buttonProps {
  page: buttounObject;
}

function SideBarButton({ page }: buttonProps) {
  return (
    <button type="button">
      <Link
        href={page.link}
        className={`flex justify-center gap-[2rem] text-2xl ${page.TextColor}`}
      >
        {page.icon}
        {page.pageName}
      </Link>
    </button>
  );
}

export default SideBarButton;
