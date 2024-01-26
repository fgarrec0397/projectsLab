import { mock } from "./mock";

// ----------------------------------------------------------------------

export const carouselsMembers = [...Array(6)].map((_, index) => ({
    id: mock.id(index),
    name: mock.fullName(index),
    role: mock.role(index),
    avatarUrl: mock.image.portrait(index),
}));

// ----------------------------------------------------------------------

export const faqs = [...Array(8)].map((_, index) => ({
    id: mock.id(index),
    value: `panel${index + 1}`,
    heading: `Questions ${index + 1}`,
    detail: mock.description(index),
}));

// ----------------------------------------------------------------------

export const addressBooks = [...Array(24)].map((_, index) => ({
    id: mock.id(index),
    primary: index === 0,
    name: mock.fullName(index),
    email: mock.email(index + 1),
    fullAddress: mock.fullAddress(index),
    phoneNumber: mock.phoneNumber(index),
    company: mock.companyName(index + 1),
    addressType: index === 0 ? "Home" : "Office",
}));

// ----------------------------------------------------------------------

export const contacts = [...Array(20)].map((_, index) => {
    const status =
        (index % 2 && "online") || (index % 3 && "offline") || (index % 4 && "alway") || "busy";

    return {
        id: mock.id(index),
        status,
        role: mock.role(index),
        email: mock.email(index),
        name: mock.fullName(index),
        phoneNumber: mock.phoneNumber(index),
        lastActivity: mock.time(index),
        avatarUrl: mock.image.avatar(index),
        address: mock.fullAddress(index),
    };
});

// ----------------------------------------------------------------------

export const notifications = [...Array(9)].map((_, index) => ({
    id: mock.id(index),
    avatarUrl: [
        mock.image.avatar(1),
        mock.image.avatar(2),
        mock.image.avatar(3),
        mock.image.avatar(4),
        mock.image.avatar(5),
        null,
        null,
        null,
        null,
        null,
    ][index],
    type: ["friend", "project", "file", "tags", "payment", "order", "chat", "mail", "delivery"][
        index
    ],
    category: [
        "Communication",
        "Project UI",
        "File Manager",
        "File Manager",
        "File Manager",
        "Order",
        "Order",
        "Communication",
        "Communication",
    ][index],
    isUnRead: mock.boolean(index),
    createdAt: mock.time(index),
    title:
        (index === 0 && `<p><strong>Deja Brady</strong> sent you a friend request</p>`) ||
        (index === 1 &&
            `<p><strong>Jayvon Hull</strong> mentioned you in <strong><a href='#'>Minimal UI</a></strong></p>`) ||
        (index === 2 &&
            `<p><strong>Lainey Davidson</strong> added file to <strong><a href='#'>File Manager</a></strong></p>`) ||
        (index === 3 &&
            `<p><strong>Angelique Morse</strong> added new tags to <strong><a href='#'>File Manager<a/></strong></p>`) ||
        (index === 4 &&
            `<p><strong>Giana Brandt</strong> request a payment of <strong>$200</strong></p>`) ||
        (index === 5 && `<p>Your order is placed waiting for shipping</p>`) ||
        (index === 6 && `<p>Delivery processing your order is being shipped</p>`) ||
        (index === 7 && `<p>You have new message 5 unread messages</p>`) ||
        (index === 8 && `<p>You have new mail`) ||
        "",
}));

// ----------------------------------------------------------------------

export const mapContact = [
    {
        latlng: [33, 65],
        address: mock.fullAddress(1),
        phoneNumber: mock.phoneNumber(1),
    },
    {
        latlng: [-12.5, 18.5],
        address: mock.fullAddress(2),
        phoneNumber: mock.phoneNumber(2),
    },
];

// ----------------------------------------------------------------------

export const socials = [
    {
        value: "facebook",
        name: "FaceBook",
        icon: "eva:facebook-fill",
        color: "#1877F2",
        path: "https://www.facebook.com/caitlyn.kerluke",
    },
    {
        value: "instagram",
        name: "Instagram",
        icon: "ant-design:instagram-filled",
        color: "#E02D69",
        path: "https://www.instagram.com/caitlyn.kerluke",
    },
    {
        value: "linkedin",
        name: "Linkedin",
        icon: "eva:linkedin-fill",
        color: "#007EBB",
        path: "https://www.linkedin.com/caitlyn.kerluke",
    },
    {
        value: "twitter",
        name: "Twitter",
        icon: "eva:twitter-fill",
        color: "#00AAEC",
        path: "https://www.twitter.com/caitlyn.kerluke",
    },
];

// ----------------------------------------------------------------------

export const homePlans = [...Array(3)].map((_, index) => ({
    license: ["Standard", "Standard Plus", "Extended"][index],
    commons: ["One end products", "12 months updates", "6 months of support"],
    options: [
        "JavaScript version",
        "TypeScript version",
        "Design Resources",
        "Commercial applications",
    ],
    icons: [
        "/assets/icons/platforms/ic_js.svg",
        "/assets/icons/platforms/ic_ts.svg",
        "/assets/icons/platforms/ic_figma.svg",
    ],
}));

// ----------------------------------------------------------------------

export const pricingPlans = [
    {
        subscription: "basic",
        price: 0,
        caption: "Forever",
        lists: ["3 Prototypes", "3 Boards", "Up To 5 Team Members"],
        labelAction: "Current Plan",
    },
    {
        subscription: "starter",
        price: 4.99,
        caption: "Saving $24 a year",
        lists: [
            "3 Prototypes",
            "3 Boards",
            "Up To 5 Team Members",
            "Advanced Security",
            "Issue Escalation",
        ],
        labelAction: "Choose Starter",
    },
    {
        subscription: "premium",
        price: 9.99,
        caption: "Saving $124 a year",
        lists: [
            "3 Prototypes",
            "3 Boards",
            "Up To 5 Team Members",
            "Advanced Security",
            "Issue Escalation",
            "Issue Development license",
            "Permissions & workflows",
        ],
        labelAction: "Choose Premium",
    },
];

// ----------------------------------------------------------------------

export const testimonials = [
    {
        name: mock.fullName(1),
        postedDate: mock.time(1),
        ratingNumber: mock.number.rating(1),
        avatarUrl: mock.image.avatar(1),
        content: `Excellent Work! Thanks a lot!`,
    },
    {
        name: mock.fullName(2),
        postedDate: mock.time(2),
        ratingNumber: mock.number.rating(2),
        avatarUrl: mock.image.avatar(2),
        content: `It's a very good dashboard and we are really liking the product . We've done some things, like migrate to TS and implementing a react useContext api, to fit our job methodology but the product is one of the best in terms of design and application architecture. The team did a really good job.`,
    },
    {
        name: mock.fullName(3),
        postedDate: mock.time(3),
        ratingNumber: mock.number.rating(3),
        avatarUrl: mock.image.avatar(3),
        content: `Customer support is realy fast and helpful the desgin of this theme is looks amazing also the code is very clean and readble realy good job !`,
    },
    {
        name: mock.fullName(4),
        postedDate: mock.time(4),
        ratingNumber: mock.number.rating(4),
        avatarUrl: mock.image.avatar(4),
        content: `Amazing, really good code quality and gives you a lot of examples for implementations.`,
    },
    {
        name: mock.fullName(5),
        postedDate: mock.time(5),
        ratingNumber: mock.number.rating(5),
        avatarUrl: mock.image.avatar(5),
        content: `Got a few questions after purchasing the product. The owner responded very fast and very helpfull. Overall the code is excellent and works very good. 5/5 stars!`,
    },
    {
        name: mock.fullName(6),
        postedDate: mock.time(6),
        ratingNumber: mock.number.rating(6),
        avatarUrl: mock.image.avatar(6),
        content: `CEO of Codealy.io here. We’ve built a developer assessment platform that makes sense - tasks are based on git repositories and run in virtual machines. We automate the pain points - storing candidates code, running it and sharing test results with the whole team, remotely. Bought this template as we need to provide an awesome dashboard for our early customers. I am super happy with purchase. The code is just as good as the design. Thanks!`,
    },
];
