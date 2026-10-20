import type { ReactNode } from "react";

// Caveat margin note. Only for words Abinash wrote himself (see FACTS → Known false claims).
export function HandNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`hand -rotate-2 ${className}`}>{children}</p>;
}
