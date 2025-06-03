import { UserAccountInfo } from "@/components/layout/UserAccountInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Cuenta | MoraBank`,
};

export default function AccountPage() {
  return (
    <div>
      <UserAccountInfo />
    </div>
  );
}
