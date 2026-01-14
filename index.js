const form = document.getElementById('color-form');

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

async function getColor(colorHex) {
  const response = await fetch(`https://www.thecolorapi.com/id?format=json&hex=${colorHex}`);
  const data = await response.json();
}

async function getColorScheme(colorHex, schemeMode) {
  const response = await fetch(`https://www.thecolorapi.com/scheme?hex=${colorHex}&mode=${schemeMode}&format=json`);
  const data = await response.json();
  const colors = data.colors;
  console.log(colors);
  for (const color of colors) {
    document.getElementById('colors').innerHTML += `
        <div class="color-container">
            <img src="${color.image.bare}" alt="${color.name.value}" class="color-img" />
            <div class="color-text-container">
                <div class="color-copy-container">
                  <i class="fa-solid fa-copy"></i>
                  <p class="color-text">${color.hex.value}</p>
                </div>
                <p class="color-name-text">${color.name.value}</p>
            </div>
        </div>
        
    `;
  }
}
