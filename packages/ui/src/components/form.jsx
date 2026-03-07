/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 * @framingui - Form Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */
import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import { Slot } from '@radix-ui/react-slot';
// eslint-disable-next-line no-unused-vars
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import { cn } from '../lib/utils';
// eslint-disable-next-line no-unused-vars
import { Label } from './label';
const Form = FormProvider;
const FormFieldContext = React.createContext({});
const FormField = ({ ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};
const FormItemContext = React.createContext({});
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-[var(--spacing-2)]', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <Label
      ref={ref}
      className={cn(error && 'text-[var(--bg-destructive)]', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';
const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-[var(--bg-muted-foreground)]', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;
  if (!body) {
    return null;
  }
  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-[var(--bg-destructive)]', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
//# sourceMappingURL=form.js.map
