import { initAuthtorization } from "./authorization.js";
function main() {
    initAuthtorization();
    document.querySelector('.accept-btn').focus();
}
document.addEventListener("DOMContentLoaded", main);
