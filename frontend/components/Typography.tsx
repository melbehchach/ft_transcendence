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
}: {
  variant: string;
  colorVariant: string;
  content: string;
}) => {
  return (
    <h1
      className={clsx("font-inter text-text", {
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
}: {
  variant: string;
  colorVariant: string;
  content: string;
}) => {
  return (
    <p
      className={clsx("font-inter text-text", {
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
}: {
  type: string;
  variant: string;
  colorVariant?: string;
  content: string;
}) => {
  switch (type) {
    case "header":
      return (
        <Header
          variant={variant}
          colorVariant={colorVariant}
          content={content}
        ></Header>
      );
    case "paragraphe":
      return (
        <Paragraphe
          variant={variant}
          colorVariant={colorVariant}
          content={content}
        ></Paragraphe>
      );
  }
};

export default Typography;
