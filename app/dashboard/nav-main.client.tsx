"use client";

import { NavMain } from "@/components/nav-main";
import { IconDashboard, IconMap } from "@tabler/icons-react";

const NavMainClient = () => (
  <NavMain
    items={[
      {
        title: "Bảng điều khiển",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Bản đồ",
        url: "/dashboard/map",
        icon: IconMap,
      },
    ]}
  />
);

export default NavMainClient;
