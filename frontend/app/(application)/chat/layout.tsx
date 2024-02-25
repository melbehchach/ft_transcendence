import React from "react";

// font-family: Inter;
// font-size: 32px;
// font-style: normal;
// font-weight: 700;
// line-height: normal;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-background w-screen flex">{children}</div>;
}
