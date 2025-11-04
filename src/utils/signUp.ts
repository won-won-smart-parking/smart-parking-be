import path from "path";
import sharp from "sharp";
import { supabase } from "../configs/supabase.ts";

/**
 * 클라이언트에서 전송받은 이미지를 Supabase 저장소에 업로드하는 유틸 함수
 *
 * @param file (Express.Multer.File | undefined)
 * @returns null | string
 */
export async function uploadProfileImage(file: Express.Multer.File | undefined) {
  // 이미지가 존재하지 않는 경우 -> null을 반환
  if (!file) {
    return null;
  }

  // 업로드 이미지 파일 이름을 구성하고, webp 확장자로 파일을 변경한다.
  const uploadFileName = `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}.webp`;
  const webpBuffer = await sharp(file.buffer).webp().toBuffer();

  // Supabase Storage에 이미지 업로드
  const { data, error } = await supabase.storage.from("profile-images").upload(`users/${uploadFileName}`, webpBuffer, {
    contentType: "image/webp",
    upsert: false,
  });

  // 이미지 업로드 과정에서 에러가 발생한 경우
  if (error) {
    throw error;
  }

  return supabase.storage.from("profile-images").getPublicUrl(data.path).data.publicUrl; // 업로드 된 이미지 경로를 반환한다.
}
