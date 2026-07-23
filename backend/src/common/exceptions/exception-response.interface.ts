export interface ExceptionResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: unknown;
  timestamp: string;
  path: string;
  error?: string;
}