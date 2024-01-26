import { mock } from "./mock";

// APP
// ----------------------------------------------------------------------

export const appRelated = ["Chrome", "Drive", "Dropbox", "Evernote", "Github"].map(
    (name, index) => {
        const system = [2, 4].includes(index) ? "Windows" : "Mac";

        const price = [2, 4].includes(index) ? mock.number.price(index) : 0;

        const shortcut =
            (name === "Chrome" && "/assets/icons/app/ic_chrome.svg") ||
            (name === "Drive" && "/assets/icons/app/ic_drive.svg") ||
            (name === "Dropbox" && "/assets/icons/app/ic_dropbox.svg") ||
            (name === "Evernote" && "/assets/icons/app/ic_evernote.svg") ||
            "/assets/icons/app/ic_github.svg";

        return {
            id: mock.id(index),
            name,
            price,
            system,
            shortcut,
            ratingNumber: mock.number.rating(index),
            totalReviews: mock.number.nativeL(index),
        };
    }
);

export const appInstalled = ["Germany", "England", "France", "Korean", "USA"].map(
    (name, index) => ({
        id: mock.id(index),
        name,
        android: mock.number.nativeL(index),
        windows: mock.number.nativeL(index + 1),
        apple: mock.number.nativeL(index + 2),
        flag: ["flagpack:de", "flagpack:gb-nir", "flagpack:fr", "flagpack:kr", "flagpack:us"][
            index
        ],
    })
);

export const appAuthors = [...Array(3)].map((_, index) => ({
    id: mock.id(index),
    name: mock.fullName(index),
    avatarUrl: mock.image.avatar(index),
    totalFavorites: mock.number.nativeL(index),
}));

export const appInvoices = [...Array(5)].map((_, index) => {
    const category = ["Android", "Mac", "Windows", "Android", "Mac"][index];

    const status = ["paid", "out of date", "progress", "paid", "paid"][index];

    return {
        id: mock.id(index),
        invoiceNumber: `INV-199${index}`,
        price: mock.number.price(index),
        category,
        status,
    };
});

export const appFeatured = [...Array(3)].map((_, index) => ({
    id: mock.id(index),
    title: mock.postTitle(index),
    description: mock.sentence(index),
    coverUrl: mock.image.cover(index),
}));

// ANALYTIC
// ----------------------------------------------------------------------

export const analyticTasks = [...Array(5)].map((_, index) => ({
    id: mock.id(index),
    name: mock.taskNames(index),
}));

export const analyticPosts = [...Array(5)].map((_, index) => ({
    id: mock.id(index),
    postedAt: mock.time(index),
    title: mock.postTitle(index),
    coverUrl: mock.image.cover(index),
    description: mock.sentence(index),
}));

export const analyticOrderTimeline = [...Array(5)].map((_, index) => {
    const title = [
        "1983, orders, $4220",
        "12 Invoices have been paid",
        "Order #37745 from September",
        "New order placed #XF-2356",
        "New order placed #XF-2346",
    ][index];

    return {
        id: mock.id(index),
        title,
        type: `order${index + 1}`,
        time: mock.time(index),
    };
});

export const analyticTraffic = [
    {
        value: "facebook",
        label: "FaceBook",
        total: mock.number.nativeL(1),
        icon: "eva:facebook-fill",
    },
    {
        value: "google",
        label: "Google",
        total: mock.number.nativeL(2),
        icon: "eva:google-fill",
    },
    {
        value: "linkedin",
        label: "Linkedin",
        total: mock.number.nativeL(3),
        icon: "eva:linkedin-fill",
    },
    {
        value: "twitter",
        label: "Twitter",
        total: mock.number.nativeL(4),
        icon: "eva:twitter-fill",
    },
];

// ECOMMERCE
// ----------------------------------------------------------------------

export const ecommerceSalesOverview = ["Total Profit", "Total Income", "Total Expenses"].map(
    (label, index) => ({
        label,
        totalAmount: mock.number.price(index) * 100,
        value: mock.number.percent(index),
    })
);

export const ecommerceBestSalesman = [...Array(5)].map((_, index) => {
    const category = ["CAP", "Branded Shoes", "Headphone", "Cell Phone", "Earings"][index];

    const flag = ["flagpack:de", "flagpack:gb-nir", "flagpack:fr", "flagpack:kr", "flagpack:us"][
        index
    ];

    return {
        id: mock.id(index),
        flag,
        category,
        rank: `Top ${index + 1}`,
        email: mock.email(index),
        name: mock.fullName(index),
        totalAmount: mock.number.price(index),
        avatarUrl: mock.image.avatar(index + 8),
    };
});

export const ecommerceLatestProducts = [...Array(5)].map((_, index) => {
    const colors = (index === 0 && ["#2EC4B6", "#E71D36", "#FF9F1C", "#011627"]) ||
        (index === 1 && ["#92140C", "#FFCF99"]) ||
        (index === 2 && ["#0CECDD", "#FFF338", "#FF67E7", "#C400FF", "#52006A", "#046582"]) ||
        (index === 3 && ["#845EC2", "#E4007C", "#2A1A5E"]) || ["#090088"];

    return {
        id: mock.id(index),
        colors,
        name: mock.productName(index),
        price: mock.number.price(index),
        coverUrl: mock.image.product(index),
        priceSale: [1, 3].includes(index) ? mock.number.price(index) : 0,
    };
});

export const ecommerceNewProducts = [...Array(5)].map((_, index) => ({
    id: mock.id(index),
    name: mock.productName(index),
    coverUrl: mock.image.product(index),
}));

// BANKING
// ----------------------------------------------------------------------

export const bankingContacts = [...Array(12)].map((_, index) => ({
    id: mock.id(index),
    name: mock.fullName(index),
    email: mock.email(index),
    avatarUrl: mock.image.avatar(index),
}));

export const bankingCreditCard = [
    {
        id: mock.id(2),
        balance: 23432.03,
        cardType: "mastercard",
        cardHolder: mock.fullName(2),
        cardNumber: "**** **** **** 3640",
        cardValid: "11/22",
    },
    {
        id: mock.id(3),
        balance: 18000.23,
        cardType: "visa",
        cardHolder: mock.fullName(3),
        cardNumber: "**** **** **** 8864",
        cardValid: "11/25",
    },
    {
        id: mock.id(4),
        balance: 2000.89,
        cardType: "mastercard",
        cardHolder: mock.fullName(4),
        cardNumber: "**** **** **** 7755",
        cardValid: "11/22",
    },
];

export const bankingRecentTransitions = [
    {
        id: mock.id(2),
        name: mock.fullName(2),
        avatarUrl: mock.image.avatar(2),
        type: "Income",
        message: "Receive money from",
        category: "Annette Black",
        date: mock.time(2),
        status: "progress",
        amount: mock.number.price(2),
    },
    {
        id: mock.id(3),
        name: mock.fullName(3),
        avatarUrl: mock.image.avatar(3),
        type: "Expenses",
        message: "Payment for",
        category: "Courtney Henry",
        date: mock.time(3),
        status: "completed",
        amount: mock.number.price(3),
    },
    {
        id: mock.id(4),
        name: mock.fullName(4),
        avatarUrl: mock.image.avatar(4),
        type: "Receive",
        message: "Payment for",
        category: "Theresa Webb",
        date: mock.time(4),
        status: "failed",
        amount: mock.number.price(4),
    },
    {
        id: mock.id(5),
        name: null,
        avatarUrl: null,
        type: "Expenses",
        message: "Payment for",
        category: "Beauty & Health",
        date: mock.time(5),
        status: "completed",
        amount: mock.number.price(5),
    },
    {
        id: mock.id(6),
        name: null,
        avatarUrl: null,
        type: "Expenses",
        message: "Payment for",
        category: "Books",
        date: mock.time(6),
        status: "progress",
        amount: mock.number.price(6),
    },
];

// BOOKING
// ----------------------------------------------------------------------

export const bookings = [...Array(5)].map((_, index) => {
    const status = ["Paid", "Paid", "Pending", "Cancelled", "Paid"][index];

    const customer = {
        avatarUrl: mock.image.avatar(index),
        name: mock.fullName(index),
        phoneNumber: mock.phoneNumber(index),
    };

    const destination = [...Array(5)].map((__, _index) => ({
        name: mock.tourName(_index + 1),
        coverUrl: mock.image.travel(_index + 1),
    }))[index];

    return {
        id: mock.id(index),
        destination,
        status,
        customer,
        checkIn: mock.time(index),
        checkOut: mock.time(index),
    };
});

export const bookingsOverview = [...Array(3)].map((_, index) => ({
    status: ["Pending", "Canceled", "Sold"][index],
    quantity: mock.number.nativeL(index),
    value: mock.number.percent(index),
}));

export const bookingReview = [...Array(5)].map((_, index) => ({
    id: mock.id(index),
    name: mock.fullName(index),
    postedAt: mock.time(index),
    rating: mock.number.rating(index),
    avatarUrl: mock.image.avatar(index),
    description: mock.description(index),
    tags: ["Great Sevice", "Recommended", "Best Price"],
}));

export const bookingNew = [...Array(5)].map((_, index) => ({
    guests: "3-5",
    id: mock.id(index),
    bookedAt: mock.time(index),
    duration: "3 days 2 nights",
    isHot: mock.boolean(index),
    name: mock.fullName(index),
    price: mock.number.price(index),
    avatarUrl: mock.image.avatar(index),
    coverUrl: mock.image.travel(index),
}));
