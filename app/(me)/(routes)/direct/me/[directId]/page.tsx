import { authProfile } from "@/lib/auth-profile";
import { redirectToSignIn } from "@clerk/nextjs";

const DirectMePage = async () => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      This is me page
    </div>
  );
};

export default DirectMePage;
