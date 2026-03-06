/**
 * Template Documentation Data
 *
 * Comprehensive bilingual (en/ko) documentation for all 6 templates
 */

// ============================================================================
// Types
// ============================================================================

export interface ColorToken {
  name: string;
  nameKo?: string;
  hex: string;
  usage: string;
  usageKo?: string;
}

export interface TypographyToken {
  name: string;
  nameKo?: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
  usage: string;
  usageKo?: string;
}

export interface DesignDetail {
  title: string;
  titleKo?: string;
  description: string;
  descriptionKo?: string;
}

export interface CodeExample {
  title: string;
  titleKo?: string;
  description: string;
  descriptionKo?: string;
  code: string;
  language?: string;
}

export interface ComponentDoc {
  name: string;
  nameKo?: string;
  description: string;
  descriptionKo?: string;
  props?: {
    name: string;
    type: string;
    default?: string;
    description: string;
    descriptionKo?: string;
  }[];
  example?: string;
}

export interface InstallationStep {
  step: number;
  title: string;
  titleKo?: string;
  description: string;
  descriptionKo?: string;
  code?: string;
  language?: string;
}

export interface CustomizationGuide {
  title: string;
  titleKo?: string;
  description: string;
  descriptionKo?: string;
  steps: {
    title: string;
    titleKo?: string;
    code: string;
    language?: string;
  }[];
}

export interface BestPractice {
  title: string;
  titleKo?: string;
  description: string;
  descriptionKo?: string;
  dos: string[];
  dosKo?: string[];
  donts: string[];
  dontsKo?: string[];
}

export interface TemplateDocsData {
  id: string;
  name: string;
  philosophy: {
    tagline: string;
    taglineKo?: string;
    description: string;
    descriptionKo?: string;
    principles: string[];
    principlesKo?: string[];
  };
  installation: InstallationStep[];
  colorTokens: ColorToken[];
  typographyTokens: TypographyToken[];
  components: ComponentDoc[];
  designDetails: DesignDetail[];
  customization: CustomizationGuide[];
  examples: CodeExample[];
  bestPractices: BestPractice[];
  tocSections: { id: string; title: string; titleKo?: string }[];
}

// ============================================================================
// Shared Installation Steps
// ============================================================================

const SHARED_INSTALLATION: InstallationStep[] = [
  {
    step: 1,
    title: 'Install Tekton Design System',
    titleKo: 'Tekton 디자인 시스템 설치',
    description:
      'Install the FramingUI package and tokens using your preferred package manager (pnpm, npm, or yarn).',
    descriptionKo:
      '선호하는 패키지 매니저(pnpm, npm, yarn)를 사용하여 FramingUI 패키지와 토큰을 설치합니다.',
    code: 'pnpm add @framingui/ui @framingui/tokens\n# or\nnpm install @framingui/ui @framingui/tokens\n# or\nyarn add @framingui/ui @framingui/tokens',
    language: 'bash',
  },
  {
    step: 2,
    title: 'Import Theme Tokens',
    titleKo: '테마 토큰 가져오기',
    description:
      'Import the theme-specific CSS tokens in your root layout or _app file. This applies all design tokens globally.',
    descriptionKo:
      '루트 레이아웃 또는 _app 파일에서 테마별 CSS 토큰을 가져옵니다. 모든 디자인 토큰이 전역으로 적용됩니다.',
    code: 'import "@framingui/tokens/themes/[theme-id].css";\n// Replace [theme-id] with your template:\n// square-minimalism, dark-boldness, pebble,\n// classic-magazine, neutral-workspace, minimal-workspace',
    language: 'tsx',
  },
  {
    step: 3,
    title: 'Use Components',
    titleKo: '컴포넌트 사용',
    description:
      'Import and use FramingUI components in your React application. All components are fully typed with TypeScript.',
    descriptionKo:
      'React 애플리케이션에서 FramingUI 컴포넌트를 가져와 사용합니다. 모든 컴포넌트는 TypeScript로 완벽하게 타입이 지정되어 있습니다.',
    code: 'import { Button, Card, Input } from "@framingui/ui";\n\nexport default function App() {\n  return (\n    <Card>\n      <Input placeholder="Enter your email" />\n      <Button>Get Started</Button>\n    </Card>\n  );\n}',
    language: 'tsx',
  },
];

// ============================================================================
// Table of Contents Sections
// ============================================================================

const TOC_SECTIONS = [
  { id: 'philosophy', title: 'Design Philosophy', titleKo: '디자인 철학' },
  { id: 'installation', title: 'Installation', titleKo: '설치 가이드' },
  { id: 'color-tokens', title: 'Color Tokens', titleKo: '컬러 토큰' },
  { id: 'typography-tokens', title: 'Typography Tokens', titleKo: '타이포그래피 토큰' },
  { id: 'components', title: 'Components', titleKo: '컴포넌트' },
  { id: 'design-details', title: 'Design Details', titleKo: '디자인 세부사항' },
  { id: 'customization', title: 'Customization', titleKo: '커스터마이징' },
  { id: 'examples', title: 'Code Examples', titleKo: '코드 예제' },
  { id: 'best-practices', title: 'Best Practices', titleKo: '모범 사례' },
];

// ============================================================================
// Template Documentation Data
// ============================================================================

export const TEMPLATE_DOCS: Record<string, TemplateDocsData> = {
  'square-minimalism': {
    id: 'square-minimalism',
    name: 'Square Minimalism',
    philosophy: {
      tagline: 'Remove the corners, reveal the essence',
      taglineKo: '모서리를 없애면 본질이 드러난다',
      description:
        'Square Minimalism is a design system that completely eliminates rounded corners from all elements, expressing structure through typography and whitespace. This radical approach creates a bold, distinctive aesthetic that emphasizes clarity and purpose.',
      descriptionKo:
        'Square Minimalism은 모든 요소에서 둥근 모서리를 완전히 제거하고, 타이포그래피와 여백을 통해 구조를 표현하는 디자인 시스템입니다. 이러한 급진적인 접근은 명확성과 목적성을 강조하는 대담하고 독특한 미학을 만들어냅니다.',
      principles: [
        'Radius 0 - Remove rounded corners from all components',
        'Whitespace as Divider - Use spacing instead of borders',
        'Typography as Graphic - Typography becomes visual element',
        'High Contrast - Maximize readability with clear black-white contrast',
      ],
      principlesKo: [
        'Radius 0 - 모든 컴포넌트에서 둥근 모서리 제거',
        'Whitespace as Divider - 구분선 대신 여백으로 섹션 구분',
        'Typography as Graphic - 타이포그래피를 그래픽 요소로 활용',
        'High Contrast - 명확한 흑백 대비로 가독성 극대화',
      ],
    },
    installation: SHARED_INSTALLATION,
    colorTokens: [
      {
        name: 'Neutral 900',
        hex: '#171717',
        usage: 'Primary text, dark backgrounds',
        usageKo: '주요 텍스트, 어두운 배경',
      },
      {
        name: 'Neutral 100',
        hex: '#F5F5F5',
        usage: 'Secondary backgrounds, subtle highlights',
        usageKo: '보조 배경, 미묘한 강조',
      },
      {
        name: 'White',
        hex: '#FFFFFF',
        usage: 'Canvas, card backgrounds',
        usageKo: '캔버스, 카드 배경',
      },
      {
        name: 'Neutral 200',
        hex: '#E5E5E5',
        usage: 'Borders, dividers (used sparingly)',
        usageKo: '테두리, 구분선 (최소한으로 사용)',
      },
    ],
    typographyTokens: [
      {
        name: 'Hero Title',
        nameKo: '히어로 타이틀',
        fontSize: '60px',
        fontWeight: '700',
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        usage: 'Main hero titles on landing pages',
        usageKo: '랜딩 페이지의 메인 히어로 타이틀',
      },
      {
        name: 'Section Heading',
        nameKo: '섹션 제목',
        fontSize: '36px',
        fontWeight: '700',
        lineHeight: '1.2',
        usage: 'Section titles throughout the page',
        usageKo: '페이지 전체의 섹션 제목',
      },
      {
        name: 'Eyebrow Label',
        nameKo: '아이브로우 레이블',
        fontSize: '12px',
        fontWeight: '700',
        lineHeight: '1',
        letterSpacing: '0.15em',
        usage: 'Labels and categories (always uppercase)',
        usageKo: '레이블과 카테고리 (항상 대문자)',
      },
      {
        name: 'Body Text',
        nameKo: '본문 텍스트',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.6',
        usage: 'Standard paragraph text',
        usageKo: '표준 단락 텍스트',
      },
    ],
    components: [
      {
        name: 'Button',
        nameKo: '버튼',
        description:
          'Primary action button with zero border radius, uppercase text, and wide letter spacing.',
        descriptionKo:
          '테두리 반경이 0이고, 대문자 텍스트와 넓은 자간을 가진 주요 액션 버튼입니다.',
        props: [
          {
            name: 'variant',
            type: '"primary" | "secondary" | "ghost"',
            default: '"primary"',
            description: 'Visual style variant',
            descriptionKo: '시각적 스타일 변형',
          },
          {
            name: 'size',
            type: '"sm" | "md" | "lg"',
            default: '"md"',
            description: 'Button size',
            descriptionKo: '버튼 크기',
          },
        ],
        example: '<Button variant="primary" size="lg">\n  GET STARTED\n</Button>',
      },
      {
        name: 'Card',
        nameKo: '카드',
        description: 'Content container with sharp edges, minimal borders, and clean whitespace.',
        descriptionKo:
          '날카로운 모서리, 최소한의 테두리, 깔끔한 여백을 가진 콘텐츠 컨테이너입니다.',
        example:
          '<Card>\n  <CardHeader>TITLE</CardHeader>\n  <CardContent>\n    Content goes here\n  </CardContent>\n</Card>',
      },
      {
        name: 'Input',
        nameKo: '입력',
        description: 'Form input field with rectangular shape and clear focus states.',
        descriptionKo: '직사각형 모양과 명확한 포커스 상태를 가진 폼 입력 필드입니다.',
        props: [
          {
            name: 'label',
            type: 'string',
            description: 'Input label (rendered uppercase)',
            descriptionKo: '입력 레이블 (대문자로 렌더링됨)',
          },
          {
            name: 'error',
            type: 'string',
            description: 'Error message',
            descriptionKo: '오류 메시지',
          },
        ],
        example: '<Input label="EMAIL ADDRESS" placeholder="you@example.com" />',
      },
    ],
    designDetails: [
      {
        title: 'Perfect Alignment',
        titleKo: '완벽한 정렬',
        description:
          'All elements align to an 8px grid system. This creates mathematical precision and visual harmony throughout the design.',
        descriptionKo:
          '모든 요소는 8px 그리드 시스템에 맞춰 정렬됩니다. 이는 디자인 전체에 수학적 정밀함과 시각적 조화를 만들어냅니다.',
      },
      {
        title: 'Selective Transparency',
        titleKo: '선택적 투명도',
        description:
          'When using glass morphism effects, apply 80% opacity with backdrop-blur for subtle depth without compromising the minimalist aesthetic.',
        descriptionKo:
          'Glass morphism 효과를 사용할 때는 80% 불투명도와 backdrop-blur를 적용하여 미니멀한 미학을 해치지 않으면서 미묘한 깊이감을 더합니다.',
      },
      {
        title: 'Uppercase Emphasis',
        titleKo: '대문자 강조',
        description:
          'Important labels and buttons use UPPERCASE + wide letter-spacing (0.15em) to create visual impact and hierarchy.',
        descriptionKo:
          '중요한 레이블과 버튼은 대문자 + 넓은 자간(0.15em)을 사용하여 시각적 임팩트와 계층 구조를 만듭니다.',
      },
      {
        title: 'Monochrome Foundation',
        titleKo: '모노크롬 기반',
        description:
          'The core palette is strictly black, white, and neutral grays. Accent colors (if any) are used extremely sparingly.',
        descriptionKo:
          '핵심 팔레트는 엄격하게 검정, 흰색, 중립 회색으로 구성됩니다. 액센트 색상(있는 경우)은 매우 절제되게 사용됩니다.',
      },
    ],
    customization: [
      {
        title: 'Override Brand Colors',
        titleKo: '브랜드 컬러 재정의',
        description:
          'Customize the neutral palette to match your brand while maintaining high contrast.',
        descriptionKo: '높은 대비를 유지하면서 중립 팔레트를 브랜드에 맞게 커스터마이징합니다.',
        steps: [
          {
            title: 'Define custom CSS variables',
            titleKo: '커스텀 CSS 변수 정의',
            code: ':root {\n  --neutral-900: #0A0A0A; /* Darker black */\n  --neutral-100: #FAFAFA; /* Lighter gray */\n  --bg-canvas: #FFFFFF;\n  --text-primary: var(--neutral-900);\n}',
            language: 'css',
          },
        ],
      },
      {
        title: 'Adjust Typography Scale',
        titleKo: '타이포그래피 스케일 조정',
        description: 'Modify font sizes and weights to suit your content needs.',
        descriptionKo: '콘텐츠 요구사항에 맞게 폰트 크기와 굵기를 수정합니다.',
        steps: [
          {
            title: 'Override typography tokens',
            titleKo: '타이포그래피 토큰 재정의',
            code: ':root {\n  --text-hero: 72px; /* Larger hero */\n  --text-section: 40px; /* Larger sections */\n  --text-body: 18px; /* Larger body */\n}',
            language: 'css',
          },
        ],
      },
    ],
    examples: [
      {
        title: 'Dashboard Card Layout',
        titleKo: '대시보드 카드 레이아웃',
        description: 'Create a metrics dashboard with square cards and clear data hierarchy.',
        descriptionKo: '정사각형 카드와 명확한 데이터 계층 구조를 가진 메트릭 대시보드를 만듭니다.',
        code: `import { Card, CardHeader, CardContent } from "@framingui/ui";

export function MetricsDashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <span className="text-xs font-bold tracking-widest uppercase">
            REVENUE
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">$124,500</div>
          <div className="text-sm text-neutral-500">+12% from last month</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <span className="text-xs font-bold tracking-widest uppercase">
            USERS
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">8,432</div>
          <div className="text-sm text-neutral-500">+8% from last month</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <span className="text-xs font-bold tracking-widest uppercase">
            CONVERSION
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">3.2%</div>
          <div className="text-sm text-neutral-500">-0.3% from last month</div>
        </CardContent>
      </Card>
    </div>
  );
}`,
        language: 'tsx',
      },
      {
        title: 'Hero Section with Sharp Edges',
        titleKo: '날카로운 모서리를 가진 히어로 섹션',
        description: 'A bold hero section showcasing the zero-radius aesthetic.',
        descriptionKo: '제로 반경 미학을 보여주는 대담한 히어로 섹션입니다.',
        code: `import { Button } from "@framingui/ui";

export function HeroSection() {
  return (
    <section className="bg-neutral-900 text-white py-32">
      <div className="max-w-5xl mx-auto px-6">
        <span className="text-xs font-bold tracking-[0.15em] uppercase mb-4 block">
          DESIGN SYSTEM
        </span>
        <h1 className="text-6xl font-bold tracking-tight leading-tight mb-6">
          Bold. Minimal.<br />Uncompromising.
        </h1>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl">
          Square Minimalism removes all decorative elements to reveal
          the pure essence of your content.
        </p>
        <div className="flex gap-4">
          <Button variant="primary" size="lg">
            GET STARTED
          </Button>
          <Button variant="ghost" size="lg">
            VIEW DOCS
          </Button>
        </div>
      </div>
    </section>
  );
}`,
        language: 'tsx',
      },
      {
        title: 'Web Magazine Dossier',
        titleKo: '웹 매거진 도시에',
        description:
          'A typography-first editorial layout with article lists and full-bleed imagery.',
        descriptionKo:
          '아티클 리스트와 풀블리드 이미지를 활용한 타이포그래피 중심의 에디토리얼 레이아웃입니다.',
        code: `// Featured Article Grid
<div className="grid grid-cols-1 gap-px bg-neutral-100 border border-neutral-100">
  {articles.map((article) => (
    <div key={article.id} className="group relative bg-white flex flex-col md:flex-row items-stretch overflow-hidden">
      <div className="relative w-full md:w-[400px] h-[300px] md:h-auto overflow-hidden">
        <Image src={article.image} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
      </div>
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
        <h4 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight uppercase italic">{article.title}</h4>
        <p className="text-neutral-500 text-lg md:text-xl font-light italic">{article.description}</p>
      </div>
    </div>
  ))}
</div>`,
        language: 'tsx',
      },
    ],
    bestPractices: [
      {
        title: 'Embrace the Sharpness',
        titleKo: '날카로움을 받아들이기',
        description:
          'Never add border-radius to any element. The sharp corners are the defining characteristic of this design system.',
        descriptionKo:
          '어떤 요소에도 border-radius를 추가하지 마세요. 날카로운 모서리는 이 디자인 시스템의 핵심 특징입니다.',
        dos: [
          'Use sharp edges consistently across all components',
          'Rely on whitespace and typography for visual hierarchy',
          'Apply uppercase + wide tracking for emphasis',
        ],
        dosKo: [
          '모든 컴포넌트에 일관되게 날카로운 모서리 사용',
          '시각적 계층 구조를 위해 여백과 타이포그래피 활용',
          '강조를 위해 대문자 + 넓은 자간 적용',
        ],
        donts: [
          "Don't add rounded corners to fit in with other designs",
          "Don't use gradients or complex shadows",
          "Don't overcrowd the layout—whitespace is essential",
        ],
        dontsKo: [
          '다른 디자인에 맞추기 위해 둥근 모서리 추가하지 않기',
          '그래디언트나 복잡한 그림자 사용하지 않기',
          '레이아웃을 과밀하게 만들지 않기—여백이 필수',
        ],
      },
      {
        title: 'Maintain High Contrast',
        titleKo: '높은 대비 유지',
        description: 'Always ensure text has at least 7:1 contrast ratio for WCAG AAA compliance.',
        descriptionKo: 'WCAG AAA 준수를 위해 텍스트가 항상 최소 7:1 대비율을 가지도록 합니다.',
        dos: [
          'Use pure black (#000) or near-black (#171717) for text',
          'Test color contrast with accessibility tools',
          'Provide sufficient whitespace around text',
        ],
        dosKo: [
          '텍스트에 순수 검정(#000) 또는 거의 검정(#171717) 사용',
          '접근성 도구로 색상 대비 테스트',
          '텍스트 주변에 충분한 여백 제공',
        ],
        donts: [
          "Don't use low-contrast gray-on-gray combinations",
          "Don't reduce opacity for disabled states below 40%",
          "Don't place text over busy background images without overlay",
        ],
        dontsKo: [
          '낮은 대비의 회색-회색 조합 사용하지 않기',
          '비활성 상태의 불투명도를 40% 이하로 낮추지 않기',
          '오버레이 없이 복잡한 배경 이미지 위에 텍스트 배치하지 않기',
        ],
      },
    ],
    tocSections: TOC_SECTIONS,
  },

  'dark-boldness': {
    id: 'dark-boldness',
    name: 'Dark Boldness',
    philosophy: {
      tagline: 'Visualize energy and motion',
      taglineKo: '에너지를 시각화하다',
      description:
        'Dark Boldness transforms the dynamism and energy of physical activity into a visual language. Bold colors, strong gradients, and motivational typography create an environment that inspires action and achievement.',
      descriptionKo:
        'Dark Boldness는 운동의 역동성과 에너지를 시각 언어로 변환합니다. 대담한 색상, 강력한 그래디언트, 동기부여 타이포그래피가 행동과 성취를 고취시키는 환경을 만듭니다.',
      principles: [
        'Bold Colors - Express energy through high saturation',
        'Dynamic Gradients - Suggest movement and transformation',
        'Strong Typography - Deliver powerful messages with bold fonts',
        'Motivational Tone - Design that encourages and empowers',
      ],
      principlesKo: [
        'Bold Colors - 높은 채도의 컬러로 에너지 표현',
        'Dynamic Gradients - 움직임과 변화를 암시하는 그래디언트',
        'Strong Typography - 굵은 폰트로 강렬한 메시지 전달',
        'Motivational Tone - 격려하고 힘을 주는 디자인',
      ],
    },
    installation: SHARED_INSTALLATION,
    colorTokens: [
      {
        name: 'True Black',
        nameKo: '순수 블랙',
        hex: '#000000',
        usage: 'Canvas background, brand emphasis',
        usageKo: '캔버스 배경, 브랜드 강조',
      },
      {
        name: 'Electric Blue (Accent)',
        nameKo: '일렉트릭 블루 (액센트)',
        hex: '#5599DD', // approximation of l=0.6, c=0.2, h=210
        usage: 'Interactive elements, accent highlights',
        usageKo: '인터랙티브 요소, 액센트 강조',
      },
      {
        name: 'Kinetic Orange (Accent)',
        nameKo: '키네틱 오렌지 (액센트)',
        hex: '#DD8855', // approximation of l=0.6, c=0.2, h=30
        usage: 'CTAs, active states, energy highlights',
        usageKo: 'CTA, 활성 상태, 에너지 강조',
      },
      {
        name: 'Pure White',
        nameKo: '순수 화이트',
        hex: '#FFFFFF',
        usage: 'Text on dark backgrounds, contrast',
        usageKo: '어두운 배경의 텍스트, 대비',
      },
    ],
    typographyTokens: [
      {
        name: 'Display Bold',
        nameKo: '디스플레이 볼드',
        fontSize: '72px',
        fontWeight: '900',
        lineHeight: '1',
        letterSpacing: '-0.03em',
        usage: 'Hero headlines, impact statements',
        usageKo: '히어로 헤드라인, 임팩트 있는 문구',
      },
      {
        name: 'Title Heavy',
        nameKo: '타이틀 헤비',
        fontSize: '48px',
        fontWeight: '800',
        lineHeight: '1.1',
        usage: 'Section titles, feature headers',
        usageKo: '섹션 제목, 기능 헤더',
      },
      {
        name: 'Body Regular',
        nameKo: '본문 레귤러',
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '1.6',
        usage: 'Paragraph text, descriptions',
        usageKo: '단락 텍스트, 설명',
      },
    ],
    components: [
      {
        name: 'ProgressBar',
        nameKo: '프로그레스 바',
        description:
          'Animated progress indicator with gradient fill to visualize workout progress.',
        descriptionKo:
          '운동 진행 상황을 시각화하는 그래디언트 채움의 애니메이션 진행 표시기입니다.',
        props: [
          {
            name: 'value',
            type: 'number',
            description: 'Progress percentage (0-100)',
            descriptionKo: '진행 퍼센트 (0-100)',
          },
          {
            name: 'gradient',
            type: 'boolean',
            default: 'true',
            description: 'Apply gradient fill',
            descriptionKo: '그래디언트 채움 적용',
          },
        ],
        example: '<ProgressBar value={75} gradient={true} />',
      },
      {
        name: 'WorkoutCard',
        nameKo: '운동 카드',
        description: 'Display workout details with bold imagery and motivational CTAs.',
        descriptionKo: '대담한 이미지와 동기부여 CTA로 운동 세부 정보를 표시합니다.',
        example:
          '<WorkoutCard\n  title="HIIT Blast"\n  duration="30 min"\n  calories={450}\n  image="/workout.jpg"\n/>',
      },
    ],
    designDetails: [
      {
        title: 'Energy Gradients',
        titleKo: '에너지 그래디언트',
        description:
          'Use 45-degree angle gradients from vibrant to deep colors to create a sense of dynamic movement.',
        descriptionKo:
          '비비드한 색상에서 딥한 색상으로의 45도 각도 그래디언트를 사용하여 역동적인 움직임을 표현합니다.',
      },
      {
        title: 'Motion Hints',
        titleKo: '모션 힌트',
        description:
          'On hover, apply scale(1.02) + shadow to suggest explosive energy and responsiveness.',
        descriptionKo:
          'Hover 시 scale(1.02) + shadow를 적용하여 폭발적인 에너지와 반응성을 암시합니다.',
      },
      {
        title: 'Absolute Precision (0px Radius)',
        titleKo: '절대적 정밀함 (0px Radius)',
        description:
          'Zero border-radius on all elements creates razor-sharp, elite aesthetics. The absence of curves amplifies the high-performance, luxury night gym atmosphere.',
        descriptionKo:
          '모든 요소에 0px border-radius를 적용하여 날카롭고 엘리트한 미학을 만듭니다. 곡선의 부재는 고성능, 럭셔리 나이트 짐 분위기를 극대화합니다.',
      },
    ],
    customization: [
      {
        title: 'Adjust Gradient Angles',
        titleKo: '그래디언트 각도 조정',
        description: 'Customize gradient direction to match your brand motion.',
        descriptionKo: '브랜드 모션에 맞게 그래디언트 방향을 커스터마이징합니다.',
        steps: [
          {
            title: 'Override gradient CSS',
            titleKo: '그래디언트 CSS 재정의',
            code: '.gradient-energy {\n  background: linear-gradient(135deg, #FF5722 0%, #673AB7 100%);\n}',
            language: 'css',
          },
        ],
      },
    ],
    examples: [
      {
        title: 'High-Performance Trading Interface',
        titleKo: '고성능 트레이딩 인터페이스',
        description: 'Elite trading dashboard with real-time chart, order book, and list views.',
        descriptionKo: '실시간 차트, 오더북, 리스트 뷰가 포함된 엘리트 트레이딩 대시보드입니다.',
        code: `import { DarkBoldnessTradingPage } from "@/components/explore/dark-boldness/DarkBoldnessTradingPage";

export default function App() {
  return <DarkBoldnessTradingPage />;
}`,
        language: 'tsx',
      },
      {
        title: 'Workout Progress Dashboard',
        titleKo: '운동 진행 대시보드',
        description: 'Visualize daily workout goals with vibrant progress bars.',
        descriptionKo: '비비드한 프로그레스 바로 일일 운동 목표를 시각화합니다.',
        code: `import { ProgressBar, Card } from "@framingui/ui";

export function WorkoutDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-2xl font-bold mb-4">Today's Goals</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Calories Burned</span>
              <span className="text-neutral-500">450 / 600</span>
            </div>
            <ProgressBar value={75} gradient={true} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Workout Duration</span>
              <span className="text-neutral-500">30 / 45 min</span>
            </div>
            <ProgressBar value={67} gradient={true} />
          </div>
        </div>
      </Card>
    </div>
  );
}`,
        language: 'tsx',
      },
    ],
    bestPractices: [
      {
        title: 'Use Color to Motivate',
        titleKo: '색상으로 동기부여',
        description:
          'Leverage vibrant colors strategically to encourage action without overwhelming users.',
        descriptionKo:
          '사용자를 압도하지 않으면서 행동을 장려하기 위해 비비드한 색상을 전략적으로 활용합니다.',
        dos: [
          'Use energy orange for primary CTAs',
          'Apply gradients to progress indicators',
          'Reserve vibrant colors for interactive elements',
        ],
        dosKo: [
          '주요 CTA에 에너지 오렌지 사용',
          '진행 표시기에 그래디언트 적용',
          '인터랙티브 요소에 비비드한 색상 예약',
        ],
        donts: [
          "Don't use too many vibrant colors simultaneously",
          "Don't apply gradients to body text",
          "Don't ignore contrast for accessibility",
        ],
        dontsKo: [
          '동시에 너무 많은 비비드한 색상 사용하지 않기',
          '본문 텍스트에 그래디언트 적용하지 않기',
          '접근성을 위한 대비 무시하지 않기',
        ],
      },
    ],
    tocSections: TOC_SECTIONS,
  },

  pebble: {
    id: 'pebble',
    name: 'Pebble',
    philosophy: {
      tagline: 'Clarity within softness',
      taglineKo: '부드러움 속의 명료함',
      description:
        'Pebble combines soft curves with gentle colors to create a friendly yet professional impression. The rounded aesthetics reduce visual tension, making interfaces more approachable and comfortable for extended use.',
      descriptionKo:
        'Pebble은 부드러운 곡선과 온화한 컬러를 결합하여 친근하면서도 전문적인 인상을 전달합니다. 둥근 미학은 시각적 긴장을 줄여 인터페이스를 더 접근하기 쉽고 장시간 사용에 편안하게 만듭니다.',
      principles: [
        'Soft Corners - 16px+ rounded borders for approachability',
        'Gentle Colors - Low saturation palette reduces eye strain',
        'Ample Spacing - Generous whitespace creates breathing room',
        'Approachable Design - Friendly UI that welcomes all users',
      ],
      principlesKo: [
        'Soft Corners - 16px+ 부드러운 모서리로 접근성 향상',
        'Gentle Colors - 낮은 채도 팔레트로 눈의 피로 감소',
        'Ample Spacing - 넉넉한 여백으로 숨 쉴 공간 제공',
        'Approachable Design - 모든 사용자를 환영하는 친근한 UI',
      ],
    },
    installation: SHARED_INSTALLATION,
    colorTokens: [
      {
        name: 'Brand Blue 500',
        nameKo: '브랜드 블루 500',
        hex: '#5599CC', // approximation of l=0.50, c=0.25, h=220
        usage: 'Primary actions, CTAs, brand emphasis',
        usageKo: '주요 액션, CTA, 브랜드 강조',
      },
      {
        name: 'Cool Gray 100',
        nameKo: '쿨 그레이 100',
        hex: '#EAF0F5', // approximation of neutral.cool.100 with h=210
        usage: 'Subtle backgrounds, surface layers',
        usageKo: '미묘한 배경, 표면 레이어',
      },
      {
        name: 'Cool Gray 900',
        nameKo: '쿨 그레이 900',
        hex: '#192935', // approximation of neutral.cool.900 with h=210
        usage: 'Primary text, dark emphasis',
        usageKo: '주요 텍스트, 어두운 강조',
      },
      {
        name: 'Pure White',
        nameKo: '순수 화이트',
        hex: '#FFFFFF',
        usage: 'Card backgrounds, high contrast surfaces',
        usageKo: '카드 배경, 고대비 표면',
      },
    ],
    typographyTokens: [
      {
        name: 'Heading Soft',
        nameKo: '헤딩 소프트',
        fontSize: '48px',
        fontWeight: '600',
        lineHeight: '1.2',
        usage: 'Page titles, main headings',
        usageKo: '페이지 제목, 메인 헤딩',
      },
      {
        name: 'Subheading',
        nameKo: '서브헤딩',
        fontSize: '32px',
        fontWeight: '500',
        lineHeight: '1.3',
        usage: 'Section headings',
        usageKo: '섹션 헤딩',
      },
      {
        name: 'Body Medium',
        nameKo: '본문 미디엄',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.7',
        usage: 'Paragraph text, comfortable reading',
        usageKo: '단락 텍스트, 편안한 읽기',
      },
    ],
    components: [
      {
        name: 'RoundedCard',
        nameKo: '둥근 카드',
        description: 'Content card with soft 16px border radius and subtle shadow.',
        descriptionKo: '부드러운 16px border radius와 미묘한 그림자를 가진 콘텐츠 카드입니다.',
        props: [
          {
            name: 'padding',
            type: '"sm" | "md" | "lg"',
            default: '"md"',
            description: 'Internal padding size',
            descriptionKo: '내부 패딩 크기',
          },
        ],
        example: '<RoundedCard padding="lg">\n  <h3>Friendly Content</h3>\n</RoundedCard>',
      },
    ],
    designDetails: [
      {
        title: 'Consistent Radius',
        titleKo: '일관된 반경',
        description:
          'Cards use 16px, buttons 24px, modals 20px border radius for a cohesive rounded aesthetic.',
        descriptionKo:
          '카드는 16px, 버튼은 24px, 모달은 20px border radius를 사용하여 일관된 둥근 미학을 제공합니다.',
      },
      {
        title: 'Soft Shadows',
        titleKo: '부드러운 그림자',
        description:
          'Apply soft blur (20px+) with 5-10% opacity for natural depth without harshness.',
        descriptionKo:
          '자연스러운 깊이감을 위해 20px+ 부드러운 블러와 5-10% 불투명도를 적용합니다.',
      },
      {
        title: 'Spacing System',
        titleKo: '여백 시스템',
        description: 'Section gaps are 80px, card internals 32px, providing ample breathing room.',
        descriptionKo: '섹션 간격은 80px, 카드 내부는 32px로 충분한 숨 쉴 공간을 제공합니다.',
      },
    ],
    customization: [
      {
        title: 'Adjust Border Radius',
        titleKo: 'Border Radius 조정',
        description: 'Fine-tune the roundness to match your brand personality.',
        descriptionKo: '브랜드 개성에 맞게 둥근 정도를 미세 조정합니다.',
        steps: [
          {
            title: 'Override radius tokens',
            titleKo: 'Radius 토큰 재정의',
            code: ':root {\n  --radius-card: 20px; /* More rounded */\n  --radius-button: 28px; /* Pill-shaped */\n}',
            language: 'css',
          },
        ],
      },
    ],
    examples: [
      {
        title: 'Modern Social Feed Dashboard',
        titleKo: '모던 소셜 피드 대시보드',
        description: 'Bubbly and approachable social media interface with rich media cards.',
        descriptionKo:
          '리치 미디어 카드와 부드러운 UI가 특징인 친근한 소셜 미디어 인터페이스입니다.',
        code: `import { PebbleSocialFeedPage } from "@/components/explore/pebble/PebbleSocialFeedPage";

export default function App() {
  return <PebbleSocialFeedPage />;
}`,
        language: 'tsx',
      },
      {
        title: 'Profile Card with Soft Edges',
        titleKo: '부드러운 모서리를 가진 프로필 카드',
        description: 'User profile card showcasing the friendly rounded aesthetic.',
        descriptionKo: '친근한 둥근 미학을 보여주는 사용자 프로필 카드입니다.',
        code: `import { RoundedCard, Avatar, Button } from "@framingui/ui";

export function UserProfile() {
  return (
    <RoundedCard padding="lg">
      <div className="flex items-center gap-4 mb-4">
        <Avatar src="/user.jpg" size="lg" />
        <div>
          <h3 className="text-xl font-semibold">Jane Doe</h3>
          <p className="text-neutral-500">Product Designer</p>
        </div>
      </div>
      <p className="text-neutral-600 mb-4">
        Passionate about creating delightful user experiences.
      </p>
      <Button variant="primary" size="md">
        Follow
      </Button>
    </RoundedCard>
  );
}`,
        language: 'tsx',
      },
    ],
    bestPractices: [
      {
        title: 'Maintain Soft Consistency',
        titleKo: '부드러운 일관성 유지',
        description:
          'Apply rounded corners consistently across all UI elements for a cohesive feel.',
        descriptionKo: '일관된 느낌을 위해 모든 UI 요소에 일관되게 둥근 모서리를 적용합니다.',
        dos: [
          'Use 16px+ border radius on cards',
          'Apply generous padding inside rounded containers',
          'Soften shadows with large blur radius',
        ],
        dosKo: [
          '카드에 16px+ border radius 사용',
          '둥근 컨테이너 내부에 넉넉한 패딩 적용',
          '큰 블러 반경으로 그림자 부드럽게 만들기',
        ],
        donts: [
          "Don't mix sharp and rounded corners",
          "Don't use harsh shadows",
          "Don't overcrowd rounded elements—spacing is key",
        ],
        dontsKo: [
          '날카로운 모서리와 둥근 모서리 혼합하지 않기',
          '거친 그림자 사용하지 않기',
          '둥근 요소를 과밀하게 만들지 않기—여백이 핵심',
        ],
      },
    ],
    tocSections: TOC_SECTIONS,
  },

  'classic-magazine': {
    id: 'classic-magazine',
    name: 'Classic Magazine',
    philosophy: {
      tagline: 'Reinterpreting traditional editorial design',
      taglineKo: '전통적 편집 디자인의 재해석',
      description:
        'Classic Magazine brings the elegant layouts and typography of print media to the web. Inspired by centuries of editorial design, this system prioritizes readability, hierarchy, and timeless aesthetics.',
      descriptionKo:
        'Classic Magazine은 인쇄 매체의 우아한 레이아웃과 타이포그래피를 웹으로 가져옵니다. 수세기에 걸친 편집 디자인에서 영감을 받아 가독성, 계층 구조, 시대를 초월한 미학을 우선시합니다.',
      principles: [
        'Editorial Layout - Magazine-style multi-column grids',
        'Serif Typography - Elegant serif fonts for authority',
        'Hierarchy First - Clear visual hierarchy guides readers',
        'Content Focus - Content is the hero, design supports it',
      ],
      principlesKo: [
        'Editorial Layout - 잡지 스타일 다단 레이아웃',
        'Serif Typography - 권위를 주는 우아한 Serif 폰트',
        'Hierarchy First - 명확한 시각적 위계가 독자를 안내',
        'Content Focus - 콘텐츠가 주인공, 디자인이 지원',
      ],
    },
    installation: SHARED_INSTALLATION,
    colorTokens: [
      {
        name: 'Pure Black (Brand 900)',
        nameKo: '퓨어 블랙 (브랜드 900)',
        hex: '#000000',
        usage: 'Body text, headlines, strong emphasis',
        usageKo: '본문 텍스트, 헤드라인, 강조',
      },
      {
        name: 'Pure White',
        nameKo: '퓨어 화이트',
        hex: '#FFFFFF',
        usage: 'Page background, cards',
        usageKo: '페이지 배경, 카드',
      },
      {
        name: 'Accent Rose (Rose 600)',
        nameKo: '액센트 로즈 (로즈 600)',
        hex: '#E11D48',
        usage: 'Highlights, pull quotes, CTAs',
        usageKo: '하이라이트, 인용구, CTA',
      },
      {
        name: 'Neutral Gray 600',
        nameKo: '뉴트럴 그레이 600',
        hex: '#525252',
        usage: 'Secondary text, captions, metadata',
        usageKo: '보조 텍스트, 캡션, 메타데이터',
      },
    ],
    typographyTokens: [
      {
        name: 'Display Serif',
        nameKo: '디스플레이 세리프',
        fontSize: '64px',
        fontWeight: '700',
        lineHeight: '1.1',
        usage: 'Article titles, hero headlines',
        usageKo: '아티클 제목, 히어로 헤드라인',
      },
      {
        name: 'Heading Serif',
        nameKo: '헤딩 세리프',
        fontSize: '40px',
        fontWeight: '600',
        lineHeight: '1.2',
        usage: 'Section headings',
        usageKo: '섹션 헤딩',
      },
      {
        name: 'Body Serif',
        nameKo: '본문 세리프',
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '1.8',
        usage: 'Article body, long-form content',
        usageKo: '아티클 본문, 장문 콘텐츠',
      },
    ],
    components: [
      {
        name: 'ArticleHeader',
        nameKo: '아티클 헤더',
        description: 'Editorial-style article header with headline, byline, and publication date.',
        descriptionKo: '헤드라인, 바이라인, 발행일이 포함된 편집 스타일 아티클 헤더입니다.',
        props: [
          {
            name: 'headline',
            type: 'string',
            description: 'Article headline',
            descriptionKo: '아티클 헤드라인',
          },
          {
            name: 'author',
            type: 'string',
            description: 'Author name',
            descriptionKo: '저자 이름',
          },
          {
            name: 'date',
            type: 'string',
            description: 'Publication date',
            descriptionKo: '발행일',
          },
        ],
        example:
          '<ArticleHeader\n  headline="The Future of Design"\n  author="Jane Doe"\n  date="March 15, 2024"\n/>',
      },
      {
        name: 'PullQuote',
        nameKo: '인용구',
        description: 'Highlighted quote extracted from article body.',
        descriptionKo: '아티클 본문에서 추출한 강조된 인용구입니다.',
        example: '<PullQuote>\n  "Design is not just what it looks like."\n</PullQuote>',
      },
    ],
    designDetails: [
      {
        title: 'Column System',
        titleKo: '컬럼 시스템',
        description:
          '12-column grid where body text spans 8 columns (66% width) for optimal readability.',
        descriptionKo:
          '본문 텍스트가 8컬럼(66% 너비)을 차지하는 12컬럼 그리드로 최적의 가독성을 제공합니다.',
      },
      {
        title: 'Drop Cap',
        titleKo: '드롭 캡',
        description:
          'Article openings feature 3-4 line height drop caps for traditional editorial flair.',
        descriptionKo:
          '아티클 시작 부분에 3-4줄 높이의 드롭 캡을 사용하여 전통적인 편집 감각을 연출합니다.',
      },
      {
        title: 'Golden Ratio',
        titleKo: '황금 비율',
        description:
          'Image and text proportions follow the golden ratio (1:1.618) for visual harmony.',
        descriptionKo: '이미지와 텍스트 비율이 황금 비율(1:1.618)을 따라 시각적 조화를 이룹니다.',
      },
    ],
    customization: [
      {
        title: 'Customize Serif Fonts',
        titleKo: 'Serif 폰트 커스터마이징',
        description: 'Select serif fonts that match your editorial voice.',
        descriptionKo: '편집 목소리에 맞는 serif 폰트를 선택합니다.',
        steps: [
          {
            title: 'Override font-family',
            titleKo: 'font-family 재정의',
            code: ':root {\n  --font-serif: "Merriweather", Georgia, serif;\n  --font-sans: "Inter", "Helvetica Neue", sans-serif;\n}',
            language: 'css',
          },
        ],
      },
    ],
    examples: [
      {
        title: 'Magazine Article Layout',
        titleKo: '잡지 아티클 레이아웃',
        description: 'Full editorial article with drop cap, pull quote, and sidebar.',
        descriptionKo: '드롭 캡, 인용구, 사이드바가 포함된 완전한 편집 아티클입니다.',
        code: `import { ArticleHeader, PullQuote } from "@framingui/ui";

export function MagazineArticle() {
  return (
    <article className="max-w-4xl mx-auto">
      <ArticleHeader
        headline="The Art of Typography"
        author="Jane Doe"
        date="March 15, 2024"
      />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <p className="text-lg leading-relaxed">
            <span className="float-left text-6xl font-bold leading-none mr-2">
              T
            </span>
            ypography is the art and technique of arranging type to make
            written language legible, readable, and appealing...
          </p>

          <PullQuote>
            "Typography is the craft of endowing human language with
            a durable visual form."
          </PullQuote>

          <p className="text-lg leading-relaxed">
            In the digital age, typography has evolved beyond print...
          </p>
        </div>

        <aside className="col-span-4">
          <h3 className="text-xl font-bold mb-4">Related Articles</h3>
          {/* Related content */}
        </aside>
      </div>
    </article>
  );
}`,
        language: 'tsx',
      },
    ],
    bestPractices: [
      {
        title: 'Prioritize Readability',
        titleKo: '가독성 우선',
        description:
          'Long-form content requires generous line height (1.8) and optimal line length (60-70 characters).',
        descriptionKo: '장문 콘텐츠는 넉넉한 행간(1.8)과 최적의 줄 길이(60-70자)가 필요합니다.',
        dos: [
          'Use serif fonts for body text',
          'Maintain 66% column width for articles',
          'Apply generous line spacing (1.8)',
        ],
        dosKo: [
          '본문 텍스트에 serif 폰트 사용',
          '아티클에 66% 컬럼 너비 유지',
          '넉넉한 행간(1.8) 적용',
        ],
        donts: [
          "Don't use sans-serif for long articles",
          "Don't exceed 70 characters per line",
          "Don't reduce line spacing below 1.6",
        ],
        dontsKo: [
          '장문 아티클에 sans-serif 사용하지 않기',
          '줄당 70자 초과하지 않기',
          '행간을 1.6 이하로 줄이지 않기',
        ],
      },
    ],
    tocSections: TOC_SECTIONS,
  },

  'neutral-workspace': {
    id: 'neutral-workspace',
    name: 'Neutral Workspace',
    philosophy: {
      tagline: 'Design for people',
      taglineKo: '사람을 위한 디자인',
      description:
        'Neutral Workspace prioritizes accessibility and inclusivity above all. With a neutral color palette, clear typography, and human-centered design principles, this system ensures comfortable experiences for users of all ages and abilities.',
      descriptionKo:
        'Neutral Workspace은 접근성과 포용성을 최우선으로 합니다. 중립적인 컬러 팔레트, 명확한 타이포그래피, 사람 중심 디자인 원칙으로 모든 연령과 능력의 사용자에게 편안한 경험을 보장합니다.',
      principles: [
        'Accessibility First - WCAG AAA compliance as standard',
        'Neutral Palette - Fatigue-free neutral colors',
        'Clear Communication - Intuitive, straightforward UI',
        'Inclusive Design - Support for diverse user environments',
      ],
      principlesKo: [
        'Accessibility First - 기본으로 WCAG AAA 준수',
        'Neutral Palette - 피로감 없는 중립 컬러',
        'Clear Communication - 직관적이고 명확한 UI',
        'Inclusive Design - 다양한 사용자 환경 지원',
      ],
    },
    installation: SHARED_INSTALLATION,
    colorTokens: [
      {
        name: 'Neutral 900 (Warm)',
        nameKo: '뉴트럴 900 (웜)',
        hex: '#1F1D19',
        usage: 'Primary text (warm neutral with WCAG AAA contrast)',
        usageKo: '주요 텍스트 (따뜻한 중립톤, WCAG AAA 대비)',
      },
      {
        name: 'Neutral 600 (Warm)',
        nameKo: '뉴트럴 600 (웜)',
        hex: '#706C61',
        usage: 'Secondary text',
        usageKo: '보조 텍스트',
      },
      {
        name: 'Neutral White (Warm)',
        nameKo: '뉴트럴 화이트 (웜)',
        hex: '#FDFCFA',
        usage: 'Canvas, backgrounds (subtle warm tint)',
        usageKo: '캔버스, 배경 (미묘한 따뜻한 톤)',
      },
      {
        name: 'Brand 700 (Warm Brown)',
        nameKo: '브랜드 700 (웜 브라운)',
        hex: '#8B6F47',
        usage: 'Links, interactive elements (warm accessible brown)',
        usageKo: '링크, 인터랙티브 요소 (따뜻한 접근 가능한 브라운)',
      },
    ],
    typographyTokens: [
      {
        name: 'Heading Clear',
        nameKo: '헤딩 클리어',
        fontSize: '48px',
        fontWeight: '600',
        lineHeight: '1.2',
        usage: 'Page titles, main headings',
        usageKo: '페이지 제목, 메인 헤딩',
      },
      {
        name: 'Subheading',
        nameKo: '서브헤딩',
        fontSize: '32px',
        fontWeight: '500',
        lineHeight: '1.3',
        usage: 'Section headings',
        usageKo: '섹션 헤딩',
      },
      {
        name: 'Body Readable',
        nameKo: '본문 가독성',
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '1.75',
        usage: 'Paragraph text (larger for readability)',
        usageKo: '단락 텍스트 (가독성을 위해 큼)',
      },
    ],
    components: [
      {
        name: 'AccessibleForm',
        nameKo: '접근 가능한 폼',
        description: 'Form component with clear labels, error messages, and ARIA attributes.',
        descriptionKo: '명확한 레이블, 오류 메시지, ARIA 속성을 가진 폼 컴포넌트입니다.',
        props: [
          {
            name: 'label',
            type: 'string',
            description: 'Visible label for screen readers',
            descriptionKo: '스크린 리더용 가시적 레이블',
          },
          {
            name: 'error',
            type: 'string',
            description: 'Error message with aria-invalid',
            descriptionKo: 'aria-invalid가 포함된 오류 메시지',
          },
          {
            name: 'helpText',
            type: 'string',
            description: 'Additional help text',
            descriptionKo: '추가 도움말 텍스트',
          },
        ],
        example:
          '<AccessibleForm\n  label="Email Address"\n  helpText="We\'ll never share your email"\n  error={errorMsg}\n/>',
      },
    ],
    designDetails: [
      {
        title: 'Contrast Optimization',
        titleKo: '대비 최적화',
        description:
          'All text maintains 7:1 contrast ratio or higher (WCAG AAA) for maximum readability.',
        descriptionKo:
          '모든 텍스트는 최대 가독성을 위해 7:1 이상의 대비율을 유지합니다 (WCAG AAA).',
      },
      {
        title: 'Focus Indicators',
        titleKo: '포커스 인디케이터',
        description:
          '2px solid, high contrast focus rings on all interactive elements for keyboard navigation.',
        descriptionKo:
          '키보드 네비게이션을 위해 모든 인터랙티브 요소에 2px solid, 높은 대비 포커스 링이 있습니다.',
      },
      {
        title: 'Sufficient Touch Targets',
        titleKo: '충분한 터치 타겟',
        description:
          'All interactive elements guarantee minimum 44x44px touch targets for mobile accessibility.',
        descriptionKo:
          '모든 인터랙티브 요소는 모바일 접근성을 위해 최소 44x44px 터치 타겟을 보장합니다.',
      },
    ],
    customization: [
      {
        title: 'Adjust Contrast Levels',
        titleKo: '대비 레벨 조정',
        description: 'Fine-tune contrast while maintaining WCAG AAA compliance.',
        descriptionKo: 'WCAG AAA 준수를 유지하면서 대비를 미세 조정합니다.',
        steps: [
          {
            title: 'Override text colors',
            titleKo: '텍스트 색상 재정의',
            code: ':root {\n  --text-primary: #1A1A1A; /* Darker for higher contrast */\n  --text-secondary: #4A4A4A;\n}',
            language: 'css',
          },
        ],
      },
    ],
    examples: [
      {
        title: 'Accessible Patient Form',
        titleKo: '접근 가능한 환자 폼',
        description: 'Healthcare form with clear labels, error handling, and help text.',
        descriptionKo: '명확한 레이블, 오류 처리, 도움말 텍스트가 있는 헬스케어 폼입니다.',
        code: `import { AccessibleForm, Button } from "@framingui/ui";

export function PatientForm() {
  const [errors, setErrors] = useState({});

  return (
    <form className="space-y-6">
      <AccessibleForm
        label="Full Name"
        helpText="Enter your legal name as it appears on your ID"
        error={errors.name}
      />

      <AccessibleForm
        label="Date of Birth"
        helpText="Format: MM/DD/YYYY"
        error={errors.dob}
      />

      <AccessibleForm
        label="Medical ID Number"
        helpText="10-digit number on your insurance card"
        error={errors.medicalId}
      />

      <Button type="submit" size="lg">
        Submit Patient Information
      </Button>
    </form>
  );
}`,
        language: 'tsx',
      },
      {
        title: 'Kanban Ticket Tracker',
        titleKo: '칸반 티켓 트래커',
        description: 'Linear-style productivity board with adaptive theme styling.',
        descriptionKo: '테마 스타일링이 적용된 Linear 스타일의 생산성 보드입니다.',
        code: `import { KanbanBoardView } from "@/components/explore/workspace/KanbanBoardView";

export default function App() {
  return <KanbanBoardView themeName="neutral-workspace" />;
}`,
        language: 'tsx',
      },
    ],
    bestPractices: [
      {
        title: 'Test with Assistive Technologies',
        titleKo: '보조 기술로 테스트',
        description: 'Always test with screen readers (NVDA, JAWS) and keyboard-only navigation.',
        descriptionKo: '항상 스크린 리더(NVDA, JAWS)와 키보드 전용 네비게이션으로 테스트합니다.',
        dos: [
          'Use semantic HTML (header, nav, main, footer)',
          'Provide alt text for all images',
          'Ensure focus order matches visual order',
        ],
        dosKo: [
          '시맨틱 HTML 사용 (header, nav, main, footer)',
          '모든 이미지에 alt 텍스트 제공',
          '포커스 순서가 시각적 순서와 일치하도록 보장',
        ],
        donts: [
          "Don't rely on color alone to convey information",
          "Don't disable focus indicators",
          "Don't use placeholder text as labels",
        ],
        dontsKo: [
          '정보 전달을 색상에만 의존하지 않기',
          '포커스 인디케이터 비활성화하지 않기',
          '레이블로 플레이스홀더 텍스트 사용하지 않기',
        ],
      },
    ],
    tocSections: TOC_SECTIONS,
  },

  'minimal-workspace': {
    id: 'minimal-workspace',
    name: 'Minimal Workspace',
    philosophy: {
      tagline: 'Space for focus',
      taglineKo: '집중을 위한 공간',
      description:
        'Minimal Workspace is a design system that ruthlessly eliminates unnecessary elements to maximize productivity and focus. Designed for power users and professionals, every pixel serves a purpose.',
      descriptionKo:
        'Minimal Workspace는 생산성과 집중력을 극대화하기 위해 불필요한 요소를 철저히 배제한 디자인 시스템입니다. 파워 유저와 전문가를 위해 설계되었으며, 모든 픽셀이 목적을 가집니다.',
      principles: [
        'Distraction-Free - Minimize visual noise',
        'Function Over Form - Functionality takes precedence',
        'Monochrome Base - Black and white foundation',
        'Efficiency Focus - Streamline workflows',
      ],
      principlesKo: [
        'Distraction-Free - 시각적 노이즈 최소화',
        'Function Over Form - 기능성 우선',
        'Monochrome Base - 흑백 기반 팔레트',
        'Efficiency Focus - 워크플로우 간소화',
      ],
    },
    installation: SHARED_INSTALLATION,
    colorTokens: [
      {
        name: 'Pure Black',
        nameKo: '퓨어 블랙',
        hex: '#000000',
        usage: 'Text, UI elements',
        usageKo: '텍스트, UI 요소',
      },
      {
        name: 'Pure White',
        nameKo: '퓨어 화이트',
        hex: '#FFFFFF',
        usage: 'Background',
        usageKo: '배경',
      },
      {
        name: 'Gray 200',
        nameKo: '그레이 200',
        hex: '#E5E5E5',
        usage: 'Dividers, borders',
        usageKo: '구분선, 테두리',
      },
      {
        name: 'Gray 500',
        nameKo: '그레이 500',
        hex: '#737373',
        usage: 'Muted text, placeholders',
        usageKo: '약한 텍스트, 플레이스홀더',
      },
    ],
    typographyTokens: [
      {
        name: 'Mono Title',
        nameKo: '모노 타이틀',
        fontSize: '32px',
        fontWeight: '500',
        lineHeight: '1.2',
        usage: 'Page titles (monospace font)',
        usageKo: '페이지 제목 (모노스페이스 폰트)',
      },
      {
        name: 'Sans Heading',
        nameKo: '산스 헤딩',
        fontSize: '24px',
        fontWeight: '500',
        lineHeight: '1.3',
        usage: 'Section headings',
        usageKo: '섹션 헤딩',
      },
      {
        name: 'Body Mono',
        nameKo: '본문 모노',
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '1.6',
        usage: 'Code, data, monospace content',
        usageKo: '코드, 데이터, 모노스페이스 콘텐츠',
      },
    ],
    components: [
      {
        name: 'Sidebar',
        nameKo: '사이드바',
        description: 'Collapsible sidebar navigation for workspace layouts.',
        descriptionKo: '워크스페이스 레이아웃을 위한 접을 수 있는 사이드바 네비게이션입니다.',
        props: [
          {
            name: 'collapsed',
            type: 'boolean',
            default: 'false',
            description: 'Sidebar collapsed state',
            descriptionKo: '사이드바 접힌 상태',
          },
        ],
        example: '<Sidebar collapsed={false}>\n  <Nav items={navItems} />\n</Sidebar>',
      },
    ],
    designDetails: [
      {
        title: 'Monospace Utilization',
        titleKo: '모노스페이스 활용',
        description:
          'Use monospace fonts for titles and data to create a technical, focused aesthetic.',
        descriptionKo:
          '제목과 데이터에 모노스페이스 폰트를 사용하여 기술적이고 집중된 미학을 만듭니다.',
      },
      {
        title: 'Minimal Decoration',
        titleKo: '최소 장식',
        description: 'Eliminate shadows, gradients, and animations to reduce visual clutter.',
        descriptionKo: '그림자, 그래디언트, 애니메이션을 제거하여 시각적 혼란을 줄입니다.',
      },
      {
        title: 'Compressed Layout',
        titleKo: '압축된 레이아웃',
        description: 'Minimize whitespace to increase information density for power users.',
        descriptionKo: '파워 유저를 위해 여백을 최소화하여 정보 밀도를 높입니다.',
      },
    ],
    customization: [
      {
        title: 'Enable Dark Mode',
        titleKo: '다크 모드 활성화',
        description: 'Invert colors for dark mode, ideal for extended work sessions.',
        descriptionKo: '장시간 작업에 이상적인 다크 모드를 위해 색상을 반전합니다.',
        steps: [
          {
            title: 'Dark mode CSS',
            titleKo: '다크 모드 CSS',
            code: '.dark {\n  --bg-canvas: #000000;\n  --text-primary: #FFFFFF;\n  --border: #333333;\n}',
            language: 'css',
          },
        ],
      },
    ],
    examples: [
      {
        title: 'Code Editor Layout',
        titleKo: '코드 에디터 레이아웃',
        description: 'IDE-style layout with sidebar, editor, and status bar.',
        descriptionKo: '사이드바, 에디터, 상태바가 있는 IDE 스타일 레이아웃입니다.',
        code: `import { Sidebar, Editor, StatusBar } from "@framingui/ui";

export function CodeEditor() {
  return (
    <div className="flex h-screen">
      <Sidebar collapsed={false}>
        <FileTree files={fileStructure} />
      </Sidebar>

      <div className="flex-1 flex flex-col">
        <Editor
          language="typescript"
          value={code}
          onChange={setCode}
        />
        <StatusBar
          line={currentLine}
          column={currentColumn}
          language="TypeScript"
        />
      </div>
    </div>
  );
}`,
        language: 'tsx',
      },
      {
        title: 'Kanban Ticket Tracker',
        titleKo: '칸반 티켓 트래커',
        description: 'Linear-style productivity board with adaptive theme styling.',
        descriptionKo: '테마 스타일링이 적용된 Linear 스타일의 생산성 보드입니다.',
        code: `import { KanbanBoardView } from "@/components/explore/workspace/KanbanBoardView";

export default function App() {
  return <KanbanBoardView themeName="minimal-workspace" />;
}`,
        language: 'tsx',
      },
    ],
    bestPractices: [
      {
        title: 'Keyboard-First Workflow',
        titleKo: '키보드 우선 워크플로우',
        description: 'Provide keyboard shortcuts for all actions to maximize efficiency.',
        descriptionKo: '효율성을 극대화하기 위해 모든 액션에 키보드 단축키를 제공합니다.',
        dos: [
          'Support Vim-style navigation',
          'Provide keyboard shortcut documentation',
          'Use keyboard-accessible components',
        ],
        dosKo: [
          'Vim 스타일 네비게이션 지원',
          '키보드 단축키 문서 제공',
          '키보드 접근 가능한 컴포넌트 사용',
        ],
        donts: [
          "Don't force mouse usage for common actions",
          "Don't hide shortcuts behind menus",
          "Don't override standard OS shortcuts",
        ],
        dontsKo: [
          '일반적인 액션에 마우스 사용 강제하지 않기',
          '메뉴 뒤에 단축키 숨기지 않기',
          '표준 OS 단축키 재정의하지 않기',
        ],
      },
    ],
    tocSections: TOC_SECTIONS,
  },
  'bold-line': {
    id: 'bold-line',
    name: 'Bold Line',
    philosophy: {
      tagline: 'Precision in every line, power in every pixel',
      taglineKo: '모든 선에 정밀함을, 모든 픽셀에 힘을',
      description:
        'Bold Line is a high-contrast design system that uses borders and monotone scales to create a professional, utility-first atmosphere. It emphasizes structural clarity and geometric precision, making it ideal for developer tools and technical platforms.',
      descriptionKo:
        'Bold Line은 경계선과 모노톤 스케일을 사용하여 전문적이고 기능 중심적인 분위기를 조성하는 고대비 디자인 시스템입니다. 구조적 명확성과 기하학적 정밀함을 강조하여 개발자 도구 및 기술 플랫폼에 이상적입니다.',
      principles: [
        'Line as Structure - Use borders to define hierarchy and boundaries',
        'High Contrast Monotone - Black and white core for maximum legibility',
        'Functional Spacing - Generous padding to organize complex information',
        'Stroke Emphasis - Thick icons and borders (2px+) for a "bold" feel',
      ],
      principlesKo: [
        'Line as Structure - 선(border)을 사용하여 계층과 경계를 정의',
        'High Contrast Monotone - 가독성 극대화를 위한 흑백 중심 설계',
        'Functional Spacing - 복잡한 정보를 정리하기 위한 넉넉한 패딩',
        'Stroke Emphasis - "bold"한 느낌을 주기 위한 굵은 아이콘과 테두리(2px+)',
      ],
    },
    installation: SHARED_INSTALLATION,
    colorTokens: [
      {
        name: 'Black (Neutral 950)',
        hex: '#000000',
        usage: 'Text, primary borders, CTA backgrounds',
        usageKo: '텍스트, 주요 테두리, CTA 배경',
      },
      {
        name: 'White (Neutral 50)',
        hex: '#FFFFFF',
        usage: 'Canvas, background surfaces',
        usageKo: '캔버스, 배경 표면',
      },
      {
        name: 'Accent Green',
        hex: '#22C55E',
        usage: 'Success states, subtle highlights',
        usageKo: '성공 상태, 미묘한 강조',
      },
    ],
    typographyTokens: [
      {
        name: 'Display Black',
        nameKo: '디스플레이 블랙',
        fontSize: '72px',
        fontWeight: '900',
        lineHeight: '1.0',
        letterSpacing: '-0.04em',
        usage: 'Hero sections, major page headings',
        usageKo: '히어로 섹션, 주요 페이지 제목',
      },
      {
        name: 'Technical Mono',
        nameKo: '테크니컬 모노',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.5',
        usage: 'Code snippets, API endpoints',
        usageKo: '코드 스니펫, API 엔드포인트',
      },
    ],
    components: [
      {
        name: 'Docs Sidebar',
        nameKo: '문서 사이드바',
        description: 'Linear navigation with bold active states and zero-radius borders.',
        descriptionKo: '굵은 활성 상태와 제로 반경 테두리를 가진 선형 네비게이션입니다.',
        example: '<Sidebar className="border-r-2 border-black" />',
      },
      {
        name: 'API Table',
        nameKo: 'API 테이블',
        description: 'High-contrast table with 4px header divider and bold text.',
        descriptionKo: '4px 헤더 구분선과 굵은 텍스트를 가진 고대비 테이블입니다.',
        example: '<Table className="border-b-4 border-black" />',
      },
    ],
    designDetails: [
      {
        title: 'Stroke Consistency',
        titleKo: '선 굵기의 일관성',
        description: 'Always use 2px borders for containers and 3px stroke for icons.',
        descriptionKo: '컨테이너에는 항상 2px 테두리를, 아이콘에는 3px 선을 사용하세요.',
      },
    ],
    customization: [
      {
        title: 'Change Accent Color',
        titleKo: '액센트 컬러 변경',
        description: 'Switch the primary brand accent while keeping the monochrome base.',
        descriptionKo: '모노크롬 베이스를 유지하면서 기본 브랜드 액센트를 교체합니다.',
        steps: [
          {
            title: 'Update brand variable',
            titleKo: '브랜드 변수 업데이트',
            code: ':root {\n  --color-brand: #3B82F6; /* Switch to Blue */\n}',
            language: 'css',
          },
        ],
      },
    ],
    examples: [
      {
        title: 'Terminal Style Hero',
        titleKo: '터미널 스타일 히어로',
        description: 'A dev-centric hero section with bold typography.',
        descriptionKo: '굵은 타이포그래피를 사용한 개발자 중심의 히어로 섹션입니다.',
        code: `<section className="py-24 border-b-4 border-black">\n  <h1 className="text-7xl font-black tracking-tighter">API.BOLD.TRUE</h1>\n</section>`,
      },
    ],
    bestPractices: [
      {
        title: 'Avoid Fills',
        titleKo: '채우기 지양',
        description: 'Prefer borders over solid background blocks to define sections.',
        descriptionKo: '섹션을 구분할 때 솔리드 배경 블록보다 테두리(border)를 선호하세요.',
        dos: ['Use white backgrounds', 'Use 2px black borders'],
        donts: ['Use soft shadows', 'Use rounded corners'],
      },
    ],
    tocSections: TOC_SECTIONS,
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get template documentation by ID
 */
export function getTemplateDocsData(id: string): TemplateDocsData | null {
  return TEMPLATE_DOCS[id] || null;
}

/**
 * Get all template documentation
 */
export function getAllTemplateDocs(): TemplateDocsData[] {
  return Object.values(TEMPLATE_DOCS);
}
