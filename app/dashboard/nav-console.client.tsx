"use client";

import { NavDocuments } from "@/components/nav-documents";
import { IconDashboard } from "@tabler/icons-react";

const NavConsoleClient = () => (
  <NavDocuments
    items={[
      {
        name: "Console",
        url: "/dashboard",
        icon: IconDashboard,
      },
    ]}
  />
);

export default NavConsoleClient;
