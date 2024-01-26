import { countries } from "@/assets/data";

import { tags } from "./assets";
import { mock } from "./mock";

// ----------------------------------------------------------------------

export const TOUR_DETAILS_TABS = [
    { value: "content", label: "Tour Content" },
    { value: "bookers", label: "Booker" },
];

export const TOUR_SORT_OPTIONS = [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Popular" },
    { value: "oldest", label: "Oldest" },
];

export const TOUR_PUBLISH_OPTIONS = [
    {
        value: "published",
        label: "Published",
    },
    {
        value: "draft",
        label: "Draft",
    },
];

export const TOUR_SERVICE_OPTIONS = [
    { value: "Audio guide", label: "Audio guide" },
    { value: "Food and drinks", label: "Food and drinks" },
    { value: "Lunch", label: "Lunch" },
    { value: "Private tour", label: "Private tour" },
    { value: "Special activities", label: "Special activities" },
    { value: "Entrance fees", label: "Entrance fees" },
    { value: "Gratuities", label: "Gratuities" },
    { value: "Pick-up and drop off", label: "Pick-up and drop off" },
    { value: "Professional guide", label: "Professional guide" },
    {
        value: "Transport by air-conditioned",
        label: "Transport by air-conditioned",
    },
];

const CONTENT = `
<h6>Description</h6>
<br/>
<p>Occaecati est et illo quibusdam accusamus qui. Incidunt aut et molestiae ut facere aut. Est quidem iusto praesentium excepturi harum nihil tenetur facilis. Ut omnis voluptates nihil accusantium doloribus eaque debitis.</p>

<br/>
<br/>
<br/>

<h6>Highlights</h6>
<br/>
<ul>
    <li>A fermentum in morbi pretium aliquam adipiscing donec tempus.</li>
    <li>Vulputate placerat amet pulvinar lorem nisl.</li>
    <li>Consequat feugiat habitant gravida quisque elit bibendum id adipiscing sed.</li>
    <li>Etiam duis lobortis in fames ultrices commodo nibh.</li>
</ul>

<br/>
<br/>
<br/>

<h6>Program</h6>
<br/>
<p><strong>Day 1</strong></p>
<br/>
<p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
<br/>
<p><strong>Day 2</strong></p>
<br/>
<p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
<br/>
<p><strong>Day 3</strong></p>
<br/>
<p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>

<br/>
<br/>
<br/>
`;

const BOOKER = [...Array(12)].map((_, index) => ({
    id: mock.id(index),
    guests: index + 10,
    name: mock.fullName(index),
    avatarUrl: mock.image.avatar(index),
}));

export const tourGuides = [...Array(12)].map((_, index) => ({
    id: mock.id(index),
    name: mock.fullName(index),
    avatarUrl: mock.image.avatar(index),
    phoneNumber: mock.phoneNumber(index),
}));

export const TRAVEL_IMAGES = [...Array(16)].map((_, index) => mock.image.travel(index));

export const tours = [...Array(12)].map((_, index) => {
    const available = {
        startDate: mock.time(index + 1),
        endDate: mock.time(index),
    };

    const publish = index % 3 ? "published" : "draft";

    const destination = countries.map((option) => option.label)[index];

    const services = (index % 2 && ["Audio guide", "Food and drinks"]) ||
        (index % 3 && ["Lunch", "Private tour"]) ||
        (index % 4 && ["Special activities", "Entrance fees"]) || [
            "Gratuities",
            "Pick-up and drop off",
            "Professional guide",
            "Transport by air-conditioned",
        ];

    const tourGuide =
        (index === 0 && tourGuides.slice(0, 1)) ||
        (index === 1 && tourGuides.slice(1, 3)) ||
        (index === 2 && tourGuides.slice(2, 5)) ||
        (index === 3 && tourGuides.slice(4, 6)) ||
        tourGuides.slice(6, 9);

    const images = TRAVEL_IMAGES.slice(index, index + 5);

    return {
        id: mock.id(index),
        images,
        publish,
        services,
        available,
        tourGuide,
        destination,
        bookers: BOOKER,
        content: CONTENT,
        tags: tags.slice(0, 5),
        name: mock.tourName(index),
        createdAt: mock.time(index),
        durations: "4 days 3 nights",
        price: mock.number.price(index),
        priceSale: mock.number.price(index),
        totalViews: mock.number.nativeL(index),
        ratingNumber: mock.number.rating(index),
    };
});
