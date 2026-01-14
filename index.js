const form = document.getElementById('color-form');
const darkmodeValue = document.getElementById('darkmode').checked;

initHTML();

// ------ EVENT LISTENERS -------
document.getElementById('submit-btn').addEventListener('click', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  console.log(formData.get('color'));
  console.log(formData.get('scheme'));
  console.log(formData.get('color').indexOf('m'));
  const colorHex = formData.get('color').indexOf('#') != -1 ? formData.get('color').slice(1) : formData.get('color');
  const schemeMode = formData.get('scheme');
  getColor(colorHex);
  getColorScheme(colorHex, schemeMode);
});

document.getElementById('darkmode').addEventListener('click', () => {
  if (document.getElementById('darkmode').checked) {
    document.body.classList.add('darkmode');
  } else {
    document.body.classList.remove('darkmode');
  }
});

// ------ FUNCTIONS -------
function initHTML() {
  const formData = new FormData(form);
  const colorHex = formData.get('color').indexOf('#') != -1 ? formData.get('color').slice(1) : formData.get('color');
  const schemeMode = formData.get('scheme');

  getColorScheme(colorHex, schemeMode);
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

async function getColor(colorHex) {
  const response = await fetch(`https://www.thecolorapi.com/id?format=json&hex=${colorHex}`);
  const data = await response.json();
}

async function getColorScheme(colorHex, schemeMode) {
  const response = await fetch(`https://www.thecolorapi.com/scheme?hex=${colorHex}&mode=${schemeMode}&format=json`);
  const data = await response.json();
  const colorsArray = data.colors;

  renderColors(colorsArray);
}
