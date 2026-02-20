'use client';

import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SubmitButtonProps = {
  children?: React.ReactNode;
  onSubmitAction: () => Promise<void> | void;
  className?: string;
};

export function SubmitButton({ children, onSubmitAction, className }: SubmitButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await onSubmitAction();
    });
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn('w-full', className)}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? 'Enviando...' : children}
    </Button>
  );
}
