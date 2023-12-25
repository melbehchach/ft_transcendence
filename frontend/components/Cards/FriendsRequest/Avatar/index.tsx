import Image from "next/image";
import { AvataProps } from "./Avatar.types";

const Avatar = ({ width, height, src, userName }: AvataProps) => {
  return (
    <div className="flex flex-col gap-[6px] justify-center items-center mt-[-15px]">
      <div
        className={`w-[264px] h-[189px] relative`}
        style={{
          width: width,
          height: height,
        }}
      >
        <Image
          src={src}
          alt={userName}
          className="object-cover rounded-t-[14px]"
          fill
        />
      </div>
      <h3 className="font-inter">{userName}</h3>
    </div>
  );
};

export default Avatar;
