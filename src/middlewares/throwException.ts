import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import { exceptionList } from "../constant/exceptionList";

export function handleThrow<T = unknown>({
  type,
  error,
  table,
  customMessage,
}: {
  type: keyof typeof exceptionList;
  error?: T;
  table?: string;
  customMessage?: string;
}) {
  const message = table
    ? `${table} ${exceptionList[type].message}`
    : exceptionList[type].message;

  const response = {
    message: customMessage || message,
    ...(error && { data: error }),
  };

  const res = new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  throw new HTTPException(exceptionList[type].statusCode as StatusCode, {
    res,
  });
}
