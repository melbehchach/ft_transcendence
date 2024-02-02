import Image from "next/image";
import NotificationBarIcon from "./NotificationBarIcon";

export default function NotificationBar() {
  return (
    <div className="flex justift-center">
      <button>
        <NotificationBarIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
