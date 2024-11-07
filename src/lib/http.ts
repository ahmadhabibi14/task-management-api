import type { Response } from "express";
import type { ResponseHTTP } from "../types/response";

export function ResponseJSONFunc<T extends ResponseHTTP>(
  res: Response, data: T, statusCode: number,
): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.json(data);
  
  return;
}