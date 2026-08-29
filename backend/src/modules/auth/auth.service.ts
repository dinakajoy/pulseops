import { hashPassword } from "../../shared/security";
import { PostgresInvitationRepository } from "../invitation/invitation.repository";
import { EmailAlreadyExistsError, UninvitedUserError } from "./auth.errors";

import { RegisterUserInput, User, AuthRepository } from "./auth.types";

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly invitationRepository: PostgresInvitationRepository,
  ) {}

  async register(input: RegisterUserInput): Promise<User> {
    const email = input.email;
    const organizationId = input.organizationId;

    if (!email) {
      throw new Error("Email is required");
    }

    if (!organizationId) {
      throw new Error("Invalid registration link");
    }

    const invitation =
      await this.invitationRepository.findByOrganizationEmailStatus(
        organizationId,
        email,
        "accepted",
      );
    if (!invitation) {
      throw new UninvitedUserError();
    }

    const existing = await this.repository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyExistsError(email);
    }

    const passwordHash: string = await hashPassword(input.password);

    const user = await this.repository.create({
      ...input,
      password: passwordHash,
    });

    // TODO: Send verification email

    return user;
  }
}
