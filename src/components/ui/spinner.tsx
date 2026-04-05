import { IconRefresh } from "@/components/icons";

export function Spinner({ className }: { className?: string }) {
  return <IconRefresh className={`animate-spin ${className || ""}`} />;
}
