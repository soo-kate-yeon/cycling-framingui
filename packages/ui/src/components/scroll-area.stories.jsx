/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;
/**
 * Default scroll area
 * Accessibility: Provides custom scrollbars with proper keyboard navigation
 */
export const Default = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <div className="space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-sm">
            This is item {i + 1} in the scroll area.
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};
/**
 * Vertical scroll
 */
export const Vertical = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i}>
            <div className="text-sm">Tag {i + 1}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
/**
 * Horizontal scroll
 */
export const Horizontal = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 rounded-md border w-[200px] h-[150px] flex items-center justify-center"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
/**
 * Both directions
 */
export const BothDirections = {
  render: () => (
    <ScrollArea className="h-[400px] w-[600px] rounded-md border">
      <div className="w-[1200px] p-4">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border p-4 flex items-center justify-center h-[100px]"
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};
/**
 * Image gallery
 */
export const ImageGallery = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="shrink-0 overflow-hidden rounded-md w-[250px] h-[200px]">
            <div className="h-full w-full bg-[var(--bg-muted)] flex items-center justify-center">
              Image {i + 1}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
/**
 * Chat messages
 */
export const ChatMessages = {
  render: () => (
    <ScrollArea className="h-[400px] w-[350px] rounded-md border p-4">
      <div className="space-y-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`rounded-lg p-3 max-w-[70%] ${
                i % 2 === 0
                  ? 'bg-[var(--bg-muted)]'
                  : 'bg-[var(--bg-primary)] text-[var(--bg-primary-foreground)]'
              }`}
            >
              <p className="text-sm">Message {i + 1}</p>
              <p className="text-xs opacity-70 mt-1">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
/**
 * Long text content
 */
export const LongText = {
  render: () => (
    <ScrollArea className="h-[400px] w-[500px] rounded-md border p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Article Title</h3>
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i} className="text-sm text-[var(--bg-muted-foreground)]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};
/**
 * Code block
 */
export const CodeBlock = {
  render: () => (
    <ScrollArea className="h-[300px] w-[600px] rounded-md border">
      <div className="p-4">
        <pre className="text-sm">
          <code>
            {Array.from({ length: 30 })
              .map((_, i) => `function example${i}() {\n  console.log("Hello World");\n}\n`)
              .join('\n')}
          </code>
        </pre>
      </div>
    </ScrollArea>
  ),
};
/**
 * Nested scroll areas
 */
export const Nested = {
  render: () => (
    <ScrollArea className="h-[400px] w-[600px] rounded-md border p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Nested ScrollAreas</h3>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-md p-4">
            <h4 className="font-medium mb-2">Section {i + 1}</h4>
            <ScrollArea className="h-[100px] rounded-md border p-2">
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, j) => (
                  <p key={j} className="text-sm">
                    Nested item {j + 1}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
//# sourceMappingURL=scroll-area.stories.js.map
