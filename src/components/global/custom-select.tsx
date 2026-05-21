// components/CustomSelect.tsx

"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}: CustomSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <div
        className={`relative 
          w-full
          h-12
          rounded-xl
          bg-[#F8F8F8]
          shadow-[0_1px_2px_rgba(0,0,0,0.05)]
          text-base
          font-normal
          text-[#18181899]
          flex
          items-center
          cursor-pointer
          ${className}
        `}
      >
        <SelectTrigger className="w-full h-full border-0 px-4 shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:hidden rounded-xl bg-transparent">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        {/* Custom Arrow */}
        <ChevronDown
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#005864] pointer-events-none"
        />
      </div>

      <SelectContent
        position="popper"
        align="start"
        sideOffset={6}
        className="w-(--radix-select-trigger-width) gap-4 rounded-xl border-none ring-0 shadow-md bg-[#F8F8F8]"
      >
        {options.map((item) => (
          <SelectItem key={item.value} className="py-2" value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
