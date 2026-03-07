/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */
import { Skeleton } from './skeleton';
const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;
/**
 * Default skeleton loader
 * Accessibility: Provides visual feedback for loading states
 */
export const Default = {
  render: () => <Skeleton className="w-[100px] h-[20px]" />,
};
/**
 * Different shapes and sizes
 */
export const Shapes = {
  render: () => (
    <div className="space-y-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    </div>
  ),
};
/**
 * Card skeleton
 */
export const Card = {
  render: () => (
    <div className="flex flex-col space-y-3 w-[350px]">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  ),
};
/**
 * List skeleton
 */
export const List = {
  render: () => (
    <div className="w-[350px] space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  ),
};
/**
 * Profile skeleton
 */
export const Profile = {
  render: () => (
    <div className="flex items-center space-x-4 w-[350px]">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  ),
};
/**
 * Blog post skeleton
 */
export const BlogPost = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  ),
};
/**
 * Dashboard stats skeleton
 */
export const DashboardStats = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 p-4 border rounded-lg">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-3 w-[120px]" />
        </div>
      ))}
    </div>
  ),
};
/**
 * Table skeleton
 */
export const Table = {
  render: () => (
    <div className="w-[600px] space-y-2">
      <div className="grid grid-cols-4 gap-4 p-4 bg-[var(--bg-muted)]">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  ),
};
/**
 * Comment skeleton
 */
export const Comments = {
  render: () => (
    <div className="w-[500px] space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <Skeleton className="h-16 w-full rounded-lg ml-10" />
        </div>
      ))}
    </div>
  ),
};
/**
 * Form skeleton
 */
export const Form = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-10 w-[120px]" />
    </div>
  ),
};
//# sourceMappingURL=skeleton.stories.js.map
