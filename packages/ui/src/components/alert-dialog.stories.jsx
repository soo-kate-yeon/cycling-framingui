/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { Button } from './button';
const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;
/**
 * Default alert dialog
 * Accessibility: Modal with proper focus management and keyboard support
 */
export const Default = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
/**
 * Destructive action
 */
export const Destructive = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account. All your data will be lost and cannot be
            recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-[var(--bg-destructive)] text-[var(--bg-destructive-foreground)] hover:bg-[var(--bg-destructive)]/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
/**
 * Confirmation dialog
 */
export const Confirmation = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Save Changes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Do you want to save them before leaving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don't Save</AlertDialogCancel>
          <AlertDialogAction>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
//# sourceMappingURL=alert-dialog.stories.js.map
