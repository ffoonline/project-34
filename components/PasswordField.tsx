"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export const authInputClass =
  "h-12 rounded-none border-input aria-invalid:border-red-600 aria-invalid:hover:border-red-600 hover:aria-invalid:border-red-600 focus-visible:aria-invalid:border-red-600 focus-visible:aria-invalid:ring-red-600/25 user-invalid:border-red-600 user-invalid:hover:border-red-600 hover:user-invalid:border-red-600 focus-visible:user-invalid:border-red-600";

export function PasswordField({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(authInputClass, "pe-12", className)}
      />
      <button
        type="button"
        className="absolute top-1/2 end-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((open) => !open)}
        aria-label={visible ? t("hidePassword") : t("showPassword")}
        aria-pressed={visible}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
