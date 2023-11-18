import { Fetcher } from "@projectslab/helpers";
import { NextResponse } from "next/server";

export const GET = async () => {
    const testResponse = await Fetcher.get("http://localhost:3001/ok");

    return NextResponse.json(testResponse, { status: 200 });
};
