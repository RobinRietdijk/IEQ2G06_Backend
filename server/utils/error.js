export const UnauthorizedError = (msg='Insufficient privileges') => `Unauthorized: ${msg}`;
export const InvalidRequestError = (msg='Invalid request data') => `Invalid request: ${msg}`;
export const InternalServerError = (msg='Internal server error') => `Error: ${msg}`;