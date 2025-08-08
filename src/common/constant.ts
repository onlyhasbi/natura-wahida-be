export const message = (
  key:
    | "NotFound"
    | "NoId"
    | "NoToken"
    | "InvalidToken"
    | "TokenExpired"
    | "Save"
    | "Delete"
    | "Update"
    | "Signout"
    | "Unauthorized"
    | "InternalServerError",
  subject?:
    | "User"
    | "Patient"
    | "Product"
    | "Therapy"
    | "Transaction"
    | "Therapists"
    | "Appointments"
    | "Prescription"
    | "Transaction Product"
    | "Transaction Therapy"
    | "Transaction"
) => {
  const options = {
    NotFound: `${subject} not found.`,
    NoId: `No ${subject} id provided.`,
    NoToken: `No token provided.`,
    TokenExpired: `Token is expired.`,
    InvalidToken: `Token is invalid.`,
    Save: `New ${subject} has been added successfully.`,
    Delete: `${subject} deleted successfully.`,
    Update: `${subject} updated successfully.`,
    Signout: "Signout successfully.",
    Unauthorized: "Unauthorized.",
    InternalServerError: "InternalServerError"
  };

  return { message: options?.[key] };
};
