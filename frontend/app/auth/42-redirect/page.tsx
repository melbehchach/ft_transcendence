import { cookies } from "next/headers";
import SignUpForm from "../../../components/Forms/SignUpForm";
import { User } from "../../../types";
import Failure from "../failure/page";

async function getPreAuthData() {
  const cookie = cookies();
  try {
    const response = await fetch(
      `http://${process.env.backend_host}:3000/auth/preAuthData`,
      {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: cookies()
            .getAll()
            .map(({ name, value }) => `${name}=${value}`)
            .join("; "),
        },
      }
    );
    if (response.ok) {
      const res = await response.json();
      return res.user;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

export default async function ApiRedirectPage() {
  const user: User = await getPreAuthData();
  return (
    <>
      {!user && <Failure />}
      {user && <SignUpForm {...user} />}
    </>
  );
}
