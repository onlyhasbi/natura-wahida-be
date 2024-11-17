import { v4 as uuidv4 } from "uuid";

export const generateId = () => uuidv4();

export const isTokenExpired = (time: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return time < currentTime;
};
