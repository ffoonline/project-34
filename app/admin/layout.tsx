import { AdminSidebar } from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
