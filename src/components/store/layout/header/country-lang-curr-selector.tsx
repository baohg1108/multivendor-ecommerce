"use client";

import { Country, SelectMenuOption } from "@/lib/types";
import "flag-icons/css/flag-icons.min.css";
import { ChevronDown } from "lucide-react";
import CountrySelector from "@/components/shared/country-selector";
import React from "react";
import { countries } from "../../../../data/countries";
import { useRouter } from "next/navigation";

export default function CountryLanguageCurrencySelector({
  userCountry,
}: {
  userCountry: Country;
}) {
  const router = useRouter();
  // state to manage countries dropdown visibility
  const [show, setshow] = React.useState(false);

  const handleCountryClick = async (countryCode: string) => {
    const countryData = countries.find((c) => c.code === countryCode);

    if (countryData) {
      const data: Country = {
        name: countryData.name,
        code: countryData.code,
        city: "",
        region: "",
      };

      try {
        // send a POST request to the server to set the cookie
        const response = await fetch("/api/setUserCountryInCookies", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ userCountry: data }),
        });

        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error("Error setting country cookie:", error);
      }
    }
  };
  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <div>
        <div className="flex items-center h-11 py-0 px-2 cursor-pointer rounded-md hover:bg-white/10 transition-colors">
          <span className="mr-0.5 h-8.25 grid place-items-center">
            <span className={`fi fi-${userCountry.code.toLowerCase()}`}></span>
          </span>
          <div className="ml-1">
            <span className="block text-xs text-white leading-3 mt-2">
              {userCountry.name}/EN/
            </span>
            <b className="text-xs font-bold text-white">
              USD
              <span className="text-white scale-[60%] align-middle inline-block">
                <ChevronDown></ChevronDown>
              </span>
            </b>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="absolute hidden top-full right-0 pt-2 group-hover:block cursor-pointer z-30">
        <div className="relative w-[320px] bg-white rounded-2xl border border-gray-200 shadow-xl text-black p-4">
          {/* Triangle */}
          <div className="w-0 h-0 absolute right-8 -top-2 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>
          <div className="text-base font-semibold">Ship to</div>
          <div className="mt-2">
            <div className="relative text-black bg-white rounded-lg">
              <CountrySelector
                id={"countries"}
                open={show}
                onToggle={() => setshow(!show)}
                onChange={(val) => handleCountryClick(val)}
                selectedValue={
                  (countries.find(
                    (option) => option.code === userCountry?.code,
                  ) as SelectMenuOption) || countries[0]
                }
              ></CountrySelector>

              <div>
                <div className="mt-4 leading-6 text-base font-semibold">
                  Language
                </div>
                <div className="relative mt-2">
                  <div className="flex items-center justify-between h-11 px-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:border-gray-300 transition-all cursor-pointer">
                    <span className="text-sm text-gray-700">English (EN)</span>

                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <div className="mt-4 leading-6 text-base font-semibold">
                  Currency
                </div>
                <div className="relative mt-2">
                  <div className="flex items-center justify-between h-11 px-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:border-gray-300 transition-all cursor-pointer">
                    <span className="text-sm text-gray-700">
                      USD (US Dollar)
                    </span>

                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
