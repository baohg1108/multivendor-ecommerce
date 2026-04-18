// import React from "react";
// import { Headset } from "lucide-react";
// import SocialLogo from "social-logos";

// export default function Contact() {
//   return (
//     <div className="flex flex-col gap-y-5">
//       <div className="space-y-2">
//         <div className="flex items-center gap-x-6">
//           <Headset className="scale-[190%] stroke-slate-400" />
//           <div className="flex flex-col">
//             <span className="text-[#59645f] text-sm">
//               Got questions? Call us 24/7
//             </span>
//             <span className="text-xl">(+84) 388661185</span>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col">
//         <b>Contact Info</b>
//         <span className="text-sm">
//           GGC5+6G9, Đạ Tẻh 3, Lâm Đồng 66608, Việt Nam
//         </span>
//         <div className="flex flex-wrap gap-2 mt-4">
//           <SocialLogo
//             icon="facebook"
//             size={28}
//             fill="#7c7c7c"
//             className="cursor-pointer hover:fill-slate-600"
//           ></SocialLogo>
//           <SocialLogo
//             icon="instagram"
//             size={28}
//             fill="#7c7c7c"
//             className="cursor-pointer hover:fill-slate-600"
//           ></SocialLogo>
//           <SocialLogo
//             icon="linkedin"
//             size={28}
//             fill="#7c7c7c"
//             className="cursor-pointer hover:fill-slate-600"
//           ></SocialLogo>
//           <SocialLogo
//             icon="pinterest"
//             size={28}
//             fill="#7c7c7c"
//             className="cursor-pointer hover:fill-slate-600"
//           ></SocialLogo>
//           <SocialLogo
//             icon="twitter"
//             size={28}
//             fill="#7c7c7c"
//             className="cursor-pointer hover:fill-slate-600"
//           ></SocialLogo>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Headset } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";

const SOCIALS = [
  { icon: FaFacebookF, href: "#" },
  { icon: FaInstagram, href: "#" },
  { icon: FaLinkedinIn, href: "#" },
  { icon: FaPinterestP, href: "#" },
  { icon: FaTwitter, href: "#" },
];

export default function Contact() {
  return (
    <div className="flex flex-col gap-5">
      {/* Support */}
      <div className="flex items-center gap-4">
        <Headset className="w-6 h-6 text-slate-400" />
        <div>
          <p className="text-sm text-slate-500">Got questions? Call us 24/7</p>
          <p className="text-lg font-medium">(+84) 388661185</p>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <p className="font-semibold">Contact Info</p>
        <p className="text-sm text-slate-500">
          GGC5+6G9, Đạ Tẻh 3, Lâm Đồng, Việt Nam
        </p>

        {/* Social */}
        <div className="flex mt-4 gap-3">
          {SOCIALS.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Icon className="w-4 h-4 text-slate-500 hover:text-slate-700" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
