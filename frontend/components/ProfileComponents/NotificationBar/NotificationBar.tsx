import Image from "next/image";
import NotificationBarIcon from "./NotificationBarIcon";

export default function NotificationBar() {
  return (
    <div className="flex items-center justift-center ml-8">
      <button>
        <NotificationBarIcon />
      </button>
    </div>
  );
}
