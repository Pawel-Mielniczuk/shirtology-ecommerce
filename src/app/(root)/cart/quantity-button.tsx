import { Loader, Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

type QuantityButtonProps = {
  isPending: boolean;
  onClick: () => void;
  isAddButton: boolean;
};

export function QuantityButton({
  isPending,
  onClick,
  isAddButton,
}: QuantityButtonProps) {
  return (
    <Button
      disabled={isPending}
      variant="outline"
      type="button"
      onClick={onClick}
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : isAddButton ? (
        <Plus />
      ) : (
        <Minus />
      )}
    </Button>
  );
}
