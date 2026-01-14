const form = document.getElementById('color-form');
const inputColor = document.getElementById('input-color');
const selectScheme = document.getElementById('select-scheme');
const darkmodeValue = document.getElementById('darkmode').checked;

initHTML();

// ------ EVENT LISTENERS -------
document.getElementById('submit-btn').addEventListener('click', (e) => {
  e.preventDefault();

  // get the data from the form
  const formData = new FormData(form);
  const colorHex = formData.get('color').indexOf('#') != -1 ? formData.get('color').slice(1) : formData.get('color');
  const schemeMode = formData.get('scheme');

  // save to localStorage
  saveToLocalstorage(colorHex, schemeMode);

  // get the colors from the api and render
  getColorScheme(colorHex, schemeMode).then((colorsArray) => renderColors(colorsArray));
});

document.getElementById('darkmode').addEventListener('click', () => {
  setDarkmode();
});

function setDarkmode() {
  const darkmodeStatus = document.getElementById('darkmode').checked;

  if (darkmodeStatus) {
    document.body.classList.add('darkmode');
  } else {
    document.body.classList.remove('darkmode');
  }
}

// ------ FUNCTIONS -------
function initHTML() {
  let hex = getColorLocalStorage();
  let scheme = getSchemeLocalStorage();

  if (hex && scheme) {
    inputColor.value = '#' + hex;
    selectScheme.value = scheme;
  } else {
    const formData = new FormData(form);
    hex = formData.get('color').indexOf('#') != -1 ? formData.get('color').slice(1) : formData.get('color');
    scheme = formData.get('scheme');
  }

  getColorScheme(hex, scheme).then((colorsArray) => renderColors(colorsArray));
}

function saveToLocalstorage(hex, scheme) {
  localStorage.setItem('hex', hex);
  localStorage.setItem('scheme', scheme);
}

function getColorLocalStorage() {
  return localStorage.getItem('hex');
}

function getSchemeLocalStorage() {
  return localStorage.getItem('scheme');
}

async function getColor(colorHex) {
  const response = await fetch(`https://www.thecolorapi.com/id?format=json&hex=${colorHex}`);
  const data = await response.json();
}

async function getColorScheme(colorHex, schemeMode) {
  const response = await fetch(`https://www.thecolorapi.com/scheme?hex=${colorHex}&mode=${schemeMode}&format=json`);
  const data = await response.json();
  const colorsArray = data.colors;

  return colorsArray;
}

function renderColors(colorsArr) {
  let html = '';

  for (const color of colorsArr) {
    html += `
        <div class="color-container">
            <img src="${color.image.bare}" alt="${color.name.value}" class="color-img" />
            <div class="color-text-container">
                <div class="color-copy-container">
                  <button class="copy-btn" onClick="copyToClipboard(event)" data-hex="${color.hex.value}">
                    <i class="fa-solid fa-copy" data-hex="${color.hex.value}"></i>
                  </button>
                  <p class="color-text">${color.hex.value}</p>
                </div>
                <p class="color-name-text">${color.name.value}</p>
            </div>
        </div>  
    `;
  }

  document.getElementById('colors').innerHTML = html;
}

function copyToClipboard(e) {
  if (e.target.dataset) {
    const hexValue = e.target.dataset.hex;
    navigator.clipboard.writeText(hexValue);
  }
}
