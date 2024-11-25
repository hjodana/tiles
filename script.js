const floor = document.querySelector('.floor');
const tileSelector = document.querySelector('#tile-selector');
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
const nCol = document.querySelector("#nCol")
const nRow = document.querySelector("#nRow")

const defTileCount = 6*6
let tileCount = defTileCount
let currentTileImage = ''; // Default tile image
let currentZoom = 400; // Default zoom level
let tileSets = {}
let isTileSet = false
let isAllTileSet = false

const backgroundColorPicker = document.querySelector('#background-color-picker');

nCol.addEventListener('change', (event) => {
    const numCol = parseInt(event.target.value)
    tileCount = numCol * parseInt(nRow.value)
    console.log("nCol: ", numCol, " tileCount: ", tileCount)
    floor.style.gridTemplateColumns = "repeat(" + numCol + ", 100px)"
    if (isTileSet) {
        if (isAllTileSet) {
            createAllTileSet(tileSets[tileSetSelector.value]);
        } else {
            createTileSet(tileSets[tileSetSelector.value]);
        }
    } else {
        createTiles()
    }
})

nRow.addEventListener('change', (event) => {
    const numRow = parseInt(event.target.value)
    tileCount = numRow * parseInt(nCol.value)
    floor.style.gridTemplateRows = "repeat(" + numRow + ", 100px)"
    if (isTileSet) {
        if (isAllTileSet) {
            createAllTileSet(tileSets[tileSetSelector.value]);
        } else {
            createTileSet(tileSets[tileSetSelector.value]);
        }
    } else {
        createTiles()
    }
})

// Apply background color to all tiles
backgroundColorPicker.addEventListener('input', (e) => {
    const color = e.target.value; // Get the selected color
    floor.style.backgroundColor = color;
    //document.querySelectorAll('.tile').forEach(tile => {
    //    tile.style.backgroundColor = color;
    //});
});

// Populate dropdown with .jpg files from the images folder
async function loadImageList() {
    try {
        const response = await fetch('images/'); // Assuming the `images` folder is publicly accessible
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .map(link => link.getAttribute('href'))
            .filter(file => file.endsWith('.jpg'));

        // Populate the dropdown menu
        tileSelector.innerHTML = '';
        links.forEach( file => {
            const fileName = file.split('/').pop(); // Extract only the filename
            const fullPath = `images/${fileName}`;
            //const dimensions = await getImageDimensions(fullPath); // Retrieve image dimensions
            const option = document.createElement('option');
            option.value = 'images/' + fileName; // Full path for the tile image
            //option.textContent = fileName + " " + dimensions.width + "x" + dimensions.height + "px"; // Only the filename for the dropdown
            option.textContent = fileName 
            tileSelector.appendChild(option);
        });

        // Set the first tile as the default
        if (links.length > 0) {
            console.log("links[0] = " + links[0])
            const fileName = links[0].split('/').pop(); 
            currentTileImage = 'images/' + fileName;
            createTiles();
        }
    } catch (error) {
        console.error('Error loading images:', error);
    }
}


// Populate the tile set selector dropdown
async function loadTileSets() {
    try {
        const response = await fetch('images/faces/');
        if (!response.ok) throw new Error('Failed to fetch file list');

        const textResult = await response.text();
        const parser = new DOMParser()
        const doc = parser.parseFromString(textResult, "text/html")
        const files = Array.from(doc.querySelectorAll("a"))
            .map(link => link.getAttribute('href'))
            .filter(file => file.endsWith("jpg"))
        //const files = textResult.split('\n').filter(file => file.trim() !== ''); // Split by newline and remove empty lines

        // Group files by their base name
        tileSets = files.reduce((groups, file) => {
            const fileName = file.split('/').pop(); // Extract only the filename
            const baseName = fileName.split('-')[0];
            if (!groups[baseName]) groups[baseName] = [];
            //groups[baseName].push(`/uploads/${file}`);
            groups[baseName].push(fileName);
            return groups;
        }, {})

        // Populate the dropdown menu
        Object.keys(tileSets).forEach(tileSet => {
            const option = document.createElement('option');
            console.log("tileset:", tileSet, tileSets[tileSet].length);
            option.value = tileSet
            option.textContent = tileSet + " (" + tileSets[tileSet].length + " faces)"  
            tileSetSelector.appendChild(option);
        });

        // Load the first tile set by default
        if (tileSetSelector.options.length > 0) {
            //by default no loaded, because the normal tile is loaded
            //createTileSet(tileSets[tileSetSelector.options[0].value]);
        }
    } catch (err) {
        console.error('Error loading tile sets:', err);
    }
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
        if ([1, 3, 9, 11].includes(i)) tile.classList.add('TR');
        if ([4, 6, 12, 14].includes(i)) tile.classList.add('BL');
        if ([5, 7, 13, 15].includes(i)) tile.classList.add('BR');
        tile.style.backgroundImage = `url('${currentTileImage}')`;
        tile.style.backgroundSize = `${currentZoom}px ${currentZoom}px`;
        randomizeTile(tile);
        floor.appendChild(tile);
    }
    imageLabel.innerHTML = "Tile loaded: " + tileSelector.options[tileSelector.selectedIndex].text
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

// Event listener for tile selection
tileSelector.addEventListener('change', (event) => {
    currentTileImage = event.target.value;
    createTiles(); // Recreate tiles with the new image
});

tileSetSelector.addEventListener('change', (event) => {
    const idx = event.target.value;
    createTileSet(tileSets[idx]); // Recreate tiles with the new image
});
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
        tileSelector.appendChild(option);
        tileSelector.value = fileURL;
    }
});

// Initialize the floor with default tiles
loadImageList();
//loadTileSets();
