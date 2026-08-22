import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "glow-violet" | "glow-cyan" | "bordered";
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "default", hoverable = false, children, ...props }, ref) => {
    const baseStyles =
      "rounded-xl bg-[#1A1C2B] border border-[#2E334A] text-[#F5F7FF] transition-all duration-200";

    const variantStyles = {
      default: "",
      interactive:
        "hover:border-[#783DF2] hover:bg-[#1E2033] hover:shadow-[0_0_20px_rgba(120,61,242,0.25)] cursor-pointer transform hover:-translate-y-0.5",
      "glow-violet":
        "border-[#783DF2]/50 shadow-[0_0_25px_rgba(120,61,242,0.2)] hover:border-[#783DF2] hover:shadow-[0_0_30px_rgba(120,61,242,0.35)]",
      "glow-cyan":
        "border-[#1FD1EB]/50 shadow-[0_0_25px_rgba(31,209,235,0.2)] hover:border-[#1FD1EB] hover:shadow-[0_0_30px_rgba(31,209,235,0.35)]",
      bordered: "border-2 border-[#2E334A] bg-[#131521]",
    };

    const hoverClass =
      hoverable && variant === "default"
        ? "hover:border-[#783DF2]/60 hover:bg-[#1E2033] hover:shadow-[0_0_15px_rgba(120,61,242,0.2)] cursor-pointer"
        : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${hoverClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", as: Tag = "h3", children, ...props }, ref) => (
    <Tag
      ref={ref}
      className={`text-lg font-bold leading-none tracking-tight text-white ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
);
CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = "", children, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-[#949CB2] ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
