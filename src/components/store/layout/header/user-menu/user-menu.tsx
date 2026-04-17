import { currentUser } from "@clerk/nextjs/server";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/store/layout/ui/button";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import MessageIcon from "@/components/store/icons/message";
import OrderIcon from "@/components/store/icons/order";
import WishlistIcon from "@/components/store/icons/wishlist";

export default async function UserMenu() {
  const user = await currentUser();

  return (
    <div className="relative group">
      {/* Trigger */}
      <div>
        {user ? (
          <Image
            src={user.imageUrl}
            alt={user.fullName!}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-11 items-center py-0 mx-2 cursor-pointer">
            <span className="text-2xl">
              <UserIcon></UserIcon>
            </span>
            <div className="ml-1">
              <span className="block text-xs text-white leading-3">
                Welcome
              </span>
              <b className="font-bold text-xs text-white leading-4"></b>
              <span>Sign in | Register</span>
              <span className="text-white scale-[60%] align-middle inline-block"></span>
            </div>
          </div>
        )}
      </div>
      {/* content */}
      <div
        className={cn(
          "hidden absolute top-0 -left-20 group-hover:block cursor-pointer",
          {
            "-left-[200px] lg:-left-[138px]": user,
          },
        )}
      >
        <div className="relative left-2 mt-10 right-auto bottom-auto pt-2.5 text-[#222] p-0 text-sm z-40">
          {/* Triangle */}
          <div className="w-0 h-0 absolute left-[149px] top-1 right-24 !border-l-[10px] !border-l-transparent !border-r-[10px] !border-r-transparent !border-b-[10px] border-b-white"></div>
          {/* Menu */}
          <div className="rounded-3xl bg-white text-sm text-[#222] shadow-lg">
            <div className="w-[305px]">
              <div className="pt-5 px-6 pb-0">
                {user ? (
                  <div className="user-avatar flex cursor-pointer flex-col items-center justify-center">
                    <UserButton></UserButton>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Button
                      asChild
                      className="h-11 bg-[#FD384F] text-white hover:bg-[#e23246]"
                    >
                      <Link href="/auth/sign-in">Sign In</Link>
                    </Button>
                    <Link
                      href="/auth/sign-up"
                      className="flex h-10 items-center justify-center text-sm text-main-primary hover:underline"
                    >
                      Register
                    </Link>
                  </div>
                )}
                {user && (
                  <p className="my-3 text-center text-sm text-main-primary cursor-pointer">
                    <SignOutButton></SignOutButton>
                  </p>
                )}
                <Separator></Separator>
              </div>
              {/* Links */}
              <div className="pt-0 px-2 pb-4 text-main-secondary">
                <ul className="grid grid-cols-3 gap-2 py-2.5 ^px4 w-full">
                  {links.map((item) => (
                    <li key={item.title} className="grid place-items-center">
                      <Link href={item.link} className="space-y-2">
                        <div className="w-14 h-14 rounded-full p-2 grid place-items-center bg-gray-100 hover:bg-gray-200">
                          <span className="text-gray-500">{item.icon}</span>
                        </div>
                        <span className="block text-xs">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Separator className="mx-auto !max-w-[257px]" />
                <ul className="w-[288px] px-4 pt-2.5 pb-1">
                  {extraLinks.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.link}
                        className="block py-1.5 text-sm text-main-primary hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const links = [
  {
    icon: <OrderIcon></OrderIcon>,
    title: "Orders",
    link: "/profile/orders",
  },
  {
    icon: <MessageIcon></MessageIcon>,
    title: "Messages",
    link: "/profile/messages",
  },
  {
    icon: <WishlistIcon></WishlistIcon>,
    title: "Wishlist",
    link: "/profile/wishlist",
  },
];

const extraLinks = [
  {
    title: "Settings",
    link: "/",
  },
  {
    title: "Become a Seller",
    link: "/become-seller",
  },
  {
    title: "Help Center",
    link: "",
  },
  {
    title: "Returns & Refunds",
    link: "/",
  },
  {
    title: "Legals & Privacy",
    link: "/",
  },
  {
    title: "Discounts & Offers",
    link: "/",
  },
  {
    title: "Orders Dispute Resolution",
    link: "/",
  },
  {
    title: "Reports a Problem",
    link: "/",
  },
];
