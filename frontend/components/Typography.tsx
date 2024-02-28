import clsx from "clsx";

//modal title
// font-family: Inter;
// font-size: 32px;
// font-style: normal;
// font-weight: 700;
// line-height: normal;

const Header = ({
  variant,
  colorVariant,
  content,
  style,
}: {
  variant: string;
  colorVariant: string;
  content: string;
  style?: any;
}) => {
  return (
    <h1
      className={clsx(`font-inter text-text ${style}`, {
        "text-title font-bold": variant === "primaryTitle",
        "text-body font-normal leading-[25px]": variant === "secondaryTitle",
        "text-textSecondary": colorVariant === "secondary",
        "text-3xl font-bold leading-normal": variant === "modalTitle",
      })}
    >
      {content}
    </h1>
  );
};

// font-family: Inter;
// font-size: 14px;
// font-style: normal;
// font-weight: 400;
// line-height: 20px;
const Paragraphe = ({
  variant,
  colorVariant,
  content,
  style,
}: {
  variant: string;
  colorVariant: string;
  content: string;
  style?: any;
}) => {
  return (
    <p
      className={clsx(`font-inter text-text ${style}`, {
        "text-body font-normal leading-[25px] text-nowrap": variant === "body",
        "text-sm font-normal break-all": variant === "body2",
        "text-textSecondary": colorVariant === "secondary",
      })}
    >
      {content}
    </p>
  );
};

const Typography = ({
  type,
  variant,
  colorVariant = "default",
  content,
  style,
}: {
  type: string;
  variant: string;
  colorVariant?: string;
  content: string;
  style?: any;
}) => {
  switch (type) {
    case "header":
      return (
        <Header
          style={style}
          variant={variant}
          colorVariant={colorVariant}
          content={content}
        ></Header>
      );
    case "paragraphe":
      return (
        <Paragraphe
          style={style}
          variant={variant}
          colorVariant={colorVariant}
          content={content}
        ></Paragraphe>
      );
  }
};

export default Typography;
