import "server-only";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface UserPayload {
  userId: string;
  email: string;
}

export const getCurrentUser = async (): Promise<UserPayload | null> => {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
};
