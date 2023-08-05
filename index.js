const API_URL = "https://geocode.maps.co";
const inputAddress = document.getElementById("latLonSearch");
const btnSearch = document.getElementById("btnSearch");
const displayName = document.getElementById("display-name");
const displayAlert = document.getElementById("alert-placeholder");
const lat = document.getElementById("lat");
const lon = document.getElementById("lon");
const displaySpinner = document.getElementById("display-spinner");

const spinner = document.createElement("div");
spinner.innerHTML = `<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;

const showSpinner = () => {
  displaySpinner.innerHTML = ""; // Clear any existing content
  displaySpinner.appendChild(spinner);
};

const hideSpinner = () => {
  displaySpinner.innerHTML = ""; // Remove the spinner
};

const isEmpty = (str) => {
  return str === null || str.match(/^ *$/) !== null;
};

const validation = () => {
  if (isEmpty(inputAddress.value)) {
    myAlert("Input postal address", "warning");
    return false;
  }
  return true;
};

const fetchResults = async (query, callback) => {
  try {
    const response = await fetch(`${API_URL}/search?q={${query}}`);
    const data = await response.json();
    callback(data[0] || []);
  } catch (error) {
    throw new Error(error);
  }
};

const handleSearch = () => {
  if (!validation()) {
    btnSearch.setAttribute("disabled", "");
    return;
  }

  //clear existing values
  displayName.innerText = "";
  lat.value = "";
  lon.value = "";

  // Show the spinner before fetching results
  showSpinner();

  fetchResults(inputAddress.value, (result) => {
    displayName.innerText = result.display_name;
    lat.value = Number(result.lat).toFixed(6);
    lon.value = Number(result.lon).toFixed(6);

    // Hide the spinner once the results are fetched
    hideSpinner();
  });
};

const myAlert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} d-flex align-items-center justify-content-center gap-2 alert-dismissible fade show" role="alert">`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>`,
    `<div>${message}</div>`,
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");
  displayAlert.append(wrapper);

  /**alert close button will triggered, the button will enable */
  document.querySelector(".alert").addEventListener("closed.bs.alert", () => {
    btnSearch.removeAttribute("disabled");
  });
};

btnSearch.addEventListener("click", handleSearch);
