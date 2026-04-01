import { FC } from "react";
import { currentUser } from "@clerk/nextjs/server";
import Logo from "@/components/shared/logo";
import UserInfo from "@/components/dashboard/sidebar/user-info";

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin }) => {
  const user = await currentUser();
  return (
    <div className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="180px" />
      <span className="mt-3">
        <UserInfo user={user}></UserInfo>
      </span>
    </div>
  );
};

export default Sidebar;
