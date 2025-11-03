import multer from "multer";

// multer 패키지 -> 이미지, 동영상 등 파일들을 multipart 형식으로 데이터를 보낼 때 사용하는 미들웨어 생성 모듈
// - stroage: Supabase 스토리지에 저장하기 때문에, 디스크가 아닌 메모리에 파일을 저장한다.
// - limits: 파일을 받을 수 있는 개수와 파일의 최대 허용 크기를 지정한다.
// - fileFilter: 파일의 종류를 제한시킨다. jpeg / png / webp만 이미지 파일만 허용하게 만든다.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: 5 * 1024 * 1024 },
  fileFilter(_, file, done) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return done(new Error("jpeg, png, webp 확장자 이미지 파일만 업로드할 수 있습니다."));
    }

    done(null, true);
  },
});
