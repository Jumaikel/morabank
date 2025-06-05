"use client";

import { Button } from "../ui/Button";

export const AdminMenu = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6">
      <Button
        asLink
        href="/internet-banking/register"
        variant={"secondary"}
        className="px-5 py-2 transition w-2xl h-11"
      >
        Registrar Usuario
      </Button>
    </div>
  );
};
