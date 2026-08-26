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

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UserRepository {
  create(input: CreateUserInput): Promise<User>;

  findByEmail(email: string): Promise<User | null>;
}
