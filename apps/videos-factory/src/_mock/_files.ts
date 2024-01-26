import { tags } from "./assets";
import { mock } from "./mock";

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

const FOLDERS = ["Docs", "Projects", "Work", "Training", "Sport", "Foods"];

const FILES = [
    "cover-2.jpg",
    "design-suriname-2015.mp3",
    "expertise-2015-conakry-sao-tome-and-principe-gender.mp4",
    "money-popup-crack.pdf",
    "cover-4.jpg",
    "cover-6.jpg",
    "large-news.txt",
    "nauru-6015-small-fighter-left-gender.psd",
    "tv-xs.doc",
    "gustavia-entertainment-productivity.docx",
    "vintage-bahrain-saipan.xls",
    "indonesia-quito-nancy-grace-left-glad.xlsx",
    "legislation-grain.zip",
    "large-energy-dry-philippines.rar",
    "footer-243-ecuador.iso",
    "kyrgyzstan-04795009-picabo-street-guide-style.ai",
    "india-data-large-gk-chesterton-mother.esp",
    "footer-barbados-celine-dion.ppt",
    "socio-respectively-366996.pptx",
    "socio-ahead-531437-sweden-popup.wav",
    "trinidad-samuel-morse-bring.m4v",
    "cover-12.jpg",
    "cover-18.jpg",
    "xl-david-blaine-component-tanzania-books.pdf",
];

const URLS = [
    mock.image.cover(1),
    "https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3",
    "https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4",
    "https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf",
    mock.image.cover(3),
    mock.image.cover(5),
    "https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt",
    "https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd",
    "https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc",
    "https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx",
    "https://www.cloud.com/s/c218bo6kjuqyv66/vintage_bahrain_saipan.xls",
    "https://www.cloud.com/s/c218bo6kjuqyv66/indonesia-quito-nancy-grace-left-glad.xlsx",
    "https://www.cloud.com/s/c218bo6kjuqyv66/legislation-grain.zip",
    "https://www.cloud.com/s/c218bo6kjuqyv66/large_energy_dry_philippines.rar",
    "https://www.cloud.com/s/c218bo6kjuqyv66/footer-243-ecuador.iso",
    "https://www.cloud.com/s/c218bo6kjuqyv66/kyrgyzstan-04795009-picabo-street-guide-style.ai",
    "https://www.cloud.com/s/c218bo6kjuqyv66/india-data-large-gk-chesterton-mother.esp",
    "https://www.cloud.com/s/c218bo6kjuqyv66/footer-barbados-celine-dion.ppt",
    "https://www.cloud.com/s/c218bo6kjuqyv66/socio_respectively_366996.pptx",
    "https://www.cloud.com/s/c218bo6kjuqyv66/socio_ahead_531437_sweden_popup.wav",
    "https://www.cloud.com/s/c218bo6kjuqyv66/trinidad_samuel-morse_bring.m4v",
    mock.image.cover(11),
    mock.image.cover(17),
    "https://www.cloud.com/s/c218bo6kjuqyv66/xl_david-blaine_component_tanzania_books.pdf",
];

const SHARED_PERSONS = [...Array(20)].map((_, index) => ({
    id: mock.id(index),
    name: mock.fullName(index),
    email: mock.email(index),
    avatarUrl: mock.image.avatar(index),
    permission: index % 2 ? "view" : "edit",
}));

export const FILE_TYPE_OPTIONS = [
    "folder",
    "txt",
    "zip",
    "audio",
    "image",
    "video",
    "word",
    "excel",
    "powerpoint",
    "pdf",
    "photoshop",
    "illustrator",
];

// ----------------------------------------------------------------------

const shared = (index: number) =>
    (index === 0 && SHARED_PERSONS.slice(0, 5)) ||
    (index === 1 && SHARED_PERSONS.slice(5, 9)) ||
    (index === 2 && SHARED_PERSONS.slice(9, 11)) ||
    (index === 3 && SHARED_PERSONS.slice(11, 12)) ||
    [];

export const folders = FOLDERS.map((name, index) => ({
    id: `${mock.id(index)}_folder`,
    name,
    type: "folder",
    url: URLS[index],
    shared: shared(index),
    tags: tags.slice(0, 5),
    size: GB / ((index + 1) * 10),
    totalFiles: (index + 1) * 100,
    createdAt: mock.time(index),
    modifiedAt: mock.time(index),
    isFavorited: mock.boolean(index + 1),
}));

export const files = FILES.map((name, index) => ({
    id: `${mock.id(index)}_file`,
    name,
    url: URLS[index],
    shared: shared(index),
    tags: tags.slice(0, 5),
    size: GB / ((index + 1) * 500),
    createdAt: mock.time(index),
    modifiedAt: mock.time(index),
    type: `${name.split(".").pop()}`,
    isFavorited: mock.boolean(index + 1),
}));

export const allFiles = [...folders, ...files];
