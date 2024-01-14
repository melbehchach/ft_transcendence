import Image from "next/image";

export interface AvataProps {
  width?: number;
  height?: number;
  src: string;
  userName: string;
  imageStyle: string;
  fontSize: string;
}

export default function Avatar({
  width,
  height,
  src,
  userName,
  imageStyle,
  fontSize,
}: AvataProps) {
  return (
    <div className="flex flex-col items-center gap-[0.5rem]">
      <Image
        src={src}
        width={width}
        height={height}
        alt={userName}
        className={`${imageStyle}`}
      />
      <div className={`${fontSize}`}>
        <h1>{userName}</h1>
      </div>
    </div>
  );
}

// flex justify-center for the non RecentGames cars
