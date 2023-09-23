import naughtyWords from "naughty-words";

const langs = [
    "ar",
    "cs",
    "da",
    "de",
    "en",
    "eo",
    "es",
    "fa",
    "fi",
    "fil",
    "fr",
    "fr-CA-u-sd-caqc",
    "hi",
    "hu",
    "it",
    "ja",
    "kab",
    "ko",
    "nl",
    "no",
    "pl",
    "pt",
    "ru",
    "sv",
    "th",
    "tlh",
    "tr",
    "zh",
];

type Words = keyof typeof naughtyWords

export default function scanProfanity(s: string) {
    s = s.toLowerCase();
    s = s.replace('_', ' ');
    s = s.replace('-', ' ');
    for (let i = 0; i < langs.length; i++) {
        const lang = langs[i] as Words;
        const words = naughtyWords[lang];
        for (let j = 0; j < words.length; j++) {
            let word = words[j];
            if (s.includes(word)) {
                return true;
            }
        }
    }
    return false;
}