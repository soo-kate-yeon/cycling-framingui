/**
 * Pricing Page i18n Content
 *
 * 가격 페이지의 모든 텍스트 콘텐츠를 영어/한국어/일본어로 관리
 */

import type { GlobalLocale } from '../../contexts/GlobalLanguageContext';

export interface PricingContent {
  nav: {
    brandName: string;
    getStarted: string;
  };
  hero: {
    title: string;
    description: string;
  };
  betaBanner: {
    mobile: string;
    desktop: string;
  };
  plans: {
    single: {
      name: string;
      description: string;
      priceLabel: string;
      priceSub: string;
      cta: string;
      features: string[];
    };
    double: {
      name: string;
      description: string;
      priceLabel: string;
      priceSub: string;
      cta: string;
      badge: string;
      features: string[];
    };
    creator: {
      name: string;
      description: string;
      priceLabel: string;
      priceSub: string;
      cta: string;
      badge: string;
      features: string[];
      renewalNotice: string;
    };
  };
  comparison: {
    title: string;
    tableHeaders: {
      feature: string;
      single: string;
      double: string;
      creator: string;
    };
    features: {
      templatesIncluded: string;
      futureTemplates: string;
      updateDuration: string;
      commercialUse: string;
      emailSupport: string;
      priorityQueue: string;
      communityDiscord: string;
      documentation: string;
    };
    values: {
      single: {
        templatesIncluded: string;
        updateDuration: string;
        emailSupport: string;
      };
      double: {
        templatesIncluded: string;
        updateDuration: string;
        emailSupport: string;
      };
      creator: {
        templatesIncluded: string;
        updateDuration: string;
        emailSupport: string;
      };
    };
  };
  faq: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      content: string;
    }[];
  };
  ui: {
    freeLabel: string;
    duringBeta: string;
    getBetaAccess: string;
    paymentNotReady: string;
    priceConfigMissing: string;
  };
}

const pricingContent: Record<GlobalLocale, PricingContent> = {
  en: {
    nav: {
      brandName: 'framingui',
      getStarted: 'Get Started',
    },
    hero: {
      title: 'Choose your plan',
      description:
        'Premium React templates with AI-powered design system. Start building production-ready interfaces today.',
    },
    betaBanner: {
      mobile: '🎉 Single Template FREE!',
      desktop: '🎉 Beta Launch: Single Template FREE during beta period!',
    },
    plans: {
      single: {
        name: 'Single Template',
        description: 'Start with the perfect template for your project.',
        priceLabel: '$59',
        priceSub: 'one-time payment',
        cta: 'Browse Templates',
        features: [
          '1 template of your choice',
          '1 year of updates',
          'Commercial use',
          'Email support (72h)',
        ],
      },
      double: {
        name: 'Double Package',
        description: 'Best value for developers who need more.',
        priceLabel: '$99',
        priceSub: 'one-time payment',
        cta: 'Choose Templates',
        badge: 'Most Popular',
        features: [
          '2 templates of your choice',
          '1 year of updates',
          'Commercial use',
          'Email support (72h)',
          'Save vs. buying separately',
        ],
      },
      creator: {
        name: 'Creator Pass',
        description: 'Unlimited access for prolific builders.',
        priceLabel: '$149',
        priceSub: '/year',
        cta: 'Subscribe',
        badge: 'Best Value',
        features: [
          'All current templates',
          'All future templates included',
          'Updates during subscription',
          'Priority email support (48h)',
          'Priority support queue',
        ],
        renewalNotice: 'Auto-renews at $149/year. Cancel anytime.',
      },
    },
    comparison: {
      title: 'Compare plans',
      tableHeaders: {
        feature: 'Feature',
        single: 'Single',
        double: 'Double',
        creator: 'Creator Pass',
      },
      features: {
        templatesIncluded: 'Templates included',
        futureTemplates: 'Future templates',
        updateDuration: 'Update duration',
        commercialUse: 'Commercial use',
        emailSupport: 'Email support',
        priorityQueue: 'Priority queue',
        communityDiscord: 'Community Discord',
        documentation: 'Documentation',
      },
      values: {
        single: {
          templatesIncluded: '1',
          updateDuration: '1 year',
          emailSupport: '72h',
        },
        double: {
          templatesIncluded: '2',
          updateDuration: '1 year',
          emailSupport: '72h',
        },
        creator: {
          templatesIncluded: 'All',
          updateDuration: 'Subscription',
          emailSupport: '48h',
        },
      },
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about our pricing and plans.',
      items: [
        {
          title: 'How do I use the templates?',
          content:
            'After purchasing a template (1 free during beta), run "npx @framingui/mcp-server init" in your project. This installs the MCP server, sets up design tokens, configures Tailwind CSS, and registers the server with your AI coding tool — all in one command. Then just ask your AI agent to generate screens using your chosen theme.',
        },
        {
          title: 'What happens after my update period ends?',
          content:
            "You keep full access to the templates you downloaded. You just won't receive new updates. You can renew anytime to get the latest versions.",
        },
        {
          title: 'Can I use templates in client projects?',
          content:
            'Yes! All plans include a commercial license. You can use templates in unlimited personal and client projects. The only restriction is you cannot resell or redistribute the templates themselves.',
        },
        {
          title: 'How does Creator Pass auto-renewal work?',
          content:
            'Creator Pass renews automatically every year at $149/year. You can cancel anytime from your account settings — cancellation takes effect at the end of your current billing period, and you keep access until then.',
        },
        {
          title: 'What is your refund policy?',
          content:
            'Since templates are digital products, refunds are available before download within 14 days of purchase. Technical defects and duplicate purchases are always eligible for refund. See our full refund policy for details.',
        },
        {
          title: 'Do you offer team or education discounts?',
          content:
            'Team licenses and education discounts are coming soon. Contact us at soo.kate.yeon@gmail.com for early access or custom pricing.',
        },
      ],
    },
    ui: {
      freeLabel: 'FREE',
      duringBeta: 'during beta',
      getBetaAccess: 'Get Beta Access - FREE',
      paymentNotReady: 'Payment system is not ready. Please try again later.',
      priceConfigMissing: 'Price configuration missing. Please contact support.',
    },
  },
  ko: {
    nav: {
      brandName: 'framingui',
      getStarted: '시작하기',
    },
    hero: {
      title: '플랜을 선택하세요',
      description:
        'mcp installation을 지원하며 에이전틱 코딩에 특화된 디자인 시스템이 포함됩니다. 디자인 토큰과 레이아웃, 30개 이상의 사전 제작 컴포넌트로 일관된 프로덕션 UI를 바로 만들어보세요.',
    },
    betaBanner: {
      mobile: '템플릿 1개를 3일간 무제한 사용할 수 있어요',
      desktop: '템플릿 1개를 3일간 무제한 사용할 수 있어요',
    },
    plans: {
      single: {
        name: '템플릿 개별 구매',
        description: '프로젝트에 적용할 템플릿 1개를 선택해 무제한으로 이용하세요.',
        priceLabel: '$59',
        priceSub: '1회 결제',
        cta: '템플릿 둘러보기',
        features: [
          '원하는 템플릿 1개',
          '1년간 업데이트',
          '상업적 사용 가능',
          '이메일 지원 (72시간)',
        ],
      },
      double: {
        name: '1+1 혜택가',
        description: '2개 이상 프로젝트를 진행하시는 분들을 위해 개별 구매보다 합리적인 가격으로 준비했어요.',
        priceLabel: '$99',
        priceSub: '1회 결제',
        cta: '템플릿 선택하기',
        badge: '인기 플랜',
        features: [
          '원하는 템플릿 2개',
          '1년간 업데이트',
          '상업적 사용 가능',
          '이메일 지원 (72시간)',
          '개별 구매 대비 16% 할인',
        ],
      },
      creator: {
        name: '크리에이터 패스',
        description: '여러개 프로젝트를 동시에 진행하거나, 다양한 템플릿을 동시에 이용해보고 싶으시다면 추천드려요.',
        priceLabel: '$149',
        priceSub: '/년',
        cta: '구독하기',
        badge: '최고의 가치',
        features: [
          '현재 제공되는 모든 템플릿',
          '향후 출시 템플릿 포함',
          '구독 기간 동안 업데이트 제공',
          '빠른 이메일 지원 (48시간)',
          '우선 지원',
        ],
        renewalNotice: '연 $149로 자동 갱신됩니다. 언제든지 해지할 수 있습니다.',
      },
    },
    comparison: {
      title: '플랜 비교',
      tableHeaders: {
        feature: '기능',
        single: '단일',
        double: '더블',
        creator: '크리에이터 패스',
      },
      features: {
        templatesIncluded: '포함된 템플릿',
        futureTemplates: '향후 템플릿',
        updateDuration: '업데이트 기간',
        commercialUse: '상업적 사용',
        emailSupport: '이메일 지원',
        priorityQueue: '우선 큐',
        communityDiscord: '커뮤니티 Discord',
        documentation: '문서',
      },
      values: {
        single: {
          templatesIncluded: '1개',
          updateDuration: '1년',
          emailSupport: '72시간',
        },
        double: {
          templatesIncluded: '2개',
          updateDuration: '1년',
          emailSupport: '72시간',
        },
        creator: {
          templatesIncluded: '전체',
          updateDuration: '구독 기간',
          emailSupport: '48시간',
        },
      },
    },
    faq: {
      title: '자주 묻는 질문',
      subtitle: '가격과 플랜 관련 주요 질문을 정리했습니다.',
      items: [
        {
          title: '템플릿은 어떻게 사용하나요?',
          content:
            '템플릿을 구매한 후 프로젝트 루트에서 "npx @framingui/mcp-server init" 명령을 실행하세요. MCP 서버 설치 및 사용하시는 AI 코딩 도구 (Claude Code, Codex 등)에 맞춰서 자동으로 실행 준비가 완료됩니다. 이후 브라우저 인증 진행 후, 보유한 템플릿으로 화면 생성을 요청하면 됩니다.',
        },
        {
          title: '업데이트 기간이 끝나면 어떻게 되나요?',
          content:
            '다운로드한 템플릿은 계속 사용할 수 있습니다. 업데이트 기간 종료 후에는 신규 업데이트만 중단됩니다. 갱신하면 최신 버전을 다시 받을 수 있습니다.',
        },
        {
          title: '클라이언트 프로젝트에도 사용할 수 있나요?',
          content:
            '모든 플랜에는 상업용 라이선스가 포함됩니다. 개인 프로젝트와 클라이언트 프로젝트 모두에서 사용할 수 있습니다. 단, 템플릿 자체의 재판매 또는 재배포는 허용하지 않습니다.',
        },
        {
          title: '크리에이터 패스 자동 갱신은 어떻게 되나요?',
          content:
            '크리에이터 패스는 매년 $149에 자동으로 갱신됩니다. 계정 설정에서 언제든 취소할 수 있으며, 취소는 현재 결제 기간 종료 시점에 적용됩니다. 종료 시점까지는 계속 이용할 수 있습니다.',
        },
        {
          title: '환불은 어떻게 받을 수 있나요?',
          content:
            '템플릿은 디지털 제품이므로 구매 후 14일 이내이며 다운로드 전 상태라면 환불할 수 있습니다. 기술적 결함 또는 중복 구매는 항상 환불 대상입니다. 상세 기준은 환불 정책에서 확인할 수 있습니다.',
        },
        {
          title: '팀 또는 교육 할인이 있나요?',
          content:
            '팀 라이선스와 교육 할인은 준비 중입니다. 사전 도입 또는 맞춤 가격이 필요하면 soo.kate.yeon@gmail.com으로 문의해 주세요.',
        },
      ],
    },
    ui: {
      freeLabel: '무료',
      duringBeta: '베타 기간 한정',
      getBetaAccess: '베타 무료로 시작하기',
      paymentNotReady: '결제 시스템을 아직 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
      priceConfigMissing: '가격 설정을 찾을 수 없습니다. 지원팀에 문의해 주세요.',
    },
  },
  ja: {
    nav: {
      brandName: 'framingui',
      getStarted: '始める',
    },
    hero: {
      title: 'プランを選択',
      description:
        'MCP インストールに対応し、エージェントコーディングに特化したデザインシステムが含まれます。デザイントークン、レイアウト、30 以上の既製コンポーネントで、一貫した本番 UI をすぐ作れます。',
    },
    betaBanner: {
      mobile: 'テンプレート1つを3日間、無制限で使えます',
      desktop: 'テンプレート1つを3日間、無制限で使えます',
    },
    plans: {
      single: {
        name: 'テンプレート単品',
        description: 'プロジェクトに適用するテンプレートを1つ選んで、無制限で使えます。',
        priceLabel: '$59',
        priceSub: '買い切り',
        cta: 'テンプレートを見る',
        features: [
          '好きなテンプレート 1 つ',
          '1年間のアップデート',
          '商用利用可',
          'メールサポート（72時間）',
        ],
      },
      double: {
        name: '1+1 お得プラン',
        description: '2つ以上のプロジェクトを進める方に向けて、個別購入より手頃な価格でご用意しました。',
        priceLabel: '$99',
        priceSub: '買い切り',
        cta: 'テンプレートを選ぶ',
        badge: '人気プラン',
        features: [
          '好きなテンプレート 2 つ',
          '1年間のアップデート',
          '商用利用可',
          'メールサポート（72時間）',
          '個別購入より16% 割引',
        ],
      },
      creator: {
        name: 'Creator Pass',
        description: '複数プロジェクトを同時進行したい方や、いろいろなテンプレートを試したい方におすすめです。',
        priceLabel: '$149',
        priceSub: '/年',
        cta: '購読する',
        badge: 'ベストバリュー',
        features: [
          '現在の全テンプレート',
          '今後のテンプレートも含む',
          '購読期間中アップデート提供',
          '優先メールサポート（48時間）',
          '優先サポートキュー',
        ],
        renewalNotice: '毎年 $149 で自動更新されます。いつでも解約できます。',
      },
    },
    comparison: {
      title: 'プラン比較',
      tableHeaders: {
        feature: '機能',
        single: 'Single',
        double: 'Double',
        creator: 'Creator Pass',
      },
      features: {
        templatesIncluded: '含まれるテンプレート',
        futureTemplates: '今後のテンプレート',
        updateDuration: 'アップデート期間',
        commercialUse: '商用利用',
        emailSupport: 'メールサポート',
        priorityQueue: '優先キュー',
        communityDiscord: 'コミュニティ Discord',
        documentation: 'ドキュメント',
      },
      values: {
        single: {
          templatesIncluded: '1',
          updateDuration: '1年',
          emailSupport: '72時間',
        },
        double: {
          templatesIncluded: '2',
          updateDuration: '1年',
          emailSupport: '72時間',
        },
        creator: {
          templatesIncluded: 'すべて',
          updateDuration: '購読期間',
          emailSupport: '48時間',
        },
      },
    },
    faq: {
      title: 'よくある質問',
      subtitle: '料金とプランに関する主な質問をまとめました。',
      items: [
        {
          title: 'テンプレートはどう使いますか？',
          content:
            'テンプレート購入後、プロジェクトルートで「npx @framingui/mcp-server init」を実行してください。MCP サーバーのセットアップと、Claude Code や Codex など使用中の AI コーディングツールへの接続が自動で完了します。その後ブラウザ認証を済ませれば、保有テンプレートで画面生成を依頼できます。',
        },
        {
          title: 'アップデート期間終了後はどうなりますか？',
          content:
            'ダウンロード済みテンプレートは継続利用できます。期間終了後は新規アップデートのみ停止されます。必要な時に更新プランへ切り替えられます。',
        },
        {
          title: 'クライアント案件で使えますか？',
          content:
            'はい。すべてのプランに商用ライセンスが含まれます。個人案件とクライアント案件の両方で使えます。テンプレート自体の再販売・再配布のみ不可です。',
        },
        {
          title: 'Creator Pass の自動更新はどうなりますか？',
          content:
            'Creator Pass は毎年 $149 で自動更新されます。アカウント設定からいつでも解約でき、解約は現在の請求期間終了時に反映されます。',
        },
        {
          title: '返金ポリシーはどうなっていますか？',
          content:
            'テンプレートはデジタル商品なので、購入後14日以内かつ未ダウンロードの場合に返金できます。技術的欠陥と重複購入は常に返金対象です。',
        },
        {
          title: 'チーム割引や教育割引はありますか？',
          content:
            'チームライセンスと教育割引は準備中です。早期導入や個別見積りは soo.kate.yeon@gmail.com までお問い合わせください。',
        },
      ],
    },
    ui: {
      freeLabel: '無料',
      duringBeta: 'ベータ期間限定',
      getBetaAccess: 'ベータ無料トライアル開始',
      paymentNotReady: '決済システムを利用できません。しばらくしてから再試行してください。',
      priceConfigMissing: '価格設定が見つかりません。サポートへお問い合わせください。',
    },
  },
};

export function getPricingContent(locale: GlobalLocale): PricingContent {
  return pricingContent[locale];
}
