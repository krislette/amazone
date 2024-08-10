// Creates a new HTTP message to send to the backend
const xhr = new XMLHttpRequest();

// Load - response is loading
xhr.addEventListener("load", () => {
    console.log(xhr.response);
});

xhr.open("GET", "https://supersimplebackend.dev");
xhr.send();