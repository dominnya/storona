/**
 * Shared utility functions to test tsconfig path aliases
 */

export function createResponse<T>(data: T, message = "Success") {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(message: string, code = 500) {
  return {
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
