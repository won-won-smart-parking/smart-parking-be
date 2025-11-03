import bcrypt from "bcrypt";

// 사용자 비밀번호 bcrypt 암호화
export async function encodePassowrd(plain: string) {
  return await bcrypt.hash(plain, await bcrypt.genSalt(10));
}

// 암호화 값 일치 여부
export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}
