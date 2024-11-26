import axios from "axios";

const API = axios.create();

const csrfToken = document.querySelector(
  '[name="csrf-token"]'
) as HTMLElement | null;

if (csrfToken instanceof HTMLMetaElement) {
  API.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken.content;
}

export default API;
