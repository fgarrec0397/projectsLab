"use client";

import PageWrapper from "@/components/page-wrapper/page-wrapper";

import AccountGeneral from "../account-general";

// ----------------------------------------------------------------------

export default function AccountView() {
    return (
        <PageWrapper title="My Account">
            <AccountGeneral />
        </PageWrapper>
    );
}
