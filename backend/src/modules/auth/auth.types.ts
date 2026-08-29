export type UserStatus = "active" | "disabled";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterUserInput {
  organizationId: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthRepository {
  create(input: RegisterUserInput): Promise<User>;

  findByEmail(email: string): Promise<User | null>;
}
