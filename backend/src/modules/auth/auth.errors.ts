import { AppError } from "../../shared/errors/app-error";

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(409, "EMAIL_ALREADY_EXISTS", `Email "${email}" already exists`);
  }
}

export class UninvitedUserError extends AppError {
  constructor() {
    super(
      400,
      "UNINVITED_USER",
      "You were not invited to join this organization",
    );
  }
}
