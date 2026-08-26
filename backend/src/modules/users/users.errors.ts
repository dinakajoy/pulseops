import { AppError } from "../../shared/errors/app-error";

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(409, "EMAIL_ALREADY_EXISTS", `Email "${email}" already exists`);
  }
}
