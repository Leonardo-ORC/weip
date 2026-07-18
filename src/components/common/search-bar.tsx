import { forwardRef, type InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & { containerClassName?: string };

export const SearchBar = forwardRef<HTMLInputElement, Props>(
  ({ className, containerClassName, placeholder = "Search…", ...props }, ref) => (
    <label
      className={cn(
        "flex items-center gap-3 rounded-full border border-hairline bg-background px-5 py-3 text-sm shadow-soft focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
        containerClassName,
      )}
    >
      <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none",
          className,
        )}
        {...props}
      />
    </label>
  ),
);
SearchBar.displayName = "SearchBar";
