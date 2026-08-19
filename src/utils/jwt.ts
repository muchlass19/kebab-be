import jwt from "jsonwebtoken";

export function signToken(id: number, role: string) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: number;
    role: string;
  };
}
