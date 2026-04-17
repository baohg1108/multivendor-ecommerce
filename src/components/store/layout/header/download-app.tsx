import { AppIcon } from "../../icons";
import Link from "next/link";
import PlayStoreImg from "../../../../../public/assets/images/google-play.png";
import AppStoreImg from "../../../../../public/assets/images/app-store.png";
import Image from "next/image";

export default function DownloadApp() {
  return (
    <div className="relative group">
      {/* Trigger */}
      <div className="flex h-11 items-center px-2 cursor-pointer">
        <span className="text-[32px]">
          <AppIcon></AppIcon>
        </span>
        <div className="ml-1">
          <b className="max-w-[90px] inline-block font-medium text-xs text-white">
            Download the GoShop app
          </b>
        </div>
      </div>
      {/* Content */}
      <div className="absolute hidden top-0 group-hover:block cursor-pointer">
        <div className="relative mt-12 -ml-20 w-[300px] bg-white rounded-3xl text-black pt-2 px-1 pb-6 z-50 shadow-lg">
          {/* Triangle */}
          {/* <div className="h-0 w-0 absolute -top-1.5 right-10 border-l-[10px] rounded-3xl text-black border-b-[10px] border-white border-r-[10px] border-r-transparent"></div> */}
          <div
            className="w-0 h-0 absolute left-1/2 -translate-x-1/2 -top-2
              border-l-[10px] border-l-transparent
              border-r-[10px] border-r-transparent
              border-b-[10px] border-b-white"
          ></div>
          <div className="py-3 px-1 break-words">
            <div className="mx-3">
              <h3 className="font-bold text-[20px] text-black m-0 max-w-40 mx-auto">
                Download the GoShop app
              </h3>
              <div className="mt-4 flex items-center gap-x-2">
                <Link
                  href=""
                  className="rounded-3xl bg-black grid place-items-center px-4 py-3 "
                >
                  <Image src={AppStoreImg} alt="App Store" />
                </Link>
                <Link
                  href=""
                  className="rounded-3xl bg-black grid place-items-center px-4 py-3 "
                >
                  <Image src={PlayStoreImg} alt="Google Play" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
