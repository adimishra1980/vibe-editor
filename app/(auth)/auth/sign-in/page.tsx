import SignInFormClient from "@/modules/auth/components/sign-in-form-client";
import Image from "next/image";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full gap-12">
      <div className="">
        <Image
          src="/login.svg"
          alt="Auth banner"
          width={300}
          height={300}
          className="m-6 object-cover"
        />
      </div>

      <SignInFormClient />
    </div>
  );
};

export default SignInPage;
