import { randomBytes } from "crypto";

export function uuid() {
  // Generate 16 random bytes
  const rb = randomBytes(16);

  // Adjust bytes to match UUID version 4 spec
  rb[6] = (rb[6] & 0x0f) | 0x40; // Version 4
  rb[8] = (rb[8] & 0x3f) | 0x80; // Variant

  // Convert to UUID string format
  const uuid = rb.toString("hex");
  return uuid;
}
