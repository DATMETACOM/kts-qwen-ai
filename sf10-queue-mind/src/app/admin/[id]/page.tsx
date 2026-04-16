import { notFound } from "next/navigation";
import { BRANCHES } from "@/lib/data";
import { AdminClient } from "@/components/AdminClient";

interface PageProps {
  params: { id: string };
}

export default function AdminPage({ params }: PageProps) {
  const branch = BRANCHES.find((b) => b.id === params.id);
  if (!branch) notFound();

  return <AdminClient branch={branch} />;
}
