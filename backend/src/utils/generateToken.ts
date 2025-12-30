import jwt from "jsonwebtoken";

export const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_ACCESS_SECRET || "fallback_access_secret",
    {
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN as any) || "15m",
    }
  );
};
