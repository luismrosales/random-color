// Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialColors;

// Event listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
colorDivs.forEach((slider, index) => {
  slider.addEventListener("change", () => {
    updateTextUi(index);
  });
});

// Functions

// color generator
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  // initial colors
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    // add initial colors to the array
    initialColors.push(chroma(randomColor).hex());
    //Add color to the background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    // check for contrast
    checkTextContrast(randomColor, hexText);
    // initial colorize sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
  // Reset inputs
  resetInputs();
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  // Scale saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  // Scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBrightness = chroma.scale(["black", midBright, "white"]);

  // Update input colors
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )},${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBrightness(
    0
  )},${scaleBrightness(0.5)},${scaleBrightness(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  const bgColor = initialColors[index];

  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;
}

function updateTextUi(index) {
  const acticeDiv = colorDivs[index];
  const color = chroma(acticeDiv.style.backgroundColor);
  const textHex = acticeDiv.querySelector("h2");
  const icons = acticeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex();
  // Check contrast
  checkTextContrast(color, textHex);
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightnessColor = initialColors[slider.getAttribute("data-bright")];
      const brightnessValue = chroma(brightnessColor).hsl()[2];
      slider.value = Math.floor(brightnessValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

// function calls
randomColors();
