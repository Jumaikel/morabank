import { AdminMenu } from "@/components/common/AdminMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Administración | MoraBank`,
};

export default function AccountPage() {
  return (
    <div>
      <AdminMenu />
    </div>
  );
}