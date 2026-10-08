import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  children: ReactNode;
  className?: string;
}

const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const router = useRouter();

  const onLogout = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <span onClick={onLogout} className={className ?? "cursor-pointer"}>
      {children}
    </span>
  );
};

export default LogoutButton;
