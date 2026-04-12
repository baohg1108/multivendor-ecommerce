import React from "react";
import { User } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function UserInfo({ user }: { user: User | null }) {
  const role = user?.privateMetadata.role?.toString();

  return (
    <div>
      <div>
        <Button
          className="my-4 flex w-full items-center justify-between py-10"
          variant="ghost"
        >
          <div className="flex min-w-0 items-center gap-2 text-left">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={user?.imageUrl}
                alt={`${user?.firstName || "User"} ${user?.lastName || "User"}`}
              />
              <AvatarFallback className="bg-primary text-white">
                {user?.firstName} {user?.lastName}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col gap-y-1">
              <span className="truncate font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="w-fit">
                <Badge variant="secondary" className="capitalize">
                  {role ? `${role.toLocaleLowerCase()} Dashboard` : "Dashboard"}
                </Badge>
              </span>
              <span
                className="max-w-45 truncate text-sm text-muted-foreground"
                title={user?.emailAddresses[0].emailAddress}
              >
                {user?.emailAddresses[0].emailAddress}
              </span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
