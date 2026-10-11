export const SFW_TAGS = [
    "waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss",
    "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold",
    "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"
];

export const NSFW_TAGS = ["waifu", "neko", "trap", "blowjob"];
export const UNAVAILABLE_SFW_TAGS = ["bully", "awoo", "glomp", "kill", "cringe"];
export const AVAILABLE_SFW_TAGS = SFW_TAGS.filter(tag => !UNAVAILABLE_SFW_TAGS.includes(tag));

export function isValidCategory(type, category) {
    return (type === "sfw" && SFW_TAGS.includes(category)) ||
        (type === "nsfw" && NSFW_TAGS.includes(category));
}

export function isAvailableCategory(type, category) {
    return type === "sfw" && AVAILABLE_SFW_TAGS.includes(category);
}

export function unavailableMessage(type) {
    return type === "nsfw"
        ? "NSFW images are temporarily unavailable while we find a new provider."
        : "This category is temporarily unavailable. Please select another tag.";
}
