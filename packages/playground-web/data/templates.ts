/**
 * Template Data Configuration
 *
 * 각 템플릿의 상세 정보를 관리하는 중앙 데이터 소스
 * - 가격, 설명, 추천 사용처, 설치 가이드
 * - Supabase Storage 이미지 URL 헬퍼
 */

type TemplateLocale = 'en' | 'ko' | 'ja';

// ============================================================================
// Types
// ============================================================================

export interface TemplateData {
  id: string;
  name: string;
  tagline: string;
  taglineKo?: string;
  taglineJa?: string;
  description: string;
  descriptionKo?: string;
  descriptionJa?: string;
  price: number;
  screenshots: string[];
  features: {
    icon: string;
    title: string;
    titleKo?: string;
    titleJa?: string;
    subtitle: string;
    subtitleKo?: string;
    subtitleJa?: string;
    description: string;
    descriptionKo?: string;
    descriptionJa?: string;
  }[];
  recommendedFor: {
    title: string;
    titleKo?: string;
    titleJa?: string;
    description: string;
    descriptionKo?: string;
    descriptionJa?: string;
  }[];
  howToUse: {
    step: number;
    title: string;
    titleKo?: string;
    titleJa?: string;
    description: string;
    descriptionKo?: string;
    descriptionJa?: string;
    code?: string;
  }[];
}

// ============================================================================
// Supabase Storage Helper
// ============================================================================

/**
 * Supabase Storage 공개 URL 생성
 *
 * @param templateId - 템플릿 ID
 * @param filename - 스크린샷 파일명
 * @returns Supabase Storage 공개 URL
 */
export function getScreenshotUrl(templateId: string, filename: string): string {
  return `/screenshots/${templateId}/${filename}`;
}

// ============================================================================
// Shared How To Use Steps (MCP Server Installation)
// ============================================================================

const SHARED_HOW_TO_USE = [
  {
    step: 1,
    title: 'Install MCP Server',
    titleKo: 'MCP 서버 설치',
    titleJa: 'MCPサーバーのインストール',
    description: 'Add the FramingUI MCP server to Claude Code with one command.',
    descriptionKo: '명령어 한 줄로 FramingUI MCP 서버를 Claude Code에 바로 추가하세요.',
    descriptionJa: 'コマンド一行でFramingUI MCPサーバーをClaude Codeにすぐ追加できます。',
    code: 'npx @framingui/mcp-server init',
  },
  {
    step: 2,
    title: 'Log in & Authenticate',
    titleKo: '로그인 & 인증',
    titleJa: 'ログイン＆認証',
    description: 'Sign in via Claude Code to activate your licensed themes.',
    descriptionKo: 'Claude Code에서 로그인하여 라이선스 테마를 활성화하세요.',
    descriptionJa: 'Claude Codeでログインしてライセンステーマを有効化してください。',
  },
];

// ============================================================================
// Template Data
// ============================================================================

export const TEMPLATES: Record<string, TemplateData> = {
  'square-minimalism': {
    id: 'square-minimalism',
    name: 'Square Minimalism',
    tagline: 'Bold, geometric, high-contrast design system',
    taglineKo: '곡선 없이 깔끔하고 정돈된 인터페이스',
    taglineJa: '曲線なしのクリーンで整ったインターフェース',
    description:
      'A minimalist design system featuring sharp corners and high contrast. Ideal for dashboards and admin tools where function comes first.',
    descriptionKo:
      '모든 모서리를 직각으로 처리해 군더더기 없이 깔끔한 디자인 시스템이에요. 대비가 뚜렷해 복잡한 데이터를 다루는 대시보드나 관리자 페이지처럼 기능이 가장 중요한 화면에 잘 어울려요.',
    descriptionJa:
      'すべての角を直角に処理し、無駄のないクリーンなデザインシステムです。コントラストが明確で、複雑なデータを扱うダッシュボードや管理者ページなど、機能が最重要な画面に最適です。',
    price: 59,
    screenshots: [
      getScreenshotUrl('square-minimalism', 'dashboard.webp'),
      getScreenshotUrl('square-minimalism', 'components.webp'),
      getScreenshotUrl('square-minimalism', 'magazine.webp'),
    ],
    features: [
      {
        icon: '1',
        title: '30 Production-Ready Components',
        titleKo: '바로 실무에 쓸 수 있는 30개의 컴포넌트',
        titleJa: 'すぐに実務で使える30個のコンポーネント',
        subtitle: 'Shadcn-UI based React component library',
        subtitleKo: 'Shadcn-UI를 기반으로 한 완성도 높은 React 컴포넌트',
        subtitleJa: 'Shadcn-UIベースの完成度の高いReactコンポーネント',
        description:
          'Includes 30 reusable components like Button, Input, Card, and Modal. Fully typed with TypeScript and follows accessibility standards. Each component supports dark mode and is highly customizable.',
        descriptionKo:
          '버튼, 인풋, 카드, 모달 등 30가지 필수 컴포넌트를 바로 사용해 보세요. 완벽한 TypeScript 타입 지원은 물론, 다크 모드와 웹 접근성 표준까지 꼼꼼하게 챙겼어요.',
        descriptionJa:
          'ボタン、インプット、カード、モーダルなど30種類の必須コンポーネントをすぐに使えます。完全なTypeScript型サポートはもちろん、ダークモードとWebアクセシビリティ標準もしっかり対応しています。',
      },
      {
        icon: '2',
        title: '13 Pre-built Layouts',
        titleKo: '13가지 필수 페이지 레이아웃',
        titleJa: '13種類の必須ページレイアウト',
        subtitle: 'Common page layouts for rapid development',
        subtitleKo: '자주 쓰이는 화면들로 빠르게 시작하기',
        subtitleJa: 'よく使う画面ですぐに始められる',
        description:
          'Complete layouts for Landing, Dashboard, Auth, and Profile pages. Fully responsive from mobile to desktop. Ready to use with simple copy-paste.',
        descriptionKo:
          '랜딩, 대시보드, 로그인, 프로필 등 13가지 완성된 페이지 레이아웃을 제공해요. 모든 테마에 적용되는 동일한 공통 구조라 언제든 완벽하게 호환됩니다.',
        descriptionJa:
          'ランディング、ダッシュボード、ログイン、プロフィールなど13種類の完成されたページレイアウトを提供します。すべてのテーマに適用される共通構造なので、いつでも完全に互換性があります。',
      },
      {
        icon: '3',
        title: 'MCP Server Integration',
        titleKo: 'MCP 서버 통합',
        titleJa: 'MCPサーバー統合',
        subtitle: 'Generate UI with natural language in Claude Code',
        subtitleKo: '프롬프트만으로 UI 바로 완성하기',
        subtitleJa: 'プロンプトだけでUIをすぐに完成',
        description:
          'Integrated with FramingUI MCP server. Generate UIs using natural language prompts in Claude Code. Simply ask "Create a dashboard with Square Minimalism theme" and get instant code.',
        descriptionKo:
          'FramingUI MCP 서버가 통합되어 있어 Claude Code에 말로만 설명해도 화면이 만들어져요. "Square Minimalism 테마로 대시보드를 짜줘"라고 요청하면 코드가 바로 완성됩니다.',
        descriptionJa:
          'FramingUI MCPサーバーが統合されていて、Claude Codeに言葉で説明するだけで画面が作れます。「Square Minimalismテーマでダッシュボードを作って」とリクエストすればコードがすぐに完成します。',
      },
      {
        icon: '4',
        title: 'Design Token System',
        titleKo: '체계적인 디자인 토큰',
        titleJa: '体系的なデザイントークン',
        subtitle: 'CSS variable-based consistent styling',
        subtitleKo: 'CSS 변수로 관리하는 일관된 스타일',
        subtitleJa: 'CSS変数で管理する一貫したスタイル',
        description:
          'All colors, spacing, and typography defined as CSS variables. Change your brand color once and the entire theme updates automatically. Dark mode is as simple as variable switching.',
        descriptionKo:
          '색상, 간격, 폰트 스타일이 모두 CSS 변수로 관리돼요. 테마 설정에서 브랜드 컬러만 살짝 바꿔주면 전체 화면의 테마가 한 번에 완성됩니다.',
        descriptionJa:
          '色、間隔、フォントスタイルがすべてCSS変数で管理されています。テーマ設定でブランドカラーを少し変えるだけで、画面全体のテーマが一度に完成します。',
      },
      {
        icon: '5',
        title: 'Theme-Matched Icons',
        titleKo: '테마에 꼭 맞는 아이콘',
        titleJa: 'テーマにぴったりのアイコン',
        subtitle: 'Lucide React icons auto-adapted to theme',
        subtitleKo: '테마 분위기에 알아서 맞춰지는 Lucide 아이콘',
        subtitleJa: 'テーマの雰囲気に自動で合わせるLucideアイコン',
        description:
          'Over 500 Lucide React icons optimized for the theme design language. Icon size, stroke, and color perfectly harmonized with the theme aesthetic.',
        descriptionKo:
          '500개가 넘는 Lucide React 아이콘들이 테마에 꼭 맞게 설정되어 있어요. 크기나 선 굵기, 색상을 일일이 조정할 필요 없이 자연스럽게 어우러집니다.',
        descriptionJa:
          '500種類以上のLucide Reactアイコンがテーマにぴったり設定されています。サイズや線の太さ、色を一つひとつ調整する必要なく、自然に馴染みます。',
      },
      {
        icon: '6',
        title: 'Responsive Layout Tokens',
        titleKo: '완벽한 반응형 레이아웃',
        titleJa: '完璧なレスポンシブレイアウト',
        subtitle: 'Auto-responsive from mobile to desktop',
        subtitleKo: '기기 크기에 맞춰 알아서 변하는 화면',
        subtitleJa: 'デバイスサイズに合わせて自動で変わる画面',
        description:
          'Integrated layout tokens with Tailwind CSS responsive utilities. Ask the MCP server "1 column on mobile, 2 on tablet" and it implements automatically.',
        descriptionKo:
          'Tailwind CSS 기반으로 완벽한 반응형 유틸리티를 지원해요. AI에게 "모바일은 1열, 태블릿은 2열로 해줘"라고 말하기만 하면 알아서 화면 크기에 맞춰 코드를 짭니다.',
        descriptionJa:
          'Tailwind CSSベースで完全なレスポンシブユーティリティをサポートします。AIに「モバイルは1列、タブレットは2列にして」と言うだけで、画面サイズに合わせてコードを自動で作成します。',
      },
    ],
    recommendedFor: [
      {
        title: 'SaaS Dashboards & Admin Panels',
        titleKo: 'SaaS 대시보드 및 어드민 패널',
        titleJa: 'SaaSダッシュボード＆アドミンパネル',
        description:
          'Clear hierarchy and high contrast effectively display data. Charts and tables stand out, action buttons are clearly distinguished.',
        descriptionKo:
          '정보의 위계와 대비가 뚜렷해 수많은 데이터를 다루기에 좋아요. 복잡한 표나 차트도 눈에 쉽게 들어오고, 클릭해야 할 버튼이 명확해집니다.',
        descriptionJa:
          '情報の階層とコントラストが明確で、多くのデータを扱うのに最適です。複雑な表やチャートも目に入りやすく、クリックすべきボタンが明確になります。',
      },
      {
        title: 'Professional B2B Applications',
        titleKo: '전문적인 B2B 웹 서비스',
        titleJa: 'プロフェッショナルなB2B Webサービス',
        description:
          'Trustworthy minimalist design suited for business users. Focus on functionality without unnecessary decoration.',
        descriptionKo:
          '화려한 장식 없이 기능에만 집중하게 해주는 미니멀 디자인이에요. 비즈니스 고객에게 강한 신뢰감을 줄 수 있어요.',
        descriptionJa:
          '華やかな装飾なしに機能だけに集中できるミニマルデザインです。ビジネスユーザーに強い信頼感を与えることができます。',
      },
      {
        title: 'Rapid Prototyping',
        titleKo: '빠른 프로토타이핑',
        titleJa: '素早いプロトタイピング',
        description:
          'Minimal styling enables quick idea validation. Focus on feature development instead of design decisions.',
        descriptionKo:
          '깔끔하고 기본적인 스타일만 담아 아이디어를 빠르게 구현하고 검증할 때 좋아요. 디자인 고민은 줄이고 핵심 기능 개발에 집중해 보세요.',
        descriptionJa:
          'シンプルで基本的なスタイルだけを含んでいるので、アイデアを素早く実装・検証するのに最適です。デザインの悩みを減らし、コア機能の開発に集中しましょう。',
      },
      {
        title: 'Accessibility-First Projects',
        titleKo: '접근성 중심 프로젝트',
        titleJa: 'アクセシビリティ重視のプロジェクト',
        description:
          'High color contrast (AAA rating) ensures usability for visually impaired users. Full keyboard navigation and screen reader support.',
        descriptionKo:
          '어떤 환경에서도 누구나 쉽게 볼 수 있도록 가장 높은 수준의 색상 대비(AAA 등급)를 적용했어요. 키보드 조작과 스크린 리더 지원 또한 완벽합니다.',
        descriptionJa:
          'どんな環境でも誰でも見やすいよう、最高水準のカラーコントラスト（AAA等級）を適用しています。キーボード操作とスクリーンリーダーのサポートも完璧です。',
      },
    ],
    howToUse: [
      ...SHARED_HOW_TO_USE,
      {
        step: 3,
        title: 'Ask Claude to Build Your Screen',
        titleKo: 'Claude에게 원하는 화면 만들어 달라고 하기',
        titleJa: 'Claudeに作りたい画面をお願いする',
        description:
          'Whatever screen you need — login, blog, landing page, or dashboard — just ask. FramingUI composes CSS variables, icon library, components, and screen templates into production-ready UI.',
        descriptionKo:
          '로그인 화면이든, 블로그든, 랜딩페이지든, 대시보드든 만들고 싶은 화면을 요청하시면 FramingUI가 알아서 CSS 변수, 아이콘 라이브러리, 컴포넌트, 화면 템플릿을 조합해 프로덕션급 UI를 만들어요.',
        descriptionJa:
          'ログイン画面でも、ブログでも、ランディングページでも、ダッシュボードでも、作りたい画面をリクエストするだけ。FramingUIがCSS変数、アイコンライブラリ、コンポーネント、画面テンプレートを組み合わせてプロダクション品質のUIを作ります。',
        code: '"square-minimalism 테마로 사이드바 대시보드 만들어줘"',
      },
    ],
  },

  'editorial-tech': {
    id: 'editorial-tech',
    name: 'Editorial Tech',
    tagline: 'Lucid, airy, typography-first rational design',
    taglineKo: '글이 술술 읽히는 타이포그래피 중심 인터페이스',
    taglineJa: '文章がスラスラ読めるタイポグラフィ中心のインターフェース',
    description:
      'An elegant design system built for readability. Bold headings and generous white space make it ideal for technical blogs, documentation, and long-form content.',
    descriptionKo:
      '시원한 제목과 넉넉한 여백으로 읽는 경험을 극대화했어요. 기술 블로그, 공식 문서, 아티클처럼 긴 글이 중심이 되는 서비스에 안성맞춤입니다.',
    descriptionJa:
      'すっきりした見出しと余裕のある余白で、読む体験を最大化しました。技術ブログ、公式ドキュメント、記事など、長文が中心のサービスに最適です。',
    price: 59,
    screenshots: [
      getScreenshotUrl('editorial-tech', 'dashboard.webp'),
      getScreenshotUrl('editorial-tech', 'components.webp'),
      getScreenshotUrl('editorial-tech', 'solutions.webp'),
    ],
    features: [
      {
        icon: '1',
        title: 'Airy Canvas Layouts',
        titleKo: '여유로운 캔버스 레이아웃',
        titleJa: '余裕のあるキャンバスレイアウト',
        subtitle: 'Generous padding and wide margins',
        subtitleKo: '시원하고 넉넉한 여백',
        subtitleJa: 'すっきりとした余裕のある余白',
        description:
          'Features a systematic approach to white space, treating the screen as an open, breathable canvas that gives content maximum clarity.',
        descriptionKo:
          '여백도 하나의 디자인 요소로 활용했습니다. 꽉 막힌 느낌 없이 화면을 한 폭의 여유로운 캔버스처럼 사용해 글에 온전히 집중하게 해줘요.',
        descriptionJa:
          '余白もデザイン要素として活用しています。窮屈な感じなく、画面を余裕のあるキャンバスのように使い、文章に完全に集中できます。',
      },
      {
        icon: '2',
        title: 'Typography-First Hierarchy',
        titleKo: '폰트 중심의 정보 구조',
        titleJa: 'フォント中心の情報構造',
        subtitle: 'Big clean headings, high legibility',
        subtitleKo: '시원한 제목과 뛰어난 가독성',
        subtitleJa: 'すっきりした見出しと優れた可読性',
        description:
          'Information architecture driven entirely by font scales, weights, and tracking. Achieves logical separation without relying on heavy borders or backgrounds.',
        descriptionKo:
          '폰트 크기와 굵기, 자간만으로 깔끔하게 정보를 구분했어요. 두꺼운 테두리나 배경색 없이 여백과 글꼴의 변화만으로 논리적인 레이아웃을 구현해요.',
        descriptionJa:
          'フォントサイズと太さ、字間だけでスッキリと情報を区別しています。太い枠線や背景色なしに、余白とフォントの変化だけで論理的なレイアウトを実現します。',
      },
      {
        icon: '3',
        title: 'Systematic Neutrals',
        titleKo: '정돈된 무채색 팔레트',
        titleJa: '整った無彩色パレット',
        subtitle: 'Pure grays with stark contrast',
        subtitleKo: '배경과 글을 분리해 주는 담백한 그레이톤',
        subtitleJa: '背景とテキストを分ける淡白なグレートーン',
        description:
          'A restrained, intellectual palette reliant on neutral 950s and pure white canvases to emphasize the content rather than the container.',
        descriptionKo:
          '화려한 배경 대신 순백색 캔버스와 짙은 회색(뉴트럴 950) 텍스트를 조합했어요. 내용 그 자체를 가장 돋보이게 하는 차분하고 지적인 컬러 조합이에요.',
        descriptionJa:
          '派手な背景の代わりに純白のキャンバスと濃いグレー（ニュートラル950）のテキストを組み合わせました。内容そのものを最も引き立てる、落ち着いた知的なカラーの組み合わせです。',
      },
      {
        icon: '4',
        title: 'Measured Curves',
        titleKo: '세련된 곡선 감각',
        titleJa: '洗練された曲線感覚',
        subtitle: 'Alloy of sharp logic and human circularity',
        subtitleKo: '각진 레이아웃 속 부드러운 포인트',
        subtitleJa: '角張ったレイアウトの中の柔らかいアクセント',
        description:
          'Select components feature distinct pill shapes (rounded-full) functioning as accents amidst an otherwise sharp, geometric environment.',
        descriptionKo:
          '딱딱해 보일 수 있는 반듯한 화면 속에, 둥근 알약 모양(rounded-full) 버튼과 칩을 포인트로 넣어 부드러운 감각을 더했어요.',
        descriptionJa:
          '硬く見えがちな整った画面の中に、丸いピル形状（rounded-full）のボタンとチップをアクセントとして加え、柔らかな感覚を演出しています。',
      },
    ],
    recommendedFor: [
      {
        title: 'Design Portfolios & Agencies',
        titleKo: '디자인 포트폴리오 및 에이전시',
        titleJa: 'デザインポートフォリオ＆エージェンシー',
        description:
          'Lets the work speak for itself by removing UI clutter and focusing purely on the visual content and underlying grid.',
        descriptionKo:
          '화려한 UI를 덜어내고 텍스트와 이미지에만 시선이 가도록 만들었어요. 올려둔 작업물이 스스로 빛날 수 있게 해줍니다.',
        descriptionJa:
          '華やかなUIを取り除き、テキストと画像だけに視線が向くよう設計しています。掲載した作品が自ら輝けるようにします。',
      },
      {
        title: 'In-Depth Reading Material',
        titleKo: '심도 있는 읽을거리',
        titleJa: '深みのある読み物',
        description:
          'Perfect for long-form essays, tech journalism, or in-depth newsletters that demand sustained reader focus.',
        descriptionKo:
          '흐름이 끊기지 않고 푹 빠져 읽어야 하는 긴 에세이, 기술 블로그, 심층 뉴스레터를 발행할 때 강력히 추천해요.',
        descriptionJa:
          '流れが途切れずに没頭して読む必要のある長いエッセイ、技術ブログ、深層ニュースレターを発行するときに強くお勧めします。',
      },
    ],
    howToUse: [
      ...SHARED_HOW_TO_USE,
      {
        step: 3,
        title: 'Ask Claude to Build Your Screen',
        titleKo: 'Claude에게 원하는 화면 만들어 달라고 하기',
        titleJa: 'Claudeに作りたい画面をお願いする',
        description:
          'Whatever screen you need — login, blog, landing page, or dashboard — just ask. FramingUI composes CSS variables, icon library, components, and screen templates into production-ready UI.',
        descriptionKo:
          '로그인 화면이든, 블로그든, 랜딩페이지든, 대시보드든 만들고 싶은 화면을 요청하시면 FramingUI가 알아서 CSS 변수, 아이콘 라이브러리, 컴포넌트, 화면 템플릿을 조합해 프로덕션급 UI를 만들어요.',
        descriptionJa:
          'ログイン画面でも、ブログでも、ランディングページでも、ダッシュボードでも、作りたい画面をリクエストするだけ。FramingUIがCSS変数、アイコンライブラリ、コンポーネント、画面テンプレートを組み合わせてプロダクション品質のUIを作ります。',
        code: '"editorial-tech 테마로 아티클 피드 페이지 만들어줘"',
      },
    ],
  },

  'dark-boldness': {
    id: 'dark-boldness',
    name: 'Dark Boldness',
    tagline: 'Modern dark mode dashboard & monitoring design',
    taglineKo: '다크 모드 기반의 미니멀 모던 UI',
    taglineJa: 'ダークモードベースのミニマルモダンUI',
    description:
      'A sleek dark-mode design system with sharp components and high-contrast accents. Built for data dashboards, monitoring tools, and modern dark-themed products.',
    descriptionKo:
      '언제나 다크 모드를 기본으로 제공하며, 곡률 없는 직각의 컴포넌트와 대비가 강한 다크 톤으로 모던하고 세련된 느낌을 줍니다. 복잡한 지표 트래커나 대시보드처럼 데이터의 변화를 한눈에 확인해야 하는 화면에 가장 잘 맞습니다.',
    descriptionJa:
      '常にダークモードをデフォルトで提供し、曲率のない直角のコンポーネントとコントラストの強いダークトーンでモダンで洗練された印象を与えます。複雑な指標トラッカーやダッシュボードなど、データの変化を一目で確認する必要がある画面に最適です。',
    price: 59,
    screenshots: [
      getScreenshotUrl('dark-boldness', 'dashboard.webp'),
      getScreenshotUrl('dark-boldness', 'components.webp'),
      getScreenshotUrl('dark-boldness', 'trading.webp'),
    ],
    features: [
      {
        icon: '1',
        title: '30 Data Dashboard Components',
        titleKo: '데이터 대시보드에 최적화된 컴포넌트 30종',
        titleJa: 'データダッシュボードに最適化されたコンポーネント30種',
        subtitle: 'Modern, refined components built on Shadcn-UI',
        subtitleKo: 'Shadcn-UI 기반의 모던하고 정제된 컴포넌트',
        subtitleJa: 'Shadcn-UIベースのモダンで洗練されたコンポーネント',
        description:
          'Stat cards, progress bars, data tables, and more — 30 components essential for data-heavy interfaces. High-contrast aesthetics keep users focused on the metrics that matter.',
        descriptionKo:
          '스탯 카드, 프로그레스 바, 데이터 테이블 등 데이터를 다루는 데 필수적인 컴포넌트를 모두 담았어요. 강렬한 대비와 정제된 디자인이 몰입감을 높여줍니다.',
        descriptionJa:
          'スタットカード、プログレスバー、データテーブルなど、データを扱うのに必須のコンポーネントをすべて揃えています。強烈なコントラストと洗練されたデザインが没入感を高めます。',
      },
      {
        icon: '2',
        title: '13 Essential Page Layouts',
        titleKo: '13가지 필수 페이지 레이아웃',
        titleJa: '13種類の必須ページレイアウト',
        subtitle: 'Start fast with the most-used screens',
        subtitleKo: '자주 쓰이는 화면들로 빠르게 시작하기',
        subtitleJa: 'よく使う画面ですぐに始められる',
        description:
          'Landing, Dashboard, Auth, and Profile layouts — 13 complete pages ready to use. Shared common structure across all themes means perfect compatibility at any time.',
        descriptionKo:
          '랜딩, 대시보드, 로그인, 프로필 등 13가지 완성된 페이지 레이아웃을 제공해요. 모든 테마에 적용되는 동일한 공통 구조라 언제든 완벽하게 호환됩니다.',
        descriptionJa:
          'ランディング、ダッシュボード、ログイン、プロフィールなど13種類の完成されたページレイアウトを提供します。すべてのテーマに適用される共通構造なので、いつでも完全に互換性があります。',
      },
      {
        icon: '3',
        title: 'MCP Server Integration',
        titleKo: 'MCP 서버 통합',
        titleJa: 'MCPサーバー統合',
        subtitle: 'Build complex dashboard UIs with AI in seconds',
        subtitleKo: 'AI로 복잡한 대시보드 UI 뚝딱 만들기',
        subtitleJa: 'AIで複雑なダッシュボードUIをサクッと作成',
        description:
          'Tell Claude Code "Create a real-time monitoring screen with Dark Boldness theme" and instantly get a dashboard with neatly arranged metrics and charts.',
        descriptionKo:
          'Claude에게 "Dark Boldness 테마로 실시간 모니터링 화면을 짜줘"라고 한마디만 해보세요. 수많은 지표와 차트가 깔끔하게 정돈된 화면을 즉시 짜줍니다.',
        descriptionJa:
          'Claudeに「Dark Boldnessテーマでリアルタイムモニタリング画面を作って」と一言言うだけ。多数の指標とチャートがすっきり整理された画面をすぐに作成します。',
      },
      {
        icon: '4',
        title: 'High-Impact Accent Colors',
        titleKo: '몰입을 돕는 눈에 띄는 포인트 컬러',
        titleJa: '没入感を高める目立つアクセントカラー',
        subtitle: 'Vivid accents that energize the dark palette',
        subtitleKo: '다크 톤에 생기를 불어넣는 강렬한 엑센트',
        subtitleJa: 'ダークトーンに活気を与える強烈なアクセント',
        description:
          'High-contrast neon-style accent colors defined as CSS variables bring life to the dark canvas. Customize the primary color once to complete your brand\'s dark theme.',
        descriptionKo:
          '짙은 어둠 속에서 확 눈에 띄는 네온 컬러 등 높은 대비의 컬러가 CSS 변수로 잡혀 있어요. 대표 컬러를 수정해 브랜드만의 세련된 다크 테마를 완성하세요.',
        descriptionJa:
          '暗闇の中でパッと目を引くネオンカラーなど、高コントラストのカラーがCSS変数で設定されています。代表カラーを変更して、ブランド独自の洗練されたダークテーマを完成させましょう。',
      },
      {
        icon: '5',
        title: 'Dynamic Motion Effects',
        titleKo: '다이내믹한 모션 효과',
        titleJa: 'ダイナミックなモーション効果',
        subtitle: 'Lively animations that add excitement',
        subtitleKo: '톡톡 튀는 애니메이션으로 재미 더하기',
        subtitleJa: 'はじけるアニメーションで楽しさをプラス',
        description:
          'Framer Motion animation presets included. Dynamic motion applied to button clicks, card hovers, and page transitions.',
        descriptionKo:
          'Framer Motion 기반의 애니메이션이 적용되어 있어요. 버튼을 누르거나 화면을 넘길 때마다 역동적인 움직임이 기분 좋은 피드백을 줘요.',
        descriptionJa:
          'Framer Motionベースのアニメーションが適用されています。ボタンを押したり画面を切り替えるたびに、ダイナミックな動きが気持ちの良いフィードバックを提供します。',
      },
      {
        icon: '6',
        title: 'Statistics Visualization Components',
        titleKo: '통계 시각화 컴포넌트',
        titleJa: '統計ビジュアライゼーションコンポーネント',
        subtitle: 'Intuitive charts for at-a-glance insights',
        subtitleKo: '변화를 한눈에 보는 직관적인 차트',
        subtitleJa: '変化を一目で把握できる直感的なチャート',
        description:
          'Time-series graphs, donut charts, and more — present complex statistics as beautiful visuals. Deeply integrated with Chart.js for versatile data expression.',
        descriptionKo:
          '시계열 그래프, 도넛 차트 등 복잡한 통계를 예쁜 차트로 보여주세요. Chart.js와 깊이 연동되어 다채로운 데이터도 깔끔하게 표현돼요.',
        descriptionJa:
          '時系列グラフ、ドーナツチャートなど、複雑な統計を美しいチャートで表示します。Chart.jsと深く連携し、多彩なデータもすっきり表現できます。',
      },
    ],
    recommendedFor: [
      {
        title: 'Data Monitoring & Analytics Dashboards',
        titleKo: '데이터 모니터링 및 분석 대시보드',
        titleJa: 'データモニタリング＆分析ダッシュボード',
        description:
          'Clearly display a large number of real-time metrics. An intuitive design that never lets you miss a trend.',
        descriptionKo:
          '실시간으로 변하는 수많은 지표를 명확하게 보여주세요. 데이터의 변화 흐름을 놓치지 않게 하는 직관적인 디자인입니다.',
        descriptionJa:
          'リアルタイムで変わる多数の指標を明確に表示します。データの変化の流れを見逃さない直感的なデザインです。',
      },
      {
        title: 'Developer Tools & Admin Panels',
        titleKo: '개발자 도구 및 어드민 패널',
        titleJa: '開発者ツール＆アドミンパネル',
        description:
          'The top choice for complex management tools that developers and specialists use every day. Minimalist aesthetics reduce eye fatigue.',
        descriptionKo:
          '개발자나 전문가들이 매일 들여다보는 복잡한 관리 툴에 최고의 선택이에요. 군더더기 없는 미니멀리즘이 눈의 피로를 덜어줍니다.',
        descriptionJa:
          '開発者や専門家が毎日使う複雑な管理ツールに最高の選択肢です。無駄のないミニマリズムが目の疲れを軽減します。',
      },
      {
        title: 'Crypto & Fintech Services',
        titleKo: '가상자산 및 핀테크 서비스',
        titleJa: '仮想通貨＆フィンテックサービス',
        description:
          'Creates a sophisticated, trustworthy atmosphere perfect for crypto exchanges, asset management apps, and financial platforms.',
        descriptionKo:
          '암호화폐 거래소나 자산 관리 앱 등에 잘 어울리는 세련되고 신뢰감 있는 분위기를 만들어 줍니다.',
        descriptionJa:
          '暗号通貨取引所や資産管理アプリなどに最適な、洗練されて信頼感のある雰囲気を醸し出します。',
      },
      {
        title: 'Trendy & Modern Brands',
        titleKo: '트렌디하고 현대적인 브랜드',
        titleJa: 'トレンディでモダンなブランド',
        description:
          'The go-to choice for tech-forward, ambitious brand identities. The dark mode aesthetic delivers a uniquely sleek and impactful presence.',
        descriptionKo:
          '기술적이고 진취적인 브랜드 이미지를 입히고 싶다면 주저 없이 선택하세요. 다크 모드 특유의 시크한 임팩트가 매우 강합니다.',
        descriptionJa:
          'テクノロジー志向で進取的なブランドイメージをまとわせたいなら迷わず選んでください。ダークモード特有のシックなインパクトが非常に強烈です。',
      },
    ],
    howToUse: [
      ...SHARED_HOW_TO_USE,
      {
        step: 3,
        title: 'Ask Claude to Build Your Screen',
        titleKo: 'Claude에게 원하는 화면 만들어 달라고 하기',
        titleJa: 'Claudeに作りたい画面をお願いする',
        description:
          'Whatever screen you need — login, blog, landing page, or dashboard — just ask. FramingUI composes CSS variables, icon library, components, and screen templates into production-ready UI.',
        descriptionKo:
          '로그인 화면이든, 블로그든, 랜딩페이지든, 대시보드든 만들고 싶은 화면을 요청하시면 FramingUI가 알아서 CSS 변수, 아이콘 라이브러리, 컴포넌트, 화면 템플릿을 조합해 프로덕션급 UI를 만들어요.',
        descriptionJa:
          'ログイン画面でも、ブログでも、ランディングページでも、ダッシュボードでも、作りたい画面をリクエストするだけ。FramingUIがCSS変数、アイコンライブラリ、コンポーネント、画面テンプレートを組み合わせてプロダクション品質のUIを作ります。',
        code: '"dark-boldness 테마로 실시간 모니터링 대시보드 만들어줘"',
      },
    ],
  },

  pebble: {
    id: 'pebble',
    name: 'Pebble',
    tagline: 'Soft, rounded, gentle user experience',
    taglineKo: '둥글둥글하고 다정한 느낌의 모바일 앱 UI',
    taglineJa: '丸くて親しみやすいモバイルアプリUI',
    description:
      'A minimal design system with soft corners and gentle colors for friendly user experiences. Perfect for consumer apps, social platforms, and lifestyle services.',
    descriptionKo:
      '모서리가 둥글게 처리된 컴포넌트와 따스한 톤의 색상으로 꽉 채운 디자인 시스템이에요. 커뮤니티나 취향 공유 앱처럼 다정하고 친숙한 느낌이 중요한 서비스에 추천해요.',
    descriptionJa:
      '角が丸く処理されたコンポーネントと温かみのある色調で満たされたデザインシステムです。コミュニティや趣味共有アプリのように、親しみやすい感覚が大切なサービスにお勧めです。',
    price: 59,
    screenshots: [
      getScreenshotUrl('pebble', 'dashboard.webp'),
      getScreenshotUrl('pebble', 'components.webp'),
      getScreenshotUrl('pebble', 'feed.webp'),
    ],
    features: [
      {
        icon: '1',
        title: '30 Soft-Rounded Components',
        titleKo: '부드럽고 둥근 컴포넌트 30종',
        titleJa: '柔らかく丸みのあるコンポーネント30種',
        subtitle: 'Shadcn-UI with a warm, friendly touch',
        subtitleKo: 'Shadcn-UI에 따뜻함을 한 스푼 넣은 컴포넌트',
        subtitleJa: 'Shadcn-UIに温もりをひとさじ加えたコンポーネント',
        description:
          '30 components with soft corners (rounded-xl, rounded-2xl). Friendly and comfortable feel optimized for consumer apps.',
        descriptionKo:
          '모든 컴포넌트에 여유로운 둥근 모서리(rounded-xl 등)를 적용했어요. 딱딱한 느낌 없이 사용자에게 편안하게 다가갑니다.',
        descriptionJa:
          'すべてのコンポーネントに余裕のある丸みのある角（rounded-xlなど）を適用しています。硬い印象なく、ユーザーに親しみやすく近づきます。',
      },
      {
        icon: '2',
        title: '13 Essential Page Layouts',
        titleKo: '13가지 필수 페이지 레이아웃',
        titleJa: '13種類の必須ページレイアウト',
        subtitle: 'Start fast with the most-used screens',
        subtitleKo: '자주 쓰이는 화면들로 빠르게 시작하기',
        subtitleJa: 'よく使う画面ですぐに始められる',
        description:
          'Social Feed, User Profile, Community, and Chat layouts for consumer apps. Intuitive and accessible design.',
        descriptionKo:
          '랜딩, 대시보드, 로그인, 프로필 등 13가지 완성된 페이지 레이아웃을 제공해요. 모든 테마에 적용되는 동일한 공통 구조라 언제든 완벽하게 호환됩니다.',
        descriptionJa:
          'ランディング、ダッシュボード、ログイン、プロフィールなど13種類の完成されたページレイアウトを提供します。すべてのテーマに適用される共通構造なので、いつでも完全に互換性があります。',
      },
      {
        icon: '3',
        title: 'MCP Server Integration',
        titleKo: 'MCP 서버 통합',
        titleJa: 'MCPサーバー統合',
        subtitle: 'Create friendly UIs with a single prompt',
        subtitleKo: '말 한마디로 친근한 UI 뚝딱',
        subtitleJa: 'ひと言で親しみやすいUIをサクッと作成',
        description:
          'Say "Create a profile page with Pebble theme" and instantly get a soft-designed UI with avatar and follow button.',
        descriptionKo:
          '"Pebble 테마로 프로필 페이지 짜줘"라고 하면, 말랑말랑한 디자인의 아바타와 팔로우 버튼이 들어간 화면이 그 즉시 생겨납니다.',
        descriptionJa:
          '「Pebbleテーマでプロフィールページを作って」と言うだけで、柔らかいデザインのアバターとフォローボタンが入った画面がすぐに生成されます。',
      },
      {
        icon: '4',
        title: 'Warm & Cozy Color Palette',
        titleKo: '포근하고 포근한 컬러 팔레트',
        titleJa: '温かくほっこりしたカラーパレット',
        subtitle: 'Eye-friendly pastel tones',
        subtitleKo: '눈이 편안한 파스텔 톤 색상들',
        subtitleJa: '目にやさしいパステルトーンの色彩',
        description:
          'Gentle colors like pastel blue and soft pink defined as CSS variables. Easy on the eyes even during extended use.',
        descriptionKo:
          '파스텔 블루나 보들보들한 핑크처럼 튀지 않고 온화한 색상들로 구성되어 있어요. 매일매일 오래 들여다봐도 눈이 피로하지 않아요.',
        descriptionJa:
          'パステルブルーや柔らかなピンクのように、派手でなく穏やかな色調で構成されています。毎日長時間見ていても目が疲れません。',
      },
      {
        icon: '5',
        title: 'Soft Shadow System',
        titleKo: '은은한 그림자 효과',
        titleJa: 'ほのかなシャドウ効果',
        subtitle: 'Layered shadows for a light 3D feel',
        subtitleKo: '화면에 가벼운 입체감을 부여하는 그림자',
        subtitleJa: '画面に軽い立体感を与えるシャドウ',
        description:
          'Multi-layer soft shadows give components natural depth. Consistent application via elevation-sm, elevation-md, elevation-lg tokens.',
        descriptionKo:
          '옅고 부드러운 그림자를 겹겹이 쌓아 올려, 컴포넌트가 화면에서 부드럽게 떠 있는 것처럼 세련된 입체감을 줍니다.',
        descriptionJa:
          '薄く柔らかなシャドウを重ね合わせ、コンポーネントが画面上に柔らかく浮かんでいるような洗練された立体感を演出します。',
      },
      {
        icon: '6',
        title: 'Touch-Friendly Interactions',
        titleKo: '손가락에 꼭 맞는 터치 영역',
        titleJa: '指にぴったりのタッチ領域',
        subtitle: 'Perfectly sized targets for effortless tapping',
        subtitleKo: '오터치 없이 편하게 누르는 최적의 사이즈',
        subtitleJa: '誤タップなしで快適に押せる最適サイズ',
        description:
          'All interactive elements guarantee minimum 44x44px touch targets. Adequate spacing ensures easy finger tapping.',
        descriptionKo:
          '버튼이나 탭 등 눌러야 하는 모든 요소가 손가락으로 가볍게 터치하기 딱 좋은 크기(최소 44x44px)로 되어 있어요. 여백도 넉넉해 잘못 누를 일이 없죠.',
        descriptionJa:
          'ボタンやタブなどタップすべきすべての要素が、指で軽くタッチするのにちょうど良いサイズ（最小44x44px）になっています。余白も十分で誤タップの心配がありません。',
      },
    ],
    recommendedFor: [
      {
        title: 'B2C Mobile Apps',
        titleKo: 'B2C 모바일 앱',
        titleJa: 'B2Cモバイルアプリ',
        description:
          'Perfectly suited for mobile apps users check daily — social feeds, personal journals, and shopping — rather than rigid work tools.',
        descriptionKo:
          '딱딱한 업무용 앱보다는 소셜 피드, 일상 기록, 쇼핑처럼 매일 가볍게 들여다보는 모바일 앱에 찰떡이에요.',
        descriptionJa:
          '堅い業務アプリよりも、ソーシャルフィード、日常記録、ショッピングのように毎日気軽にチェックするモバイルアプリにぴったりです。',
      },
      {
        title: 'Approachable Brand Identity',
        titleKo: '친근한 브랜드 아이덴티티',
        titleJa: '親しみやすいブランドアイデンティティ',
        description:
          'Strip away the cold, techy IT-service feel and leave a warm, approachable impression that feels genuinely human.',
        descriptionKo:
          '차갑고 어려운 IT 서비스 느낌을 빼고, 사람 냄새 나고 편안한 서비스라는 인상을 줄 수 있어요.',
        descriptionJa:
          '冷たく難しいITサービスの印象を取り除き、人間味があって親しみやすいサービスという印象を与えることができます。',
      },
      {
        title: 'Community & Social Platforms',
        titleKo: '커뮤니티 및 소셜 플랫폼',
        titleJa: 'コミュニティ＆ソーシャルプラットフォーム',
        description:
          'Naturally suited for spaces where users gather, chat, and share their interests. Even a like button looks softer and more inviting.',
        descriptionKo:
          '유저들이 모여서 이야기하고 취향을 나누는 공간에 잘 어울려요. 좋아요 버튼 하나도 한층 부드럽게 표현됩니다.',
        descriptionJa:
          'ユーザーが集まって話し合い、趣味を共有する空間によく合います。いいねボタン一つも、よりソフトに表現されます。',
      },
      {
        title: 'Calming & Comforting Services',
        titleKo: '마음이 편안해지는 서비스',
        titleJa: '心が安らぐサービス',
        description:
          'Recommended when you want to create visually soothing screens — children\'s apps, sleep aids, or meditation tools — with no sharp or jarring elements.',
        descriptionKo:
          '아이를 위한 서비스나 수면/명상 유도 앱처럼, 뾰족하고 거슬리는 부분 없이 시각적으로 마음을 다독여주는 화면을 만들고 싶을 때 추천해요.',
        descriptionJa:
          '子ども向けサービスや睡眠・瞑想誘導アプリのように、とがった部分や気になる部分なく視覚的に心を落ち着かせる画面を作りたいときにお勧めです。',
      },
    ],
    howToUse: [
      ...SHARED_HOW_TO_USE,
      {
        step: 3,
        title: 'Ask Claude to Build Your Screen',
        titleKo: 'Claude에게 원하는 화면 만들어 달라고 하기',
        titleJa: 'Claudeに作りたい画面をお願いする',
        description:
          'Whatever screen you need — login, blog, landing page, or dashboard — just ask. FramingUI composes CSS variables, icon library, components, and screen templates into production-ready UI.',
        descriptionKo:
          '로그인 화면이든, 블로그든, 랜딩페이지든, 대시보드든 만들고 싶은 화면을 요청하시면 FramingUI가 알아서 CSS 변수, 아이콘 라이브러리, 컴포넌트, 화면 템플릿을 조합해 프로덕션급 UI를 만들어요.',
        descriptionJa:
          'ログイン画面でも、ブログでも、ランディングページでも、ダッシュボードでも、作りたい画面をリクエストするだけ。FramingUIがCSS変数、アイコンライブラリ、コンポーネント、画面テンプレートを組み合わせてプロダクション品質のUIを作ります。',
        code: '"pebble 테마로 카드 레이아웃 화면 만들어줘"',
      },
    ],
  },

  'classic-magazine': {
    id: 'classic-magazine',
    name: 'Classic Magazine',
    tagline: 'Editorial, content-rich, timeless typography',
    taglineKo: '종이 잡지를 읽는 듯한 클래식 매거진 UI',
    taglineJa: '紙の雑誌を読むようなクラシックマガジンUI',
    description:
      'A design system with classic magazine layouts and elegant typography for content-focused websites. Perfect for deep articles, op-eds, and original media.',
    descriptionKo:
      '정통 잡지 레이아웃과 수려한 타이포그래피를 결합했어요. 깊이 있는 아티클이나 기획 기사, 오피니언을 발행하는 미디어 사이트에 제격입니다.',
    descriptionJa:
      '本格的な雑誌レイアウトと美しいタイポグラフィを融合しました。深みのある記事や企画特集、オピニオンを発信するメディアサイトにぴったりです。',
    price: 59,
    screenshots: [
      getScreenshotUrl('classic-magazine', 'dashboard.webp'),
      getScreenshotUrl('classic-magazine', 'components.webp'),
      getScreenshotUrl('classic-magazine', 'article.webp'),
    ],
    features: [
      {
        icon: '1',
        title: '30 Editorial-Optimized Components',
        titleKo: '기사 편집에 특화된 컴포넌트 30종',
        titleJa: '記事編集に特化したコンポーネント30種',
        subtitle: 'Specialized building blocks for media and publishing',
        subtitleKo: '미디어와 출판을 위한 특별한 조각들',
        subtitleJa: 'メディアと出版のための特別なパーツ',
        description:
          'Article Card, Byline, Pull Quote, Drop Cap, and more—30 components specialized for content publishing. Brings editorial elements found only in magazines to the web with a single click.',
        descriptionKo:
          '첫 글자를 크게 강조하는 Drop Cap이나 인용구(Pull Quote)처럼, 잡지에서나 보던 멋진 편집 요소들을 웹에서 클릭 한 번으로 쓸 수 있게 만들었어요.',
        descriptionJa:
          '最初の文字を大きく強調するドロップキャップや引用文（プルクオート）など、雑誌でしか見られなかった素敵な編集要素をWebでワンクリックで使えるようにしました。',
      },
      {
        icon: '2',
        title: '13 Essential Page Layouts',
        titleKo: '13가지 필수 페이지 레이아웃',
        titleJa: '13種類の必須ページレイアウト',
        subtitle: 'Start fast with the most-used screens',
        subtitleKo: '자주 쓰이는 화면들로 빠르게 시작하기',
        subtitleJa: 'よく使う画面ですぐに始められる',
        description:
          'Homepage Grid, Article Detail, Category Page, and Author Profile layouts for content sites. Precisely designed grid system.',
        descriptionKo:
          '랜딩, 대시보드, 로그인, 프로필 등 13가지 완성된 페이지 레이아웃을 제공해요. 모든 테마에 적용되는 동일한 공통 구조라 언제든 완벽하게 호환됩니다.',
        descriptionJa:
          'ランディング、ダッシュボード、ログイン、プロフィールなど13種類の完成されたページレイアウトを提供します。すべてのテーマに適用される共通構造なので、いつでも完全に互換性があります。',
      },
      {
        icon: '3',
        title: 'MCP Server Integration',
        titleKo: 'MCP 서버 통합',
        titleJa: 'MCPサーバー統合',
        subtitle: 'AI-generated stunning layouts in seconds',
        subtitleKo: 'AI가 짜주는 기깔난 레이아웃',
        subtitleJa: 'AIが作る見事なレイアウト',
        description:
          'Tell the AI "Create an article body with Classic Magazine theme" and get a complete magazine-style screen from headline to sidebar in seconds.',
        descriptionKo:
          'AI에게 "Classic Magazine 테마로 기사 본문을 짜줘"라고 해보세요. 멋진 헤드라인부터 사이드바까지 완벽한 잡지 스타일의 화면이 뚝딱 완성됩니다.',
        descriptionJa:
          'AIに「Classic Magazineテーマで記事本文を作って」と言ってみてください。素晴らしい見出しからサイドバーまで、完璧な雑誌スタイルの画面がサクッと完成します。',
      },
      {
        icon: '4',
        title: 'Elegant Typography',
        titleKo: '기품 있는 타이포그래피',
        titleJa: '気品あるタイポグラフィ',
        subtitle: 'The beauty of Serif and Sans in harmony',
        subtitleKo: '명조(Serif)와 고딕(Sans)의 아름다운 조화',
        subtitleJa: '明朝体（Serif）とゴシック体（Sans）の美しい調和',
        description:
          'Merriweather Serif headlines paired with Inter Sans body text maximize readability. Line height, letter spacing, and paragraph spacing optimized for long-form reading.',
        descriptionKo:
          '우아한 세리프 폰트로 묵직하게 제목을 잡아주고, 산세리프 폰트로 본문을 깔끔하게 채워줍니다. 글의 밀도와 줄 간격을 섬세하게 조정해 긴 글도 쾌적하게 읽혀요.',
        descriptionJa:
          '優雅なセリフフォントで重厚に見出しを決め、サンセリフフォントで本文をすっきりと埋めます。文章の密度と行間を丁寧に調整し、長文でも快適に読めます。',
      },
      {
        icon: '5',
        title: 'Refined Multi-Column Layout',
        titleKo: '세밀한 다단 레이아웃',
        titleJa: '緻密な段組みレイアウト',
        subtitle: 'Flexible column arrangement stitch by stitch',
        subtitleKo: '한 땀 한 땀 나눈 유연한 단 구성',
        subtitleJa: 'ひとつひとつ丁寧に分けた柔軟な段組み',
        description:
          '12-column grid system enables complex layouts. Freely arrange articles in 2 or 3 columns, auto-collapsing and expanding responsively.',
        descriptionKo:
          '12컬럼 그리드를 기반으로 화면을 시원하게 나눴어요. 기사를 2단, 3단으로 자유롭게 배치하고, 브라우저 크기에 맞춰 똑똑하게 접히고 펴집니다.',
        descriptionJa:
          '12カラムグリッドを基本に画面をスッキリ分割しています。記事を2段、3段で自由に配置し、ブラウザサイズに合わせてスマートに折りたたまれます。',
      },
      {
        icon: '6',
        title: 'Clear Content Hierarchy',
        titleKo: '확실한 정보의 위계',
        titleJa: '明確な情報の階層',
        subtitle: 'Systematic categorization that eases article weight',
        subtitleKo: '기사의 무게감을 덜어주는 체계적인 분류',
        subtitleJa: '記事の重さを軽減する体系的な分類',
        description:
          'Metadata like dates, authors, and related tags are arranged according to hierarchy, helping users navigate even complex articles without getting lost.',
        descriptionKo:
          '날짜, 취재 기자, 관련 태그 등 기사 주변의 메타데이터들을 위계에 맞게 정돈했어요. 복잡한 기사 속에서도 길을 잃지 않게 도와줘요.',
        descriptionJa:
          '日付、取材記者、関連タグなど記事周辺のメタデータを階層に合わせて整理しています。複雑な記事の中でも迷子にならないよう導きます。',
      },
    ],
    recommendedFor: [
      {
        title: 'Journalism & Article Publishing',
        titleKo: '저널리즘 및 아티클 퍼블리싱',
        titleJa: 'ジャーナリズム＆記事パブリッシング',
        description:
          'The most ideal choice for newsletter channels that regularly publish high-quality writing, or original editorial magazines in the making.',
        descriptionKo:
          '수준 높은 글을 정기적으로 발행하는 뉴스레터 채널이나, 자체적인 오리지널 기획 매거진을 기획하고 있다면 가장 이상적입니다.',
        descriptionJa:
          '質の高い文章を定期的に発行するニュースレターチャンネルや、自社オリジナルの企画マガジンを計画しているなら最も理想的な選択です。',
      },
      {
        title: 'Independent Media & Specialty Publications',
        titleKo: '독립 미디어 및 전문지',
        titleJa: 'インディペンデントメディア＆専門誌',
        description:
          'Adds distinction to interview magazines, in-depth specialty reports, and online newsletters that want to show a differentiated point of view.',
        descriptionKo:
          '차별화된 뷰를 보여주고 싶은 인터뷰 매거진, 전문 지식을 다루는 심층 리포트, 그리고 온라인 사보 등에 격조를 더해 줍니다.',
        descriptionJa:
          '差別化されたビューを見せたいインタビューマガジン、専門知識を扱う深層レポート、オンライン社内報などに格調を加えます。',
      },
      {
        title: 'Long-Form Content & Article Sites',
        titleKo: '롱폼 콘텐츠 및 아티클 사이트',
        titleJa: 'ロングフォームコンテンツ＆記事サイト',
        description:
          'Perfect for in-depth content like essays, reviews, and guides. Typography and layout encourage users to read to the end.',
        descriptionKo:
          '에세이, 리뷰, 가이드 같은 깊이 있는 콘텐츠에 완벽해요. 타이포그래피와 레이아웃이 끝까지 읽고 싶게 만들어요.',
        descriptionJa:
          'エッセイ、レビュー、ガイドのような深みのあるコンテンツに最適です。タイポグラフィとレイアウトが最後まで読みたくさせます。',
      },
      {
        title: 'Traditional Editorial Design Projects',
        titleKo: '전통적인 편집 디자인 프로젝트',
        titleJa: '伝統的な編集デザインプロジェクト',
        description:
          'Ideal for literary journals, academic publications, and corporate magazines requiring authoritative, trustworthy design.',
        descriptionKo:
          '문학지, 학술지, 기업 매거진처럼 권위 있고 신뢰감 있는 디자인이 필요한 곳에 딱이에요. 클래식한 미학을 중시하는 프로젝트에 이상적이에요.',
        descriptionJa:
          '文学誌、学術誌、企業マガジンのように権威があり信頼感のあるデザインが必要なところにぴったりです。クラシックな美学を重視するプロジェクトに理想的です。',
      },
    ],
    howToUse: [
      ...SHARED_HOW_TO_USE,
      {
        step: 3,
        title: 'Ask Claude to Build Your Screen',
        titleKo: 'Claude에게 원하는 화면 만들어 달라고 하기',
        titleJa: 'Claudeに作りたい画面をお願いする',
        description:
          'Whatever screen you need — login, blog, landing page, or dashboard — just ask. FramingUI composes CSS variables, icon library, components, and screen templates into production-ready UI.',
        descriptionKo:
          '로그인 화면이든, 블로그든, 랜딩페이지든, 대시보드든 만들고 싶은 화면을 요청하시면 FramingUI가 알아서 CSS 변수, 아이콘 라이브러리, 컴포넌트, 화면 템플릿을 조합해 프로덕션급 UI를 만들어요.',
        descriptionJa:
          'ログイン画面でも、ブログでも、ランディングページでも、ダッシュボードでも、作りたい画面をリクエストするだけ。FramingUIがCSS変数、アイコンライブラリ、コンポーネント、画面テンプレートを組み合わせてプロダクション品質のUIを作ります。',
        code: '"classic-magazine 테마로 매거진 아티클 페이지 만들어줘"',
      },
    ],
  },

  'neutral-workspace': {
    id: 'neutral-workspace',
    name: 'Neutral Workspace',
    tagline: 'Universal, accessible, human-centered design for everyone',
    taglineKo: '누구에게나 평등한 접근성을 보장하는 유니버셜 UI',
    taglineJa: '誰にでも平等なアクセシビリティを保証するユニバーサルUI',
    description:
      'A design system built on the most universal and reliable principles. Prioritizes readability and clarity so everyone — regardless of age or ability — can interact without confusion.',
    descriptionKo:
      '가장 안전하고 보편적인 규칙으로 설계된 공공 지향적 시스템입니다. 남녀노소 누구나 헷갈림 없이 버튼을 누르고 폼을 입력할 수 있도록 가독성과 명확성에 타협하지 않았습니다.',
    descriptionJa:
      '最も安全で普遍的なルールで設計された公共志向のシステムです。老若男女問わず、誰でも迷わずボタンを押してフォームを入力できるよう、可読性と明確さに妥協しませんでした。',
    price: 59,
    screenshots: [
      getScreenshotUrl('neutral-workspace', 'dashboard.webp'),
      getScreenshotUrl('neutral-workspace', 'components.webp'),
      getScreenshotUrl('neutral-workspace', 'kanban.webp'),
    ],
    features: [
      {
        icon: '1',
        title: '30 Universally Accessible Components',
        titleKo: '보편적 사용성을 고려한 30종의 컴포넌트',
        titleJa: '普遍的な使いやすさを考慮した30種のコンポーネント',
        subtitle: 'Shadcn-UI with strict web standards applied',
        subtitleKo: 'Shadcn-UI에 엄격한 웹 표준을 더한 컴포넌트',
        subtitleJa: 'Shadcn-UIに厳格なWeb標準を加えたコンポーネント',
        description:
          '30 components meeting WCAG AAA standards. Carefully crafted so even users with visual difficulties can perceive them easily.',
        descriptionKo:
          '시각적 불편함이 있는 분들도 쉽게 인지할 수 있도록 가장 엄격한 대비(WCAG AAA 등급) 기준을 적용해 세심하게 깎아낸 컴포넌트들입니다.',
        descriptionJa:
          '視覚的な不便さがある方でも容易に認識できるよう、最も厳格なコントラスト（WCAG AAA等級）基準を適用して丁寧に作り込まれたコンポーネントです。',
      },
      {
        icon: '2',
        title: '13 Essential Page Layouts',
        titleKo: '13가지 필수 페이지 레이아웃',
        titleJa: '13種類の必須ページレイアウト',
        subtitle: 'Start fast with the most-used screens',
        subtitleKo: '자주 쓰이는 화면들로 빠르게 시작하기',
        subtitleJa: 'よく使う画面ですぐに始められる',
        description:
          'Healthcare Dashboard, Education Portal, Government Forms—13 layouts for trust-critical sectors. Clearly communicates complex information.',
        descriptionKo:
          '랜딩, 대시보드, 로그인, 프로필 등 13가지 완성된 페이지 레이아웃을 제공해요. 모든 테마에 적용되는 동일한 공통 구조라 언제든 완벽하게 호환됩니다.',
        descriptionJa:
          'ランディング、ダッシュボード、ログイン、プロフィールなど13種類の完成されたページレイアウトを提供します。すべてのテーマに適用される共通構造なので、いつでも完全に互換性があります。',
      },
      {
        icon: '3',
        title: 'MCP Server Integration',
        titleKo: 'MCP 서버 통합',
        titleJa: 'MCPサーバー統合',
        subtitle: 'Build perfectly accessible UIs with AI',
        subtitleKo: 'AI로 접근성 완벽한 UI 만들기',
        subtitleJa: 'AIでアクセシビリティ完璧なUIを作成',
        description:
          'Tell the AI "Create a patient survey form" and it auto-generates a flawless form with friendly hints and clear error messages around each input.',
        descriptionKo:
          'AI에게 "환자 설문 폼 좀 만들어 줘"라고 하면, 입력란 주변에 친절한 힌트와 뚜렷한 에러 안내문이 포함된 무결점 폼이 알아서 생성됩니다.',
        descriptionJa:
          'AIに「患者アンケートフォームを作って」と言うと、入力欄の周りに親切なヒントと明確なエラーメッセージが含まれた完璧なフォームが自動生成されます。',
      },
      {
        icon: '4',
        title: 'Neutral Color System',
        titleKo: '가장 차분하고 중립적인 컬러맵',
        titleJa: '最も落ち着いた中立的なカラーマップ',
        subtitle: 'Trustworthy grayscale palette with no bias',
        subtitleKo: '호불호 없는 신뢰의 회색조',
        subtitleJa: '好き嫌いのない信頼のグレースケール',
        description:
          'A understated gray palette that transcends gender and age preferences. Quietly supports the objectivity and credibility of the information itself.',
        descriptionKo:
          '특정 성별이나 연령층의 취향을 타지 않는 담백한 그레이 트랙을 썼어요. 정보 자체의 객관성과 신뢰도를 묵묵하게 받쳐줍니다.',
        descriptionJa:
          '特定の性別や年齢層の好みを選ばない淡白なグレーを使っています。情報自体の客観性と信頼性を黙々と支えます。',
      },
      {
        icon: '5',
        title: 'Clear Focus Indicators',
        titleKo: '뚜렷한 포커스 표시',
        titleJa: '明確なフォーカス表示',
        subtitle: 'Zero frustration keyboard navigation',
        subtitleKo: '마우스 없이도 답답함 제로인 키보드 이동',
        subtitleJa: 'マウスなしでもストレスゼロのキーボード移動',
        description:
          'A bold blue focus ring clearly shows which element is selected, so users can navigate the entire screen with just the keyboard (Tab) and always know where they are.',
        descriptionKo:
          '화면의 어느 요소를 선택 중인지 파란색 굵은 테두리(포커스 링)로 아주 선명하게 보여줘서, 마우스 없이 키보드(Tab)만으로 화면을 돌아다녀도 내가 어디에 있는지 바로 알 수 있습니다.',
        descriptionJa:
          '画面のどの要素を選択中か青い太い枠線（フォーカスリング）ではっきりと表示するので、マウスなしでキーボード（Tab）だけで画面を移動しても自分がどこにいるか即座にわかります。',
      },
      {
        icon: '6',
        title: 'Multilingual & RTL Support',
        titleKo: '다국어 및 RTL 지원',
        titleJa: '多言語＆RTLサポート',
        subtitle: 'Designed for global users',
        subtitleKo: '글로벌 사용자를 위한 설계',
        subtitleJa: 'グローバルユーザーのための設計',
        description:
          'Supports RTL (Right-to-Left) languages like Arabic and Hebrew. Typography optimized to maintain readability across diverse writing systems.',
        descriptionKo:
          '아랍어, 히브리어 같은 RTL(Right-to-Left) 언어를 지원해요. 다양한 문자 체계에서도 가독성이 유지되도록 타이포그래피가 최적화되어 있어요.',
        descriptionJa:
          'アラビア語、ヘブライ語などRTL（右から左）言語をサポートしています。さまざまな文字体系でも可読性が維持されるようタイポグラフィが最適化されています。',
      },
    ],
    recommendedFor: [
      {
        title: 'Healthcare & Medical Services',
        titleKo: '헬스케어 및 병원 서비스',
        titleJa: 'ヘルスケア＆病院サービス',
        description:
          'Helps even elderly patients intuitively confirm appointment information and safely complete forms.',
        descriptionKo:
          '연세가 있으신 환자분들도 예약 정보를 직관적으로 확인하고 안전하게 폼을 입력할 수 있도록 돕습니다.',
        descriptionJa:
          'ご高齢の患者様でも予約情報を直感的に確認し、安全にフォームを入力できるよう支援します。',
      },
      {
        title: 'Education & Learning Platforms',
        titleKo: '교육 및 학습 플랫폼',
        titleJa: '教育＆学習プラットフォーム',
        description:
          'Distraction-free design enabling students and teachers to focus. Content readability is paramount, supporting diverse learning styles.',
        descriptionKo:
          '학생과 교사가 집중할 수 있는 방해 없는 디자인이에요. 콘텐츠 가독성을 최우선으로 하고, 다양한 학습 스타일을 지원해요.',
        descriptionJa:
          '学生と教師が集中できる邪魔のないデザインです。コンテンツの可読性を最優先に、多様な学習スタイルをサポートします。',
      },
      {
        title: 'Government Agencies & Public Portals',
        titleKo: '정부 기관 및 공공 포털',
        titleJa: '政府機関＆公共ポータル',
        description:
          'Essential for local government public services, university academic portals, and any context where universal accessibility is the first principle.',
        descriptionKo:
          '공평한 접근이 필수적인 지자체나 관공서의 대국민 서비스, 혹은 대학의 학사 관리 포털처럼 보편타당함이 제1원칙인 곳에 필수적입니다.',
        descriptionJa:
          '公平なアクセスが必須の自治体や官公庁の対市民サービス、または大学の学籍管理ポータルのように普遍妥当性が第一原則の場所に必須です。',
      },
      {
        title: 'Accessibility-First Projects',
        titleKo: '접근성이 최우선인 프로젝트',
        titleJa: 'アクセシビリティ最優先プロジェクト',
        description:
          'Ideal for projects targeting WCAG AAA compliance. Design considers users with visual, auditory, and motor disabilities.',
        descriptionKo:
          'WCAG AAA 등급을 목표로 하는 프로젝트에 딱이에요. 시각, 청각, 운동 능력 장애가 있는 사용자를 모두 고려한 디자인이에요.',
        descriptionJa:
          'WCAG AAA等級を目指すプロジェクトに最適です。視覚、聴覚、運動能力障害のあるユーザーすべてを考慮したデザインです。',
      },
    ],
    howToUse: [
      ...SHARED_HOW_TO_USE,
      {
        step: 3,
        title: 'Ask Claude to Build Your Screen',
        titleKo: 'Claude에게 원하는 화면 만들어 달라고 하기',
        titleJa: 'Claudeに作りたい画面をお願いする',
        description:
          'Whatever screen you need — login, blog, landing page, or dashboard — just ask. FramingUI composes CSS variables, icon library, components, and screen templates into production-ready UI.',
        descriptionKo:
          '로그인 화면이든, 블로그든, 랜딩페이지든, 대시보드든 만들고 싶은 화면을 요청하시면 FramingUI가 알아서 CSS 변수, 아이콘 라이브러리, 컴포넌트, 화면 템플릿을 조합해 프로덕션급 UI를 만들어요.',
        descriptionJa:
          'ログイン画面でも、ブログでも、ランディングページでも、ダッシュボードでも、作りたい画面をリクエストするだけ。FramingUIがCSS変数、アイコンライブラリ、コンポーネント、画面テンプレートを組み合わせてプロダクション品質のUIを作ります。',
        code: '"neutral-workspace 테마로 워크스페이스 대시보드 만들어줘"',
      },
    ],
  },

  'minimal-workspace': {
    id: 'minimal-workspace',
    name: 'Minimal Workspace',
    tagline: 'Hyper-focused, zero-distraction productivity UI',
    taglineKo: '오직 일에만 몰입하게 만드는 초집중 UI',
    taglineJa: 'ただ仕事に没頭させる超集中UI',
    description:
      'Every pixel is pure utility — no decoration, no noise. Built for high-focus productivity tools like editors, project managers, and developer dashboards.',
    descriptionKo:
      '장식적인 요소는 완전히 덜어내고 픽셀 하나까지 실용성으로만 꽉 채웠습니다. 사용자가 딴청 피우지 않고 작업에만 몰두해야 하는 고도의 생산성 툴(예: VS Code, Notion)에 가장 어울립니다.',
    descriptionJa:
      '装飾的な要素を完全に取り除き、1ピクセルまで実用性だけで埋め尽くしました。ユーザーがよそ見せずに作業だけに没頭すべき高度な生産性ツール（例：VS Code、Notion）に最適です。',
    price: 59,
    screenshots: [
      getScreenshotUrl('minimal-workspace', 'dashboard.webp'),
      getScreenshotUrl('minimal-workspace', 'components.webp'),
      getScreenshotUrl('minimal-workspace', 'kanban.webp'),
    ],
    features: [
      {
        icon: '1',
        title: '30 Productivity-Maximizing Components',
        titleKo: '30가지의 생산성 극대화 조각들',
        titleJa: '生産性を最大化する30種のパーツ',
        subtitle: 'Solid components built for professionals',
        subtitleKo: '프로들을 위한 탄탄한 컴포넌트들',
        subtitleJa: 'プロのための確固たるコンポーネント',
        description:
          'Editor, Sidebar, Command Palette, Toolbar — 30 components for professionals obsessed with productivity. All optimized for efficiency and speed.',
        descriptionKo:
          '화면을 널찍하게 쓰는 에디터, 명령어 팔레트(Command Palette), 촘촘한 사이드바 등 생산성에 미친 듯이 집착하는 프로들을 위한 컴포넌트입니다.',
        descriptionJa:
          '画面を広々と使うエディター、コマンドパレット、緻密なサイドバーなど、生産性に狂ったようにこだわるプロのためのコンポーネントです。',
      },
      {
        icon: '2',
        title: '13 Essential Page Layouts',
        titleKo: '13가지 필수 페이지 레이아웃',
        titleJa: '13種類の必須ページレイアウト',
        subtitle: 'Start fast with the most-used screens',
        subtitleKo: '자주 쓰이는 화면들로 빠르게 시작하기',
        subtitleJa: 'よく使う画面ですぐに始められる',
        description:
          'Code Editor, Note Taking, Task Management, Project Dashboard—13 productivity app layouts. Features left sidebar and spacious work area.',
        descriptionKo:
          '랜딩, 대시보드, 로그인, 프로필 등 13가지 완성된 페이지 레이아웃을 제공해요. 모든 테마에 적용되는 동일한 공통 구조라 언제든 완벽하게 호환됩니다.',
        descriptionJa:
          'ランディング、ダッシュボード、ログイン、プロフィールなど13種類の完成されたページレイアウトを提供します。すべてのテーマに適用される共通構造なので、いつでも完全に互換性があります。',
      },
      {
        icon: '3',
        title: 'MCP Server Integration',
        titleKo: 'MCP 서버 통합',
        titleJa: 'MCPサーバー統合',
        subtitle: 'Build professional workspaces with AI instantly',
        subtitleKo: 'AI로 전문적인 워크스페이스 즉시 구축',
        subtitleJa: 'AIでプロフェッショナルなワークスペースを即時構築',
        description:
          'Tell the AI "Create a layout with a status bar and editor" and an IDE-feeling workspace is generated on the spot — no complex screen splitting needed.',
        descriptionKo:
          'AI에게 "에디터가 포함된 상태바 레이아웃 짜줘"라고 하면, 복잡하게 화면 분할할 필요 없이 IDE 감성이 물씬 풍기는 워크스페이스가 즉성 생성됩니다.',
        descriptionJa:
          'AIに「エディターを含んだステータスバーレイアウトを作って」と言えば、複雑な画面分割なしにIDE感たっぷりのワークスペースが即座に生成されます。',
      },
      {
        icon: '4',
        title: 'Ultimate Subtraction Design',
        titleKo: '극강의 뺄셈 디자인',
        titleJa: '極限の引き算デザイン',
        subtitle: 'A noiseless real canvas instead of glamour',
        subtitleKo: '화려함 대신 노이즈리스 리얼 캔버스',
        subtitleJa: '華やかさの代わりにノイズレスリアルキャンバス',
        description:
          'Animation and flashy shadows are luxuries here. The entire interface holds its breath so only the user\'s words and code take center stage.',
        descriptionKo:
          '애니메이션이나 화려한 그림자는 사치입니다. 인터페이스 전체가 벽지처럼 뒤로 물러나고 오직 사용자의 글과 코드만 주인공이 되도록 숨을 죽입니다.',
        descriptionJa:
          'アニメーションや華やかなシャドウは贅沢品です。インターフェース全体が壁紙のように後ろに下がり、ユーザーの文章とコードだけが主役になるよう息をひそめます。',
      },
      {
        icon: '5',
        title: 'Keyboard-First Workflow',
        titleKo: '마우스를 버릴 수 있는 키보드 중심 설계',
        titleJa: 'マウスを手放せるキーボード中心設計',
        subtitle: 'Press Cmd+K and everything is at your fingertips',
        subtitleKo: 'Cmd+K만 누르면 다 되는 마법',
        subtitleJa: 'Cmd+Kを押すだけで全部できる魔法',
        description:
          'No need to click menus with the mouse one by one — a single keyboard shortcut opens modals and navigates menus with an advanced user-optimized flow.',
        descriptionKo:
          '일일이 마우스로 메뉴를 클릭할 필요 없이 키보드 단축키 하나로 모달을 띄우고 메뉴를 탐색할 수 있는 고급 사용자 최적화 동선을 짰습니다.',
        descriptionJa:
          'いちいちマウスでメニューをクリックする必要なく、キーボードショートカット一つでモーダルを開いてメニューをナビゲートできる上級ユーザー最適化の動線を設計しました。',
      },
      {
        icon: '6',
        title: 'Dark Mode First Design',
        titleKo: '다크 모드 우선 디자인',
        titleJa: 'ダークモード優先デザイン',
        subtitle: 'Dark theme ideal for extended work',
        subtitleKo: '장시간 작업에 적합한 다크 테마',
        subtitleJa: '長時間作業に適したダークテーマ',
        description:
          'Designed with dark mode as default to minimize eye strain. Blends naturally with code editors, terminals, and other developer tools.',
        descriptionKo:
          '다크 모드를 기본으로 설계해서 눈이 편해요. 코드 에디터, 터미널 같은 개발자 도구와 자연스럽게 어우러져요.',
        descriptionJa:
          'ダークモードをデフォルトとして設計しているので目が楽です。コードエディター、ターミナルなどの開発者ツールと自然に馴染みます。',
      },
    ],
    recommendedFor: [
      {
        title: 'Project Management & Collaboration Tools',
        titleKo: '프로젝트 관리 및 협업 툴',
        titleJa: 'プロジェクト管理＆コラボレーションツール',
        description:
          'Efficiently manage tasks, projects, and team members. Ideal for Notion, Linear, Asana-style productivity tools.',
        descriptionKo:
          '태스크, 프로젝트, 팀원을 효율적으로 관리할 수 있어요. Notion, Linear, Asana 스타일의 생산성 도구에 딱이에요.',
        descriptionJa:
          'タスク、プロジェクト、チームメンバーを効率的に管理できます。Notion、Linear、Asanaスタイルの生産性ツールに最適です。',
      },
      {
        title: 'Note Apps & Knowledge Management Systems',
        titleKo: '노트 앱 및 지식 관리 시스템',
        titleJa: 'ノートアプリ＆ナレッジマネジメントシステム',
        description:
          'Distraction-free interface for writing and thought organization. Ideal for Obsidian, Roam Research-style apps.',
        descriptionKo:
          '글쓰기와 사고 정리에 집중할 수 있는 방해 없는 인터페이스에요. Obsidian, Roam Research 스타일의 앱에 이상적이에요.',
        descriptionJa:
          '文章執筆と思考整理に集中できる邪魔のないインターフェースです。Obsidian、Roam Researchスタイルのアプリに理想的です。',
      },
      {
        title: 'Code Editors & Developer Tools',
        titleKo: '코드 에디터 및 개발 도구',
        titleJa: 'コードエディター＆開発者ツール',
        description:
          'Build VS Code, Sublime Text-style development environments. Optimized sidebar, editor, and terminal layouts.',
        descriptionKo:
          'VS Code, Sublime Text 스타일의 개발 환경을 만들 수 있어요. 사이드바, 에디터, 터미널 레이아웃이 최적화되어 있어요.',
        descriptionJa:
          'VS Code、Sublime TextスタイルのIDEを構築できます。サイドバー、エディター、ターミナルのレイアウトが最適化されています。',
      },
      {
        title: 'Work Environments Prioritizing Productivity',
        titleKo: '생산성과 집중이 중요한 작업 환경',
        titleJa: '生産性と集中が重要な作業環境',
        description:
          'Tools for power users and professionals. Ideal for projects aiming to maximize efficiency and reduce unnecessary clicks.',
        descriptionKo:
          '파워 유저와 전문가를 위한 도구에요. 효율성을 극대화하고 불필요한 클릭을 줄이려는 프로젝트에 적합해요.',
        descriptionJa:
          'パワーユーザーと専門家のためのツールです。効率性を最大化し、不要なクリックを減らすことを目指すプロジェクトに最適です。',
      },
    ],
    howToUse: [
      ...SHARED_HOW_TO_USE,
      {
        step: 3,
        title: 'Ask Claude to Build Your Screen',
        titleKo: 'Claude에게 원하는 화면 만들어 달라고 하기',
        titleJa: 'Claudeに作りたい画面をお願いする',
        description:
          'Whatever screen you need — login, blog, landing page, or dashboard — just ask. FramingUI composes CSS variables, icon library, components, and screen templates into production-ready UI.',
        descriptionKo:
          '로그인 화면이든, 블로그든, 랜딩페이지든, 대시보드든 만들고 싶은 화면을 요청하시면 FramingUI가 알아서 CSS 변수, 아이콘 라이브러리, 컴포넌트, 화면 템플릿을 조합해 프로덕션급 UI를 만들어요.',
        descriptionJa:
          'ログイン画面でも、ブログでも、ランディングページでも、ダッシュボードでも、作りたい画面をリクエストするだけ。FramingUIがCSS変数、アイコンライブラリ、コンポーネント、画面テンプレートを組み合わせてプロダクション品質のUIを作ります。',
        code: '"minimal-workspace 테마로 에디터 사이드바 레이아웃 만들어줘"',
      },
    ],
  },

  'bold-line': {
    id: 'bold-line',
    name: 'Bold Line',
    tagline: 'High-contrast, line-forward, typographically bold',
    taglineKo: '두꺼운 선과 직각이 만드는 압도적 명료함',
    taglineJa: '太い線と直角が生む圧倒的な明快さ',
    description:
      'A stark black-and-white design system that uses bold borders instead of filled surfaces. Like a blueprint or spreadsheet — bold monochrome divisions that leave a commanding impression.',
    descriptionKo:
      '마치 블루프린트나 엑셀 스레드시트를 보는 듯, 선 굵은 흑백 톤 구분이 압도적인 인상을 남깁니다. 방대한 지표를 다루는 전문가의 관제탑에 가장 어울립니다.',
    descriptionJa:
      'まるでブループリントやExcelシートを見るように、線が太い白黒のトーン区分が圧倒的な印象を残します。膨大な指標を扱うプロの管制塔に最適です。',
    price: 59,
    screenshots: [
      getScreenshotUrl('bold-line', 'dashboard.webp'),
      getScreenshotUrl('bold-line', 'components.webp'),
      getScreenshotUrl('bold-line', 'docs.webp'),
    ],
    features: [
      {
        icon: '1',
        title: '2px Bold Border System',
        titleKo: '단호한 2px 테두리 두께',
        titleJa: '断固たる2px枠線の太さ',
        subtitle: 'Intense line-forward visual language',
        subtitleKo: '윤곽선 위주의 강렬한 시각 언어',
        subtitleJa: '輪郭線中心の強烈なビジュアル言語',
        description:
          'Zones are not divided by colored backgrounds. Thick, decisive 2px black lines clearly separate zones and components, maximizing clarity.',
        descriptionKo:
          '컬러 배경으로 구역을 나누지 않습니다. 두껍고 단호한 2px의 검은 선이 구역과 컴포넌트의 테두리를 확실히 갈라 명확성을 극대화합니다.',
        descriptionJa:
          'カラー背景でゾーンを分けません。太くて断固とした2pxの黒い線がゾーンとコンポーネントの境界を明確に分け、明瞭性を最大化します。',
      },
      {
        icon: '2',
        title: 'Uncompromising 0px Corners',
        titleKo: '자비 없는 0px 모서리',
        titleJa: '容赦のない0pxの角',
        subtitle: 'The geometric beauty of perfect right angles',
        subtitleKo: '완전한 직각의 기하학적 아름다움',
        subtitleJa: '完全な直角の幾何学的な美しさ',
        description:
          'Not a single curve is used. The knife-cut 0px radius rectangular arrangement showcases a mechanical, precise grid aesthetic.',
        descriptionKo:
          '곡선은 1픽셀도 쓰지 않습니다. 칼로 자른 듯한 0px 반경의 사각형 배치로 기계적이고 정밀한 그리드 미학을 뽐냅니다.',
        descriptionJa:
          '曲線は1ピクセルも使いません。ナイフで切ったような0px半径の四角形配置で、機械的で精密なグリッド美学を誇示します。',
      },
      {
        icon: '3',
        title: 'Monochrome + Neon Green Accent',
        titleKo: '무채색과 네온 그린의 강렬한 조화',
        titleJa: 'モノクロとネオングリーンの強烈な調和',
        subtitle: 'One drop of neon light in a monochrome world',
        subtitleKo: '단색 세상에 떨어뜨린 한 방울의 네온 빛',
        subtitleJa: 'モノクロの世界に落とした一滴のネオン光',
        description:
          'After using nothing but black and white, a single neon green fires only in truly critical moments — "Active", "Success", "Payment" — completely stealing the gaze.',
        descriptionKo:
          '지독할 정도로 흑백만 쓰다가, \'작동 중\', \'성공\', 혹은 \'결제\' 같은 진짜 중요한 순간에만 네온 빛 그린 컬러를 딱 한 번 쏴서 시선을 완전히 훔칩니다.',
        descriptionJa:
          'ひたすら白黒だけを使いながら、「稼働中」「成功」「決済」のような本当に重要な瞬間にのみネオングリーンをパッと一発放って視線を完全に奪います。',
      },
      {
        icon: '4',
        title: 'Heavyweight Typography',
        titleKo: '묵직한 헤비급 타이포그래피',
        titleJa: '重厚なヘビー級タイポグラフィ',
        subtitle: 'Ultra-bold weight that commands attention',
        subtitleKo: '시선을 강탈하는 초고도 굵기',
        subtitleJa: '視線を強奪する超高度の太さ',
        description:
          'Headlines get 900-weight font-black with a massive presence, dividing hierarchy by the sheer weight of the text itself without wasting pixels.',
        descriptionKo:
          '제목엔 900 굵기(font-black)의 육중한 존재감을 주면서 픽셀 낭비 없이 텍스트 자체의 무게감으로 계층을 갈라버립니다.',
        descriptionJa:
          '見出しには900ウェイト（font-black）の重厚な存在感を与えながら、ピクセルを無駄にせずテキスト自体の重さで階層を分けます。',
      },
      {
        icon: '5',
        title: 'MCP Server Integration',
        titleKo: 'MCP 서버 통합',
        titleJa: 'MCPサーバー統合',
        subtitle: 'Blueprint-style layouts generated with AI',
        subtitleKo: 'AI로 도면 같은 레이아웃 뚝딱',
        subtitleJa: 'AIで設計図のようなレイアウトをサクッと作成',
        description:
          'Tell the AI "Create a data-heavy dashboard blueprint" and a professional framework of decisive lines and monochrome contrast drops instantly.',
        descriptionKo:
          'AI에게 "데이터 잔뜩 들어가는 대시보드 도면 짜줘"라고 하면, 단호한 선과 단색 대비로 이루어진 전문성 넘치는 틀이 바로 떨어집니다.',
        descriptionJa:
          'AIに「データがたっぷり入るダッシュボードの設計図を作って」と言えば、断固とした線とモノクロコントラストで構成されたプロフェッショナルなフレームワークが即座に出てきます。',
      },
      {
        icon: '6',
        title: 'Ready-to-Use Monitoring Dashboard',
        titleKo: '관제탑용 모니터링 템플릿 완성',
        titleJa: '管制塔用モニタリングテンプレート完成',
        subtitle: 'A ready-made dashboard set with dense tables and charts',
        subtitleKo: '촘촘한 표와 차트가 버무려진 바로 쓸 수 있는 대시보드 세트',
        subtitleJa: '緻密な表とチャートが組み合わさったすぐ使えるダッシュボードセット',
        description:
          'The ultimate control room overflowing with numbers and charts. Stats, area charts, multi-level tables are pre-assembled — just plug in your data and you\'re done.',
        descriptionKo:
          '숫자와 차트가 넘쳐나는 극강의 관제탑. 스탯, 면적 차트, 다단 테이블 등이 이미 조립된 채로 제공되어 데이터만 꽂으면 끝납니다.',
        descriptionJa:
          '数字とチャートが溢れる究極の管制塔。スタット、面積チャート、多段テーブルなどがすでに組み立てられた状態で提供され、データを入れるだけで完成です。',
      },
    ],
    recommendedFor: [
      {
        title: 'Hardcore Data Analytics Dashboards',
        titleKo: '하드코어 데이터 분석 대시보드',
        titleJa: 'ハードコアデータ分析ダッシュボード',
        description:
          'The top choice for monitoring room displays that need to catch anomalies fastest among an enormous number of metrics, or super admin tools for administrators.',
        descriptionKo:
          '엄청난 수의 지표 중에서도 이상 징후를 가장 빨리 캐치해야 하는 모니터링 룸의 전광판이나, 관리자용 슈퍼 어드민 툴로 최고의 선택입니다.',
        descriptionJa:
          '膨大な数の指標の中でも異常を最速でキャッチする必要があるモニタリングルームの電光掲示板や、管理者用スーパーアドミンツールとして最高の選択です。',
      },
      {
        title: 'Cynical Developer & DevOps Toolkit',
        titleKo: '시니컬한 개발자 및 데브옵스 툴킷',
        titleJa: 'シニカルな開発者＆DevOpsツールキット',
        description:
          'Perfectly suits infrastructure tools and API testing tools with a cynical, geek aesthetic that satisfies discerning developers familiar with terminals.',
        descriptionKo:
          '터미널에 익숙한 눈 높은 개발자들에게 만족감을 줄 수 있는 시니컬하고 긱(geek)한 감성의 인프라 툴, API 테스팅 툴에 잘 어울려요.',
        descriptionJa:
          'ターミナルに慣れた目の高い開発者を満足させるシニカルでギーク（geek）な感性のインフラツール、APIテストツールにぴったりです。',
      },
      {
        title: 'Editorial & Publishing Platforms',
        titleKo: '편집 및 출판 플랫폼',
        titleJa: '編集＆出版プラットフォーム',
        description:
          'The bold typography and line-forward structure bring a print-editorial quality to digital products. Perfect for news platforms, content management systems, and writing tools.',
        descriptionKo:
          '굵은 타이포그래피와 선 중심 구조가 디지털 제품에 인쇄 편집물 같은 품격을 더해요. 뉴스 플랫폼, CMS, 글쓰기 도구에 완벽해요.',
        descriptionJa:
          '太いタイポグラフィと線中心の構造がデジタル製品に印刷編集物のような品格を加えます。ニュースプラットフォーム、CMS、ライティングツールに最適です。',
      },
      {
        title: 'High-Frequency Trading & Finance Apps',
        titleKo: '고빈도 트레이딩 및 금융 앱',
        titleJa: '高頻度トレーディング＆金融アプリ',
        description:
          'Even in trading apps or accounting ledgers where numbers fluctuate wildly, the strongest weight and color contrast helps users without overwhelming them.',
        descriptionKo:
          '오르락내리락하는 숫자가 정신없이 쏟아지는 트레이딩 앱이나 회계 장부에서도 가장 강렬한 굵기와 색 대비로 사용자를 압도하지 않고 도울 수 있습니다.',
        descriptionJa:
          '上下する数字が次々と流れるトレーディングアプリや会計帳簿でも、最も強烈な太さとカラーコントラストでユーザーを圧倒せずに支援できます。',
      },
    ],
    howToUse: [
      ...SHARED_HOW_TO_USE,
      {
        step: 3,
        title: 'Ask Claude to Build Your Screen',
        titleKo: 'Claude에게 원하는 화면 만들어 달라고 하기',
        titleJa: 'Claudeに作りたい画面をお願いする',
        description:
          'Whatever screen you need — login, blog, landing page, or dashboard — just ask. FramingUI composes CSS variables, icon library, components, and screen templates into production-ready UI.',
        descriptionKo:
          '로그인 화면이든, 블로그든, 랜딩페이지든, 대시보드든 만들고 싶은 화면을 요청하시면 FramingUI가 알아서 CSS 변수, 아이콘 라이브러리, 컴포넌트, 화면 템플릿을 조합해 프로덕션급 UI를 만들어요.',
        descriptionJa:
          'ログイン画面でも、ブログでも、ランディングページでも、ダッシュボードでも、作りたい画面をリクエストするだけ。FramingUIがCSS変数、アイコンライブラリ、コンポーネント、画面テンプレートを組み合わせてプロダクション品質のUIを作ります。',
        code: '"bold-line 테마로 대시보드 만들어줘"',
      },
    ],
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 템플릿 ID로 데이터 조회
 */
export function getTemplateData(id: string): TemplateData | null {
  return TEMPLATES[id] || null;
}

/**
 * 모든 템플릿 목록 반환
 */
export function getAllTemplates(): TemplateData[] {
  return Object.values(TEMPLATES);
}

/**
 * locale에 맞는 텍스트를 선택합니다.
 * - ko/ja가 없으면 en으로 fallback
 */
export function getLocalizedTemplateText(
  locale: TemplateLocale,
  en: string,
  ko?: string,
  ja?: string
): string {
  if (locale === 'ko' && ko) {
    return ko;
  }
  if (locale === 'ja' && ja) {
    return ja;
  }
  return en;
}
