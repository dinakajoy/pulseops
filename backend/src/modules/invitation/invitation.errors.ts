import { AppError } from "../../shared/errors/app-error";

export class InvitationNotFoundError extends AppError {
  constructor() {
    super(404, "INVITATION_NOT_FOUND", "Invitation was not found");
  }
}

export class InvitationExistsError extends AppError {
  constructor() {
    super(
      409,
      "INVITATION_EXISTS",
      "A pending invitation already exists for this email",
    );
  }
}

export class InvitationExpiredError extends AppError {
  constructor() {
    super(410, "INVITATION_EXPIRED", "Invitation has expired");
  }
}

export class InvitationRevokedError extends AppError {
  constructor() {
    super(410, "INVITATION_REVOKED", "Invitation has been revoked");
  }
}

export class InvitationAcceptedError extends AppError {
  constructor() {
    super(409, "INVITATION_ACCEPTED", "Invitation has already been accepted");
  }
}
