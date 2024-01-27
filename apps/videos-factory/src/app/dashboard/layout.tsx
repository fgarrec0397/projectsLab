"use client";

import { AuthGuard } from "@/auth/guard";
import DashboardLayout from "@/layouts/dashboard";

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    console.log("AuthGuard");

    return (
        <AuthGuard>
            <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
    );
}
