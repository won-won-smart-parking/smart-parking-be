module.exports = {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "header-match-issue-at-end": (parsed, when = "always") => {
          const header = parsed.header || "";
          const regex = /^(\w+)(\(.+\))?: .+ \(#\d+\)$/; // <type>(<scope>): <subject> (#123)
          const pass = regex.test(header);
          return [when === "always" ? pass : !pass, 'header must match "<type>(<scope>): <subject> (#issue-number)".'];
        },
      },
    },
  ],
  rules: {
    // 허용되는 commit type 정의
    "type-enum": [
      2,
      "always",
      [
        "feat",      // 기능 추가
        "fix",       // 버그 수정
        "update",    // 기능 보완
        "refactor",  // 리팩토링
        "test",      // 테스트 관련
        "style",     // 스타일 변경
        "init",      // 초기 설정
        "chore",     // 빌드/설정 변경
        "move",      // 파일 이동
        "rename",    // 이름 변경
        "remove",    // 삭제
        "docs",      // 문서 작업
        "comment",   // 주석 변경
      ],
    ],
    "header-max-length": [2, "always", 248],        // commit message 길이 제한 (248자)
    "subject-case": [0],                            // description 대소문자 자유
    "header-match-issue-at-end": [2, "always"],     // <type>: <description> (#issue-number) 커밋 메시지 구조 규칙 강제 시키기
  },
};
