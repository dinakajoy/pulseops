import { AppError } from "../../shared/errors/app-error";

export class OrganizationNotFoundError extends AppError {
  constructor(id: string) {
    super(404, "ORGANIZATION_NOT_FOUND", `Organization '${id}' was not found`);
  }
}

export class OrganizationSlugAlreadyExistsError extends AppError {
  constructor(slug: string) {
    super(
      409,
      "ORGANIZATION_SLUG_ALREADY_EXISTS",
      `Organization slug "${slug}" already exists`,
    );
  }
}
