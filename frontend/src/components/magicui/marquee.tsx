import { cn } from "@/util/utils";
import { ComponentPropsWithoutRef } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  // Constructing the class names conditionally based on props
  const marqueeClasses = cn(
    "flex shrink-0 justify-around [gap:var(--gap)]", // Always present
    vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row", // Conditional for vertical vs horizontal
    pauseOnHover ? "group-hover:[animation-play-state:paused]" : "", // Conditional for pauseOnHover
    reverse ? "[animation-direction:reverse]" : "" // Conditional for reverse animation
  );

  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row", // Flex direction conditional
        className // Allow for external custom classes
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div key={i} className={marqueeClasses}>
            {children}
          </div>
        ))}
    </div>
  );
}
