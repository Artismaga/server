const totalBackgroundImages = 3;

export function getBackgroundImage() {
    return `/backgrounds/${Math.floor(Math.random() * totalBackgroundImages) + 1}.jpg`;
}