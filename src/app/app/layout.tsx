import { getServerAuthSession } from "~/server/auth";
import BasicLayout from "../_components/BasicLayout";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return <BasicLayout session={session}>{children}</BasicLayout>;
}
