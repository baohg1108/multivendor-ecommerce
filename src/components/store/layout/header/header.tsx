import Link from "next/link";
import Cart from "./cart";
import UserMenu from "./user-menu/user-menu";
import DownloadApp from "./download-app";
import Search from "./search/search";

export default function StoreHeader() {
  return (
    <div className="bg-linear-to-r from-slate-500 to-slate-800">
      <div className="h-full w-full lg:flex text-white px-4 lg:px-12">
        <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="font-extrabold text-3xl font-mono">GoShop</h1>
            </Link>
            <div className="flex lg:hidden">
              <UserMenu />
              <Cart></Cart>
            </div>
          </div>
          {/* Search input */}
          <Search></Search>
        </div>
        <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-6">
          <div className="lg:flex">
            <DownloadApp />
          </div>
          {/* Country selector */}
          <UserMenu></UserMenu>
          <Cart></Cart>
        </div>
      </div>
    </div>
  );
}
