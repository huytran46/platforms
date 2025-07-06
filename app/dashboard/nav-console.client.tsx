"use client";

import { NavDocuments } from "@/components/nav-documents";
import { IconDatabase } from "@tabler/icons-react";

const NavConsoleClient = () => (
  <NavDocuments
    items={[
      {
        name: "CSDL",
        url: "/dashboard/database",
        icon: IconDatabase,
      },
    ]}
  />
);

export default NavConsoleClient;
