/**
 * API Result 타입 시스템
 * 에러 유형을 명확히 구분하여 tool 핸들러가 적절한 메시지를 반환할 수 있게 함
 *
 * 기존 문제: apiFetch가 모든 실패를 null로 반환 → "라이선스 없음"으로 오해
 * 해결: 에러 코드 기반 분류로 auth/forbidden/not_found/server/network 구분
 */

// API 에러 코드 분류
export type ApiErrorCode =
  | 'AUTH_FAILED' // 401: 인증 실패 (API key 만료, 무효)
  | 'FORBIDDEN' // 403: 라이선스 미보유
  | 'NOT_FOUND' // 404: 리소스 없음
  | 'RATE_LIMITED' // 429: 요청 한도 초과
  | 'SERVER_ERROR' // 500: 서버 내부 오류
  | 'NETWORK_ERROR' // fetch 실패 (DNS, 타임아웃 등)
  | 'NOT_AUTHENTICATED'; // MCP 서버 로컬 인증 미완료

export interface ApiError {
  code: ApiErrorCode;
  status?: number;
  message: string;
}

// 성공/실패 구분이 가능한 Result 타입
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

/**
 * HTTP 상태 코드 → ApiErrorCode 매핑
 */
export function mapStatusToErrorCode(status: number): ApiErrorCode {
  if (status === 401) {
    return 'AUTH_FAILED';
  }
  if (status === 403) {
    return 'FORBIDDEN';
  }
  if (status === 404) {
    return 'NOT_FOUND';
  }
  if (status === 429) {
    return 'RATE_LIMITED';
  }
  return 'SERVER_ERROR';
}

/**
 * Tool 핸들러용 에러 메시지 포맷터
 * ApiError → 사용자 친화적 메시지 변환
 */
export function formatToolError(error: ApiError, context?: string): string {
  const prefix = context ? `[${context}] ` : '';

  switch (error.code) {
    case 'AUTH_FAILED':
    case 'NOT_AUTHENTICATED':
      return `${prefix}Authentication failed. Check your login session or API key and try again.`;
    case 'FORBIDDEN':
      return `${prefix}${error.message}`;
    case 'NOT_FOUND':
      return `${prefix}${error.message}`;
    case 'RATE_LIMITED':
      return `${prefix}Rate limit exceeded. Please wait a moment and try again.`;
    case 'SERVER_ERROR':
      return `${prefix}Server error (${error.status || 'unknown'}). Please try again later. Details: ${error.message}`;
    case 'NETWORK_ERROR':
      return `${prefix}Network error: ${error.message}. Check your internet connection.`;
    default:
      return `${prefix}Unexpected error: ${error.message}`;
  }
}
