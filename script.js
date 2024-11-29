const floor = document.querySelector('.floor');
const nColRow = document.querySelector("#nColRow")
const randomizeLink = document.querySelector('.randomize-link');
const rotateLink = document.querySelector('.rotate-link');
const bookmatchLink = document.querySelector('.bookmatch-link');
const zoomSlider = document.querySelector('#zoom-slider');
const zoomNumber = document.querySelector('#zoom-number');
const fileUpload = document.querySelector("#file-upload");
const imageLabel = document.querySelector('#image-label');
const backgroundColorPicker = document.querySelector('#background-color-picker');

let nTile = 6
let tileCount = nTile * nTile
let currentTileImage = 'images/tile.jpg'; // Default tile image
let currentZoom = 100; // Default zoom level

function isTL(n, idx){
    blockNum = Math.floor(idx/n);
    posInBlock = idx % n;
    if (blockNum % 2 == 0 && posInBlock % 2 == 0) return true;
    else return false;
}

function isTR(n, idx){
    blockNum = Math.floor(idx/n);
    posInBlock = idx % n;
    console.log(blockNum, posInBlock)
    if (blockNum % 2 == 0 && posInBlock % 2 == 1) return true;
    else return false;
}

function isBL(n, idx){
    blockNum = Math.floor(idx/n);
    posInBlock = idx % n;
    if (blockNum % 2 == 1 && posInBlock % 2 == 0) return true;
    else return false;
}

function isBR(n, idx){
    blockNum = Math.floor(idx/n);
    posInBlock = idx % n;
    if (blockNum % 2 == 1 && posInBlock % 2 == 1) return true;
    else return false;
}

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
        /*
        if ([1, 3, 9, 11].includes(i)) tile.classList.add('TR');
        if ([4, 6, 12, 14].includes(i)) tile.classList.add('BL');
        if ([5, 7, 13, 15].includes(i)) tile.classList.add('BR');
        */
        //if (isTL(nTile, i)) tile.classList.add('TL');
        console.log(isTL(nTile, i))
        if (isTR(nTile, i)) tile.classList.add('TR');
        if (isBL(nTile, i)) tile.classList.add('BL');
        if (isBR(nTile, i)) tile.classList.add('BR');

        tile.style.width = `${currentZoom}px`;
        tile.style.backgroundImage = `url('${currentTileImage}')`;
        tile.style.backgroundSize = `${currentZoom}px ${currentZoom}px`;
        randomizeTile(tile);
        floor.appendChild(tile);
    }
    imageLabel.innerHTML = "Tile loaded: " + currentTileImage
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
    tile.style.transform = "none"
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

nColRow.addEventListener('change', (event) => {
    nTile = parseInt(event.target.value)
    tileCount = nTile * nTile
    floor.style.gridTemplateColumns = "repeat(" + nTile + ", 100px)"
    floor.style.gridTemplateRows = "repeat(" + nTile + ", 100px)"
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


createTiles();
