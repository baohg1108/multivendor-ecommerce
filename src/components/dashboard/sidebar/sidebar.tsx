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
    <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-[300px] flex-col border-r bg-background p-4">
      <div className="shrink-0">
        <Logo width="100%" height="140px" />
      </div>
      <div className="mt-3 shrink-0">
        {user && <UserInfo user={user}></UserInfo>}
      </div>
      {!isAdmin && stores && (
        <div className="mt-2 shrink-0">
          <StoreSwitcher stores={stores}></StoreSwitcher>
        </div>
      )}
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
        {isAdmin ? (
          <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
        ) : (
          <SidebarNavSeller menuLinks={sellerDashboardSidebarOptions} />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
