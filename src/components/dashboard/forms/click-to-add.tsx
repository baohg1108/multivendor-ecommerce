"use client";

import type { FC } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClickToAddProps {
  onAdd: () => void;
  onRemove: () => void;
  disableAdd?: boolean;
  disableRemove?: boolean;
}

const ClickToAdd: FC<ClickToAddProps> = ({
  onAdd,
  onRemove,
  disableAdd,
  disableRemove,
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onRemove}
        disabled={disableRemove}
        className="rounded-full"
      >
        <CircleMinus className="h-7 w-7 text-blue-400" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onAdd}
        disabled={disableAdd}
        className="rounded-full"
      >
        <CirclePlus className="h-7 w-7 text-blue-400" />
      </Button>
    </div>
  );
};

export default ClickToAdd;
