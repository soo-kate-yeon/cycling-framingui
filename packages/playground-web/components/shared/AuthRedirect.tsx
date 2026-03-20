'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 로그인된 사용자를 홈 랜딩으로 리디렉트하는 클라이언트 컴포넌트.
 * 비로그인 시에는 아무것도 렌더링하지 않음 — LandingPage는 서버에서 이미 렌더링됨.
 */
export function AuthRedirect() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // 로그인된 사용자: 리디렉트 대기 중 로딩 오버레이 표시
  if (isLoading || user) {
    return (
      <div className="fixed inset-0 z-[9999] min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-2xl font-bold tracking-tighter mb-4 animate-pulse">TEKTON</div>
        </div>
      </div>
    );
  }

  return null;
}
