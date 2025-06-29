"use client";

import { NavDocuments } from "@/components/nav-documents";
import { IconDatabase } from "@tabler/icons-react";

const NavConsoleClient = () => (
  <NavDocuments
    items={[
      {
        name: "CSDL",
        url: "/dashboard",
        icon: IconDatabase,
      },
    ]}
  />
);

export default NavConsoleClient;
