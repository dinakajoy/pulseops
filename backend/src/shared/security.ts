import argon2 from "argon2";

export const hashPassword = async (password: string) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export const verifyPassword = async (password: string, hash: string) => {
  return await argon2.verify(password, hash);
};
