"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Search services...",
  debounceMs = 300,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, onChange, debounceMs]);

  return (
     <div
      className={cn(
        "h-12 rounded-full bg-[#F9FAFA] flex items-center px-4 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        isFocused ? "w-[350px]" : "w-[200px]"
      )}
    >
      <Search size={18} className="shrink-0 text-[#5C5C5C]" />

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          if (!value) setIsFocused(false);
        }}
        className={cn(
          "bg-transparent outline-none text-sm text-[#5C5C5C] placeholder:text-[#5C5C5C]",
          "transition-all duration-300",
          isFocused
            ? "w-full opacity-100 ml-3"
            : "w-full opacity-100 ml-3"
        )}
      />

      {inputValue && (
        <button
          type="button"
          onClick={() => {
            setInputValue("");
            setIsFocused(false);
          }}
          className="ml-2 flex h-6 w-6 items-center justify-center shrink-0"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}