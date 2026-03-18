

"use client";

import { usePathname } from "next/navigation";

const HIDDEN_ON = ["/","/parent/", "/merchant/", "/admin/", "/auth"];

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname  = usePathname();
  const isAppPage = HIDDEN_ON.some((route) => 
    route === "/" ? pathname === "/" :
    pathname.startsWith(route));

  return (
    <div className={isAppPage ? "" : "pt-20"}>
      {children}
    </div>
  );
}