// check-filename-case.js
import fs from "fs";
import path from "path";

const ROUTES_FILE = path.resolve("src/routes/UserRoutes.jsx");
const MYPAGE_DIR = path.resolve("src/pages/mypage");

// 🔹 1. UserRoutes.jsx에서 import된 mypage 경로 추출
const fileContent = fs.readFileSync(ROUTES_FILE, "utf-8");
const regex = /from\s+["']@\/pages\/mypage\/([^"']+)["']/g;

const importedFiles = [];
let match;
while ((match = regex.exec(fileContent)) !== null) {
  importedFiles.push(match[1]);
}

// 🔹 2. 실제 파일 시스템의 파일명 목록 가져오기
const actualFiles = fs.readdirSync(MYPAGE_DIR);
const actualFileSet = new Set(
  actualFiles.map((f) => f.replace(/\.(jsx|js|ts|tsx)$/, ""))
);

// 🔹 3. 대소문자 포함 비교
console.log("🔍 [Amplify 빌드 파일 검증 시작]\n");
for (const imp of importedFiles) {
  const foundExact = actualFiles.find(
    (f) => f === `${imp}.jsx` || f === `${imp}.js`
  );
  const foundCaseInsensitive = actualFiles.find(
    (f) =>
      f.toLowerCase() === `${imp.toLowerCase()}.jsx` ||
      f.toLowerCase() === `${imp.toLowerCase()}.js`
  );

  if (foundExact) {
    console.log(`✅ OK: ${imp}`);
  } else if (foundCaseInsensitive) {
    console.warn(
      `⚠️ Case mismatch: import '${imp}' vs actual file '${foundCaseInsensitive}'`
    );
  } else {
    console.error(`❌ Missing: '${imp}.jsx' 파일이 존재하지 않습니다.`);
  }
}

console.log("\n✅ 검사가 완료되었습니다. 위에서 ⚠️ 또는 ❌ 항목을 확인하세요.");
