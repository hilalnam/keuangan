import type { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

type ApiResponseType<T> = SuccessResponse<T> | ErrorResponse;

export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode = 200): void {
    const body: ApiResponseType<T> = { success: true, data };
    res.status(statusCode).json(body);
  }

  static created<T>(res: Response, data: T): void {
    ApiResponse.success(res, data, 201);
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }

  static error(
    res: Response,
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
  ): void {
    const body: ErrorResponse = {
      success: false,
      error: { code, message },
    };

    if (details !== undefined) {
      body.error.details = details;
    }

    res.status(statusCode).json(body);
  }
}
