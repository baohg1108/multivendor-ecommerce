import { FC } from "react";
import { currentUser } from "@clerk/nextjs/server";
import Logo from "@/components/shared/logo";
import UserInfo from "./user-info";
import SidebarNavAdmin from "./nav-admin";
import {
  adminDashboardSidebarOptions,
  sellerDashboardSidebarOptions,
} from "@/constants/data";
import { Store } from "@prisma/client";
import SidebarNavSeller from "./nav-seller";
import { StoreSwitcher } from "./store-switcher";
interface SidebarProps {
  isAdmin?: boolean;
  stores?: Store[];
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin, stores }) => {
  const user = await currentUser();
  return (
    <div className="w-75 border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="180px" />
      <span className="mt-3" />
      {user && <UserInfo user={user}></UserInfo>}
      {!isAdmin && stores && <StoreSwitcher stores={stores}></StoreSwitcher>}
      {isAdmin ? (
        <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <SidebarNavSeller menuLinks={sellerDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default Sidebar;
