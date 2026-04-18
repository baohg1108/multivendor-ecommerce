import React from "react";
import NewsLetter from "./newsletter";
import Contact from "./contact";
import Links from "./links";
import { getSubcategories } from "@/queries/subCategory";

export default async function Footer() {
  const subs = await getSubcategories(7, true);
  return (
    <div className="w-full bg-white">
      <NewsLetter></NewsLetter>
      <div className="max-w-[1430px] mx-auto">
        <div className="p-5">
          <div className="grid md:grid-cols-2 md:gap-x-5">
            <Contact></Contact>
            <Links subs={subs}></Links>
          </div>
        </div>
      </div>
      {/* Rights */}
      <div className="bg-gradient-to-r from-slate-500 to-slate-800 px-2 text-white">
        <div className="max-w-[1430px] max-auto flex items-center h-7">
          <span className="text-sm">
            &copy; 2026 GoShop. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
