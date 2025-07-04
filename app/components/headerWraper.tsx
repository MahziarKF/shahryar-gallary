// app/components/HeaderWrapper.tsx (or anywhere inside your app directory)
import { getUser } from "@/lib/auth";
import Header from "./header";

export default async function HeaderWrapper({
  sticky = false,
}: {
  sticky: boolean;
}) {
  const user: any = await getUser();

  return <Header user={user} sticky={sticky} />;
}
