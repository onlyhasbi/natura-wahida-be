export const exceptionList = {
  unauthorized: {
    statusCode: 401,
    message: "Unauthorized, Sign-in required.",
  },
  badRequest: {
    statusCode: 400,
    message: "Bad request.",
  },
  invalidAuth: {
    statusCode: 400,
    message: "Username and password invalid.",
  },
  notFound: {
    statusCode: 404,
    message: "data not found.",
  },
  conflictUsername: {
    statusCode: 409,
    message: "Username already taken.",
  },
  conflictEmail: {
    statusCode: 409,
    message: "Email already used by another user.",
  },
};
