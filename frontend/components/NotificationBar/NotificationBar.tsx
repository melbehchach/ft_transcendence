import Image from "next/image";
import NotificationBarIcon from "./NotificationBarIcon.svg";

export default function NotificationBar() {
  return (
    <div className="flex justift-center">
      <button>
        <Image
          src={NotificationBarIcon}
          width={19}
          height={19}
          alt="notificationIcon"
        />
      </button>
    </div>
  );
}
