import { initAuthtorization } from "./authorization.js";

function main() : void {
    initAuthtorization();
    (document.querySelector('.accept-btn') as HTMLElement).focus();
}

document.addEventListener("DOMContentLoaded", main);