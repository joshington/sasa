

import bcrypt from "bcryptjs";

export async function hashPin(pin: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pin, salt);
}

export async function verifyPin(pin: string, hash: string) {
  return await bcrypt.compare(pin, hash);
}