import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  if (session) redirect("/dashboard/orders");

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
