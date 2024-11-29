const floor = document.querySelector('.floor');
const nColRow = document.querySelector("#nColRow")
const randomizeLink = document.querySelector('.randomize-link');
const rotateLink = document.querySelector('.rotate-link');
const bookmatchLink = document.querySelector('.bookmatch-link');
const zoomSlider = document.querySelector('#zoom-slider');
const zoomNumber = document.querySelector('#zoom-number');
const fileUpload = document.querySelector("#file-upload");
const tileSetSelector = document.querySelector('#face-selector');
const reloadTileFace = document.querySelector('.reload-face-link');
const imageLabel = document.querySelector('#image-label');
const allTileSet = document.querySelector(".reload-tileset-link")
const facesLabel = document.querySelector("#faces")

const defTileCount = 6*6
let tileCount = defTileCount
let currentTileImage = 'images/tile.jpg'; // Default tile image
let currentZoom = 400; // Default zoom level
let tileSets = {}
let isTileSet = false
let isAllTileSet = false

const backgroundColorPicker = document.querySelector('#background-color-picker');

nColRow.addEventListener('change', (event) => {
    const numColRow = parseInt(event.target.value)
    tileCount = numColRow * numColRow
    floor.style.gridTemplateColumns = "repeat(" + numColRow + ", 100px)"
    floor.style.gridTemplateRows = "repeat(" + numColRow + ", 100px)"
    createTiles()
})


// Apply background color to all tiles
backgroundColorPicker.addEventListener('input', (e) => {
    const color = e.target.value; // Get the selected color
    floor.style.backgroundColor = color;
    //document.querySelectorAll('.tile').forEach(tile => {
    //    tile.style.backgroundColor = color;
    //});
});




// Function to create tiles
function createTiles() {
    //tileCount = defTileCount
    floor.innerHTML = ''; // Clear existing tiles
    for (let i = 0; i < tileCount; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        // 0 1 2 3
        // 4 5 6 7
        // 8 9 10 11
        // 12 13 14 15
        if ([1, 3, 9, 11].includes(i)) tile.classList.add('TR');
        if ([4, 6, 12, 14].includes(i)) tile.classList.add('BL');
        if ([5, 7, 13, 15].includes(i)) tile.classList.add('BR');
        tile.style.backgroundImage = `url('${currentTileImage}')`;
        tile.style.backgroundSize = `${currentZoom}px ${currentZoom}px`;
        randomizeTile(tile);
        floor.appendChild(tile);
    }
    imageLabel.innerHTML = "Tile loaded: " + currentTileImage
    facesLabel.innerHTML = ""
    isTileSet = false
}

function createTileSet(tileSet) {
    //tileCount = defTileCount
    floor.innerHTML = ''; // Clear existing tiles
    //const tiles = tileSets[tileSet];
    const tiles = tileSet;
    console.log("tiles len:", tiles.length);
    temp = ""
    resetZoom()
    for (let i = 0; i < tileCount; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        const randomIdx = Math.floor(Math.random() * tiles.length);
        const randomFace = tiles[randomIdx];
        tile.style.backgroundImage = `url('images/faces/${randomFace}')`;
        tile.style.width = "100px"
        tile.style.height = "100px"
        tile.style.backgroundPosition = `0px 0xp`
        tile.style.backgroundSize = "100px 100px"
        //randomizeTile(tile); // Optionally rotate the tile
        //tile.style.width = `${currentZoom / tileCount}px`;
        //tile.style.height = `${currentZoom / tileCount}px`;
        floor.appendChild(tile);
        temp = temp + String.fromCharCode(randomIdx+65) + ", "
    }
    imageLabel.innerHTML = "Tile set loaded: " + tileSetSelector.options[tileSetSelector.selectedIndex].text
    facesLabel.innerHTML = "faces loaded: " + temp
    isTileSet = true
    isAllTileSet = false
}

function createAllTileSet(tileSet) {
    tileCount = tileSet.length
    floor.innerHTML = ''; // Clear existing tiles
    //const tiles = tileSets[tileSet];
    const tiles = tileSet;
    resetZoom();
    for (let i = 0; i < tileCount; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        //const randomFace = tiles[Math.floor(Math.random() * tiles.length)];
        tileFace = tiles[i]
        tile.style.backgroundImage = `url('images/faces/${tileFace}')`;
        tile.style.width = "100px"
        tile.style.height = "100px"
        tile.style.backgroundPosition = `0px 0xp`
        tile.style.backgroundSize = "100px 100px"

        //randomizeTile(tile); // Optionally rotate the tile
        //tile.style.width = `${currentZoom / tileCount}px`;
        //tile.style.height = `${currentZoom / tileCount}px`;
        floor.appendChild(tile);
    }
    imageLabel.innerHTML = "Original tile set loaded: " + tileSetSelector.options[tileSetSelector.selectedIndex].text
    facesLabel.innerHTML = ""
    isTileSet = true
    isAllTileSet = true
}

// Function to get image dimensions
function getImageDimensions(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = src; // Set the image source to load
    });
}

// Function to randomize tile positions
function randomizeTile(tile) {
    const x = Math.floor(Math.random() * (currentZoom - 100)); // Random X position
    const y = Math.floor(Math.random() * (currentZoom - 100)); // Random Y position
    tile.style.backgroundPosition = `-${x}px -${y}px`;
}

// Function to randomize rotation (rotate by 90 degrees)
function randomizeRotation() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        const rotation = Math.floor(Math.random() * 4) * 90; // Random rotation 0, 90, 180, 270
        tile.style.transform = `rotate(${rotation}deg)`; // Apply random rotation
    });
}

function bookmatchRotation(){
    const TRtiles = document.querySelectorAll('.TR');
    TRtiles.forEach(tile => {
        tile.style.transform = `rotate(90deg)`
    });
    const BLtiles = document.querySelectorAll('.BL');
    BLtiles.forEach(tile => {
        tile.style.transform = `rotate(-90deg)`
    });
    const BRtiles = document.querySelectorAll('.BR');
    BRtiles.forEach(tile => {
        tile.style.transform = `rotate(180deg)`
    });
}

// Event listener for randomize button
randomizeLink.addEventListener('click', (event) => {
    event.preventDefault();
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => randomizeTile(tile)); // Randomize each existing tile
});

reloadTileFace.addEventListener("click", (event) => {
    event.preventDefault();
    const idx = tileSetSelector.value
    createTileSet(tileSets[idx]);
})

allTileSet.addEventListener("click", (event) => {
    event.preventDefault();
    createAllTileSet(tileSets[tileSetSelector.value]);
})


// Event listener for rotation button
rotateLink.addEventListener('click', (event) => {
    event.preventDefault();
    randomizeRotation(); // Randomly rotate tiles
});

bookmatchLink.addEventListener('click', (event) => {
    event.preventDefault();
    bookmatchRotation(); // Randomly rotate tiles
});

// Event listener for zoom slider
zoomSlider.addEventListener('input', (event) => {
    currentZoom = event.target.value; // Update zoom level
    const tiles = document.querySelectorAll('.tile');
    zoomNumber.value = currentZoom
    tiles.forEach(tile => {
        tile.style.backgroundSize = `${currentZoom}px ${currentZoom}px`; // Update tile zoom
    });
});

function  resetZoom() {
    zoomSlider.value = 100
    currentZoom = 100 
    const tiles = document.querySelectorAll('.tile');
    zoomNumber.value = currentZoom
    tiles.forEach(tile => {
        tile.style.backgroundSize = `${currentZoom}px ${currentZoom}px`; // Update tile zoom
    });
}


// Event listener for file upload
fileUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/jpeg') {
        const fileURL = URL.createObjectURL(file);
        currentTileImage = fileURL;
        createTiles();

        // Add the uploaded file to the dropdown
        const option = document.createElement('option');
        //const dimensions = await getImageDimensions(fileURL)
        option.value = fileURL;
        //option.textContent = file.name + ' ' + dimensions.width + 'x' + dimensions.height + 'px'
        option.textContent = file.name 
    }
});

// Initialize the floor with default tiles
//loadImageList();
//loadTileSets();

createTiles();
