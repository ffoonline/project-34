import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  invert?: boolean;
  size?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({
  invert = false,
  size = 56,
  className,
  priority = false,
}: LogoProps) {
  return (
    <Image
      src={invert ? "/brand/34-white.png" : "/brand/34-black.png"}
      alt="THIRTY FOUR"
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={cn("select-none bg-transparent", className)}
    />
  );
}
