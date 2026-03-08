/**
 * FreeTrialModal i18n Content
 *
 * 무료 체험 모달의 모든 텍스트 콘텐츠를 영어/한국어/일본어로 관리
 */

import type { GlobalLocale } from '../../contexts/GlobalLanguageContext';

export interface FreeTrialModalContent {
  title: {
    part1: string;
    part2: string;
  };
  subtitle: {
    line1: string;
    line2: string;
  };
  noCreditCard: string; // "No credit card required" / "카드 등록 없이 시작" / "クレジットカード不要"
  buttons: {
    startTrial: string;
    startFree: string;
    loggingIn: string;
    creatingTrial: string;
  };
  errors: {
    trialAlreadyExists: string;
    loginRequired: string;
    trialCreationFailed: string;
    networkError: string;
  };
  infoText: {
    alreadyLoggedIn: string;
    dismissForever: string;
  };
}

const freeTrialModalContent: Record<GlobalLocale, FreeTrialModalContent> = {
  en: {
    title: {
      part1: 'Start with a',
      part2: '3-day free trial',
    },
    subtitle: {
      line1:
        'Start your free trial to load your selected design system through MCP and use all features free for 3 days.',
      line2: 'Start now with no credit card required.',
    },
    noCreditCard: 'No credit card required',
    buttons: {
      startTrial: 'Start Free Trial',
      startFree: 'Start Free',
      loggingIn: 'Logging in...',
      creatingTrial: 'Creating trial...',
    },
    errors: {
      trialAlreadyExists: 'You have already used the trial',
      loginRequired: 'Login required',
      trialCreationFailed: 'An error occurred while creating the trial',
      networkError: 'A network error occurred',
    },
    infoText: {
      alreadyLoggedIn: 'You are already logged in',
      dismissForever: "Don't show again",
    },
  },
  ko: {
    title: {
      part1: '로그인하면',
      part2: '3일간 무료체험이 가능해요',
    },
    subtitle: {
      line1:
        '무료체험을 시작하면 3일간 선택한 디자인 템플릿을 MCP로 불러와 모든 기능을 무료로 사용해볼 수 있어요.',
      line2: '카드 등록 없이 바로 시작해보세요.',
    },
    noCreditCard: '카드 등록 없이 시작',
    buttons: {
      startTrial: '무료체험 시작',
      startFree: '무료로 시작하기',
      loggingIn: '로그인 중...',
      creatingTrial: '체험 생성 중...',
    },
    errors: {
      trialAlreadyExists: '이미 체험을 사용했습니다',
      loginRequired: '로그인이 필요합니다',
      trialCreationFailed: '체험 생성 중 오류가 발생했습니다',
      networkError: '네트워크 오류가 발생했습니다',
    },
    infoText: {
      alreadyLoggedIn: '이미 로그인되어 있습니다',
      dismissForever: '다시 보지 않기',
    },
  },
  ja: {
    title: {
      part1: 'ログインすると',
      part2: '3日間無料で試せます',
    },
    subtitle: {
      line1:
        '無料体験を開始すると、選択したデザインテンプレートを MCP で読み込み、3日間すべての機能を無料で使えます。',
      line2: 'クレジットカード登録なしですぐに始められます。',
    },
    noCreditCard: 'クレジットカード不要',
    buttons: {
      startTrial: '無料トライアル開始',
      startFree: '無料で始める',
      loggingIn: 'ログイン中...',
      creatingTrial: 'トライアル作成中...',
    },
    errors: {
      trialAlreadyExists: 'すでにトライアルをご利用済みです',
      loginRequired: 'ログインが必要です',
      trialCreationFailed: 'トライアル作成中にエラーが発生しました',
      networkError: 'ネットワークエラーが発生しました',
    },
    infoText: {
      alreadyLoggedIn: 'すでにログインしています',
      dismissForever: '二度と表示しない',
    },
  },
};

export function getFreeTrialModalContent(locale: GlobalLocale): FreeTrialModalContent {
  return freeTrialModalContent[locale];
}
