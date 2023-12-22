import { authProfile } from "@/lib/auth-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface DirectMePage {
  params: {
    directId: string;
  };
}

const DirectMePage = async ({ params }: DirectMePage) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  return redirect(`/direct/me/${params.directId}/friend-all`);
};

export default DirectMePage;
