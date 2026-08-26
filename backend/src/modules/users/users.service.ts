import { EmailAlreadyExistsError } from "./users.errors";

import { CreateUserInput, User, UserRepository } from "./users.types";

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(input: CreateUserInput): Promise<User> {
    const email = input.email;

    if (!email) {
      throw new Error("Email is required");
    }

    const existing = await this.repository.findByEmail(email);

    if (existing) {
      throw new EmailAlreadyExistsError(email);
    }

    return this.repository.create({
      name: input.name,
      email,
      password: input.password,
    });
  }
}
