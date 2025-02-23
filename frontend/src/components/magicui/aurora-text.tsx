"use client";

import { cn } from "@/util/utils";
import React from "react";

interface AuroraTextProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children: React.ReactNode;
}

export function AuroraText({ className, children, ...props }: AuroraTextProps) {
  return (
    <span
      className={cn(
        "relative inline-block text-transparent overflow-hidden bg-clip-text",
        className
      )}
      style={{
        overflow:"hidden",
        backgroundImage:
          "linear-gradient(90deg, hsl(var(--color-1)), hsl(var(--color-2)), hsl(var(--color-3)), hsl(var(--color-4)), hsl(var(--color-1)))",
        backgroundSize: "400% 100%",
        animation: "gradient-animation 10s linear infinite alternate",
      }}
      {...props}
    >
      {children}
      {/* <span className="pointer-events-none overflow-hidden absolute inset-0 mix-blend-lighten dark:mix-blend-darken">
        <span className="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]"></span>
      </span> */}
    </span>
  );
}