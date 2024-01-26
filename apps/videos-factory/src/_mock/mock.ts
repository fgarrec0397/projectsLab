import { sub } from "date-fns";

import { ASSETS_API } from "@/config-global";

import {
    ages,
    booleans,
    companyNames,
    descriptions,
    emails,
    firstNames,
    fullAddress,
    fullNames,
    id,
    jobTitles,
    lastNames,
    nativeL,
    nativeM,
    nativeS,
    percents,
    phoneNumbers,
    postTitles,
    prices,
    productNames,
    ratings,
    roles,
    sentences,
    taskNames,
    tourNames,
} from "./assets";

// ----------------------------------------------------------------------

export const mock = {
    id: (index: number) => id[index],
    time: (index: number) => sub(new Date(), { days: index, hours: index }),
    boolean: (index: number) => booleans[index],
    role: (index: number) => roles[index],
    // Text
    taskNames: (index: number) => taskNames[index],
    postTitle: (index: number) => postTitles[index],
    jobTitle: (index: number) => jobTitles[index],
    tourName: (index: number) => tourNames[index],
    productName: (index: number) => productNames[index],
    sentence: (index: number) => sentences[index],
    description: (index: number) => descriptions[index],
    // Contact
    email: (index: number) => emails[index],
    phoneNumber: (index: number) => phoneNumbers[index],
    fullAddress: (index: number) => fullAddress[index],
    // Name
    firstName: (index: number) => firstNames[index],
    lastName: (index: number) => lastNames[index],
    fullName: (index: number) => fullNames[index],
    companyName: (index: number) => companyNames[index],
    // Number
    number: {
        percent: (index: number) => percents[index],
        rating: (index: number) => ratings[index],
        age: (index: number) => ages[index],
        price: (index: number) => prices[index],
        nativeS: (index: number) => nativeS[index],
        nativeM: (index: number) => nativeM[index],
        nativeL: (index: number) => nativeL[index],
    },
    // Image
    image: {
        cover: (index: number) => `${ASSETS_API}/assets/images/cover/cover_${index + 1}.jpg`,
        avatar: (index: number) => `${ASSETS_API}/assets/images/avatar/avatar_${index + 1}.jpg`,
        travel: (index: number) => `${ASSETS_API}/assets/images/travel/travel_${index + 1}.jpg`,
        company: (index: number) => `${ASSETS_API}/assets/images/company/company_${index + 1}.png`,
        product: (index: number) =>
            `${ASSETS_API}/assets/images/m_product/product_${index + 1}.jpg`,
        portrait: (index: number) =>
            `${ASSETS_API}/assets/images/portrait/portrait_${index + 1}.jpg`,
    },
};
