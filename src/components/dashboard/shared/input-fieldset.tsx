import { FormLabel } from "@/components/ui/form";
import { Dot } from "lucide-react";

export default function InputFieldset({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <fieldset className="border rounded-md p-4">
        <legend className="px-2">
          <FormLabel>{label}</FormLabel>
        </legend>
        {description && (
          <p className="text-sm text-gray-400 dark:text-gray-800 pb-3 flex">
            <Dot className="-me-1"></Dot>
            {description}
          </p>
        )}
        {children}
      </fieldset>
    </div>
  );
}
