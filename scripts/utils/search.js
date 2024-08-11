export function handleSearch() {
    // Listener for the button
    document.querySelector(".js-search-button").addEventListener("click", () => {
        const search = document.querySelector(".js-search-bar").value;
        window.location.href = `/amazone?search=${search}`;
    });

    // And listener for the Enter keydown
    document.querySelector(".js-search-bar").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const search = document.querySelector(".js-search-bar").value;
            window.location.href = `/amazone?search=${search}`;
        }
    });

    const url = new URL(window.location.href);
    const search = url.searchParams.get("search");

    if (search) {
        document.querySelector(".js-search-bar").value = search;
    }
}