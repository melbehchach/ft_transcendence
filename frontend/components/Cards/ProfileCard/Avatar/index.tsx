import Image from "next/image";
import { AvataProps } from "./Avatar.types";

const Avatar = ({ width, height, src, userName }: AvataProps) => {
  return (
    <div className="flex flex-col gap-[6px] justify-center items-center object-cover">
      <div
        className={`w-[267px] h-[267px] relative`}
        style={{
          width: width,
          height: height,
        }}
      >
        <Image
          src={src}
          alt={userName}
          className="rounded-[200px]"
          fill // take all dimentions
        />
      </div>
      <h3>{userName}</h3>
    </div>
  );
};

export default Avatar;
