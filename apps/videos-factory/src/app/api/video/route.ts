import { Fetcher } from "@projectslab/helpers";
import { NextResponse } from "next/server";

export const GET = async () => {
    const testResponse = await Fetcher.get("http://localhost:3002/v1/video");

    return NextResponse.json(testResponse, { status: 200 });
};
