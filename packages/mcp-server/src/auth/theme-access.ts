/**
 * Theme access configuration
 * SPEC-DEPLOY-001: 모든 테마 유료 - 인증 필수
 */

/**
 * 모든 프리미엄 테마 목록 (실제 존재하는 6개 테마만)
 * 인증된 사용자만 라이선스 보유 테마에 접근 가능
 */
export const PREMIUM_THEMES = [
  'bold-line',
  'classic-magazine',
  'dark-boldness',
  'editorial-tech',
  'minimal-workspace',
  'neutral-workspace',
  'pebble',
  'square-minimalism',
];

/**
 * 마스터 계정 이메일 목록
 * 마스터 계정은 모든 테마에 무제한 접근 가능
 */
export const MASTER_EMAILS = ['soo.kate.yeon@gmail.com'];

/**
 * 마스터 계정 여부 확인
 * @param email - 사용자 이메일
 * @returns 마스터 계정이면 true
 */
export function isMasterAccount(email: string): boolean {
  return MASTER_EMAILS.includes(email.toLowerCase());
}
