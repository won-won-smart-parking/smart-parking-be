import bcrypt from "bcrypt";

// 암호화 값 일치 여부
export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}
