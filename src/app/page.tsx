import { auth } from "@/lib/auth";
import HomeTemplate from "@/templates/home/home-template";

export default async function Home() {
  const session = await auth();

  return (
    <HomeTemplate
      user={
        session?.user
          ? {
              name: session.user.name ?? null,
              email: session.user.email ?? null,
              image: session.user.image ?? null,
            }
          : null
      }
    />
  );
}
