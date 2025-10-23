import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
import { cn } from "../../utils/cn";

// Context para compartir el estado del Dialog
const DialogContext = React.createContext(null);

function Dialog({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
  ...props
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const currentOpen = open !== undefined ? open : internalOpen;

  const handleOpenChange = (newOpen) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider
      value={{ open: currentOpen, onOpenChange: handleOpenChange }}
    >
      <div data-slot="dialog" {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children, asChild = false, ...props }) {
  const context = React.useContext(DialogContext);

  const handleClick = (e) => {
    e.preventDefault();
    context?.onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

function DialogPortal({ children, container }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-slot="dialog-portal">{children}</div>,
    container || document.body
  );
}

function DialogClose({ children, asChild = false, ...props }) {
  const context = React.useContext(DialogContext);

  const handleClick = (e) => {
    e.preventDefault();
    context?.onOpenChange(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <button
      type="button"
      data-slot="dialog-close"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

function DialogOverlay({ className, ...props }) {
  const context = React.useContext(DialogContext);

  const handleClick = (e) => {
    if (e.target === e.currentTarget) {
      context?.onOpenChange(false);
    }
  };

  if (!context?.open) return null;

  return (
    <div
      data-slot="dialog-overlay"
      data-state={context?.open ? "open" : "closed"}
      onClick={handleClick}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  const context = React.useContext(DialogContext);
  const contentRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!context?.open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        context?.onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.open]);

  // Focus trap
  useEffect(() => {
    if (!context?.open || !contentRef.current) return;

    const focusableElements = contentRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element on open
    firstElement?.focus();

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [context?.open]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (context?.open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [context?.open]);

  if (!context?.open) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        data-slot="dialog-content"
        data-state={context?.open ? "open" : "closed"}
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            type="button"
            onClick={() => context?.onOpenChange(false)}
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
