import React, { useState, useRef, useEffect } from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "../../utils/cn";

const SelectContext = React.createContext(null);

function Select({
  children,
  value,
  onValueChange,
  defaultValue,
  open,
  onOpenChange,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [isOpen, setIsOpen] = useState(open || false);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  const currentValue = value !== undefined ? value : internalValue;
  const currentOpen = open !== undefined ? open : isOpen;

  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    handleOpenChange(false);
  };

  const handleOpenChange = (newOpen) => {
    if (open === undefined) {
      setIsOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  // Close on outside click
  useEffect(() => {
    if (!currentOpen) return;

    const handleClickOutside = (event) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        handleOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOpen]);

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open: currentOpen,
        onOpenChange: handleOpenChange,
        triggerRef,
        contentRef,
      }}
      {...props}
    >
      <div data-slot="select" className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function SelectGroup({ children, ...props }) {
  return (
    <div data-slot="select-group" role="group" {...props}>
      {children}
    </div>
  );
}

function SelectValue({ placeholder, children, ...props }) {
  const context = React.useContext(SelectContext);

  return (
    <span data-slot="select-value" {...props}>
      {context?.value || children || placeholder}
    </span>
  );
}

function SelectTrigger({ className, size = "default", children, ...props }) {
  const context = React.useContext(SelectContext);

  const handleClick = () => {
    context?.onOpenChange(!context?.open);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      context?.onOpenChange(!context?.open);
    }
  };

  return (
    <button
      ref={context?.triggerRef}
      type="button"
      role="combobox"
      aria-expanded={context?.open}
      aria-haspopup="listbox"
      data-slot="select-trigger"
      data-size={size}
      data-placeholder={!context?.value}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 opacity-50" />
    </button>
  );
}

function SelectContent({ className, children, position = "popper", ...props }) {
  const context = React.useContext(SelectContext);
  const [scrollTop, setScrollTop] = useState(false);
  const [scrollBottom, setScrollBottom] = useState(false);
  const viewportRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const checkScroll = () => {
      setScrollTop(viewport.scrollTop > 0);
      setScrollBottom(
        viewport.scrollTop < viewport.scrollHeight - viewport.clientHeight
      );
    };

    checkScroll();
    viewport.addEventListener("scroll", checkScroll);
    return () => viewport.removeEventListener("scroll", checkScroll);
  }, [context?.open]);

  if (!context?.open) return null;

  return (
    <div
      ref={context?.contentRef}
      data-slot="select-content"
      data-state={context?.open ? "open" : "closed"}
      role="listbox"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 absolute z-50 max-h-96 min-w-32 overflow-x-hidden overflow-y-auto rounded-md border shadow-md mt-1",
        position === "popper" && "data-[side=bottom]:translate-y-1",
        className
      )}
      {...props}
    >
      {scrollTop && <SelectScrollUpButton />}
      <div
        ref={viewportRef}
        className={cn(
          "p-1",
          position === "popper" && "w-full min-w-(--radix-select-trigger-width)"
        )}
      >
        {children}
      </div>
      {scrollBottom && <SelectScrollDownButton />}
    </div>
  );
}

function SelectLabel({ className, children, ...props }) {
  return (
    <div
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectItem({ className, children, value, disabled, ...props }) {
  const context = React.useContext(SelectContext);
  const isSelected = context?.value === value;

  const handleClick = () => {
    if (!disabled) {
      context?.onValueChange(value);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      context?.onValueChange(value);
    }
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-slot="select-item"
      data-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent/80 [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected && <CheckIcon className="size-4" />}
      </span>
      <span className="flex items-center gap-2">{children}</span>
    </div>
  );
}

function SelectSeparator({ className, ...props }) {
  return (
    <div
      data-slot="select-separator"
      role="separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({ className, ...props }) {
  return (
    <div
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </div>
  );
}

function SelectScrollDownButton({ className, ...props }) {
  return (
    <div
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
