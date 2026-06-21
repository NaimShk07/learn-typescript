export class AppError extends Error {
  public statusCode: number;
  public message: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.name = "AppError";

    Error.captureStackTrace(this, this.constructor);
  }
}
