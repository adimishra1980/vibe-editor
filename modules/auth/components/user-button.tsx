"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import LogoutButton from "./logout-button";
import { useCurrentUser } from "../hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";

const UserButton = () => {
  const user = useCurrentUser();

  if (!user) return <Skeleton className="size-9 rounded-full" />;

  const initials = user.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.email
      ? user.email.slice(0, 2).toUpperCase()
      : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar className="size-9 ring-1 ring-border/60 transition-all hover:ring-border hover:shadow-xs">
          <AvatarImage
            src={user.image as string}
            alt={user.name || "User avatar"}
          />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
            {initials || <User className="size-4" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-60 p-1.5 shadow-lg rounded-xl border border-border/60"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 px-2.5 py-2">
              <Avatar className="size-9 shrink-0">
                <AvatarImage
                  src={user.image as string}
                  alt={user.name || "User avatar"}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {initials || <User className="size-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
                {user.name && (
                  <p className="text-sm font-semibold text-foreground truncate leading-none">
                    {user.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground truncate leading-snug">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1" />

          <LogoutButton className="block w-full">
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer font-medium"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
