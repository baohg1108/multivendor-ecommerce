import Link from "next/link";
import Cart from "./cart";
import UserMenu from "./user-menu/user-menu";
import DownloadApp from "./download-app";
import Search from "./search/search";
import { cookies } from "next/headers";
import { Country } from "@/lib/types";
import CountryLanguageCurrencySelector from "./country-lang-curr-selector";
import { countries } from "../../../../data/countries";

export default async function StoreHeader() {
  // get cookies from the store
  const cookieStore = await cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  // set default country to US if cookie is not found
  let userCountry: Country = {
    name: "United States",
    city: "",
    code: "US",
    region: "",
  };

  // if cookie exists
  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }

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
          <CountryLanguageCurrencySelector userCountry={userCountry} />
          <UserMenu></UserMenu>
          <Cart></Cart>
        </div>
      </div>
    </div>
  );
}
