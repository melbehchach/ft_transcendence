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
          className="rounded-t-[14px] "
          fill // take all dimentions
        />
      </div>
      <h3>{userName}</h3>
    </div>
  );
};

export default Avatar;
