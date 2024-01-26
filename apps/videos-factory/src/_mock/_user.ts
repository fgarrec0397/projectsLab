import { countries } from "@/assets/data";

import { mock } from "./mock";

// ----------------------------------------------------------------------

export const USER_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "banned", label: "Banned" },
    { value: "rejected", label: "Rejected" },
];

export const userAbout = {
    id: mock.id(1),
    role: mock.role(1),
    email: mock.email(1),
    country: countries[1].label,
    school: mock.companyName(2),
    company: mock.companyName(1),
    coverUrl: mock.image.cover(3),
    totalFollowers: mock.number.nativeL(1),
    totalFollowing: mock.number.nativeL(2),
    quote: "Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..",
    socialLinks: {
        facebook: `https://www.facebook.com/caitlyn.kerluke`,
        instagram: `https://www.instagram.com/caitlyn.kerluke`,
        linkedin: `https://www.linkedin.com/in/caitlyn.kerluke`,
        twitter: `https://www.twitter.com/caitlyn.kerluke`,
    },
};

export const userFollowers = [...Array(18)].map((_, index) => ({
    id: mock.id(index),
    name: mock.fullName(index),
    country: countries[index + 1].label,
    avatarUrl: mock.image.avatar(index),
}));

export const userFriends = [...Array(18)].map((_, index) => ({
    id: mock.id(index),
    role: mock.role(index),
    name: mock.fullName(index),
    avatarUrl: mock.image.avatar(index),
}));

export const userGallery = [...Array(12)].map((_, index) => ({
    id: mock.id(index),
    postedAt: mock.time(index),
    title: mock.postTitle(index),
    imageUrl: mock.image.cover(index),
}));

export const userFeeds = [...Array(3)].map((_, index) => ({
    id: mock.id(index),
    createdAt: mock.time(index),
    media: mock.image.travel(index + 1),
    message: mock.sentence(index),
    personLikes: [...Array(20)].map((__, personIndex) => ({
        name: mock.fullName(personIndex),
        avatarUrl: mock.image.avatar(personIndex + 2),
    })),
    comments: (index === 2 && []) || [
        {
            id: mock.id(7),
            author: {
                id: mock.id(8),
                avatarUrl: mock.image.avatar(index + 5),
                name: mock.fullName(index + 5),
            },
            createdAt: mock.time(2),
            message: "Praesent venenatis metus at",
        },
        {
            id: mock.id(9),
            author: {
                id: mock.id(10),
                avatarUrl: mock.image.avatar(index + 6),
                name: mock.fullName(index + 6),
            },
            createdAt: mock.time(3),
            message:
                "Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.",
        },
    ],
}));

export const userCards = [...Array(21)].map((_, index) => ({
    id: mock.id(index),
    role: mock.role(index),
    name: mock.fullName(index),
    coverUrl: mock.image.cover(index),
    avatarUrl: mock.image.avatar(index),
    totalFollowers: mock.number.nativeL(index),
    totalPosts: mock.number.nativeL(index + 2),
    totalFollowing: mock.number.nativeL(index + 1),
}));

export const userPayment = [...Array(3)].map((_, index) => ({
    id: mock.id(index),
    cardNumber: ["**** **** **** 1234", "**** **** **** 5678", "**** **** **** 7878"][index],
    cardType: ["mastercard", "visa", "visa"][index],
    primary: index === 1,
}));

export const userAddressBook = [...Array(4)].map((_, index) => ({
    id: mock.id(index),
    primary: index === 0,
    name: mock.fullName(index),
    phoneNumber: mock.phoneNumber(index),
    fullAddress: mock.fullAddress(index),
    addressType: (index === 0 && "Home") || "Office",
}));

export const userInvoices = [...Array(10)].map((_, index) => ({
    id: mock.id(index),
    invoiceNumber: `INV-199${index}`,
    createdAt: mock.time(index),
    price: mock.number.price(index),
}));

export const userPlans = [
    {
        subscription: "basic",
        price: 0,
        primary: false,
    },
    {
        subscription: "starter",
        price: 4.99,
        primary: true,
    },
    {
        subscription: "premium",
        price: 9.99,
        primary: false,
    },
];

export const userList = [...Array(20)].map((_, index) => ({
    id: mock.id(index),
    zipCode: "85807",
    state: "Virginia",
    city: "Rancho Cordova",
    role: mock.role(index),
    email: mock.email(index),
    address: "908 Jack Locks",
    name: mock.fullName(index),
    isVerified: mock.boolean(index),
    company: mock.companyName(index),
    country: countries[index + 1].label,
    avatarUrl: mock.image.avatar(index),
    phoneNumber: mock.phoneNumber(index),
    status:
        (index % 2 && "pending") ||
        (index % 3 && "banned") ||
        (index % 4 && "rejected") ||
        "active",
}));
