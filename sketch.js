let data;
let vectors;
let genButton1, genButton2, genButton3, genButton4;
let titleButton;
let currentIndex1 = 0, currentIndex2 = 0, currentIndex3 = 0, currentIndex4 = 0;
let shuffledVerbs1 = [], shuffledVerbs2 = [], shuffledVerbs3 = [], shuffledVerbs4 = [];
let colorPos, colorPos2, colorPos3, colorPos4; // Color positions for each column
let colorRegions = []; // To store our 4 color region definitions

function preload(){
  data = loadJSON('xkcd.json');
}

function setup() { 
  noCanvas();
  background(255);
  vectors = processData(data);  // Process the color data
  
  // Define possible color regions (we'll randomly assign these)
  defineColorRegions();
  
  // Create title button at the top
  titleButton = createButton("Click for a New Chapter");
  titleButton.position(window.innerWidth/2 - 125, 20); // Adjusted position for longer text
  titleButton.style('font-size', '20px');
  titleButton.style('padding', '10px 20px');
  titleButton.style('background-color', 'rgba(255, 255, 255, 0.8)');
  titleButton.style('border', '2px solid rgba(0, 0, 0, 0.5)');
  titleButton.style('border-radius', '4px');
  titleButton.style('cursor', 'pointer');
  titleButton.mousePressed(() => {
    window.location.reload(); // Refresh the page when clicked
  });
  
  // Create a container div to hold the columns with 10% margin on both sides and 10% on top
  let container = createDiv();
  container.style('display', 'flex');
  container.style('width', '80%'); // Wider than before - 80% width (10% margin on each side)
  container.style('margin-left', '10%'); // 10% left margin
  container.style('margin-right', '10%'); // 10% right margin
  container.style('margin-top', '5%'); // Reduced from 10% to 5% top margin
  container.style('flex-wrap', 'wrap'); // Allow wrapping for responsive layout
  container.style('justify-content', 'space-between'); // Distribute space evenly
  
  // Create columns with smaller minimum width to ensure they fit side by side
  let column1 = createDiv();
  column1.parent(container);
  column1.style('flex', '1');
  column1.style('min-width', '180px'); // Smaller minimum width 
  column1.style('padding', '10px'); // Reduced padding
  column1.style('box-sizing', 'border-box'); // Include padding in width calculation
  column1.style('text-align', 'center'); // Center content in column
  
  let column2 = createDiv();
  column2.parent(container);
  column2.style('flex', '1');
  column2.style('min-width', '180px');
  column2.style('padding', '10px');
  column2.style('box-sizing', 'border-box');
  column2.style('text-align', 'center'); // Center content in column
  
  let column3 = createDiv();
  column3.parent(container);
  column3.style('flex', '1');
  column3.style('min-width', '180px');
  column3.style('padding', '10px');
  column3.style('box-sizing', 'border-box');
  column3.style('text-align', 'center'); // Center content in column
  
  let column4 = createDiv();
  column4.parent(container);
  column4.style('flex', '1');
  column4.style('min-width', '180px');
  column4.style('padding', '10px');
  column4.style('box-sizing', 'border-box');
  column4.style('text-align', 'center'); // Center content in column
  
  // Instead of completely random assignment, we'll pair opposite colors
  // First, shuffle all region indices
  let allRegionIndices = shuffleArray([...Array(colorRegions.length).keys()]);
  
  // Pick two random indices from the first half of the shuffled array
  let index1 = allRegionIndices[0];
  
  // Find an opposite color region for column 2
  let index2 = findOppositeColorRegion(index1);
  
  // Pick a random index for column 3 that's different from 1 and 2
  let remainingIndices = allRegionIndices.filter(i => i !== index1 && i !== index2);
  remainingIndices = shuffleArray(remainingIndices);
  let index3 = remainingIndices[0];
  
  // Find an opposite color region for column 4
  let index4 = findOppositeColorRegion(index3);
  
  // Initialize color positions based on assigned regions
  // Column 1
  let region1 = colorRegions[index1];
  colorPos = createVector(
    random(region1.rMin, region1.rMax),
    random(region1.gMin, region1.gMax),
    random(region1.bMin, region1.bMax)
  );
  
  // Also add direction vectors for continuous color movement
  colorDir1 = p5.Vector.random3D(); // Direction vector for column 1
  colorDir2 = p5.Vector.random3D(); // Direction vector for column 2
  colorDir3 = p5.Vector.random3D(); // Direction vector for column 3  
  colorDir4 = p5.Vector.random3D(); // Direction vector for column 4
  
  // Column 2 (opposite to 1)
  let region2 = colorRegions[index2];
  colorPos2 = createVector(
    random(region2.rMin, region2.rMax),
    random(region2.gMin, region2.gMax),
    random(region2.bMin, region2.bMax)
  );
  
  // Column 3
  let region3 = colorRegions[index3];
  colorPos3 = createVector(
    random(region3.rMin, region3.rMax),
    random(region3.gMin, region3.gMax),
    random(region3.bMin, region3.bMax)
  );
  
  // Column 4 (opposite to 3)
  let region4 = colorRegions[index4];
  colorPos4 = createVector(
    random(region4.rMin, region4.rMax),
    random(region4.gMin, region4.gMax),
    random(region4.bMin, region4.bMax)
  );
  
  // Create buttons with color-coded backgrounds to match their region
  genButton1 = createButton("Generate 1");
  genButton1.parent(column1);
  genButton1.style('background-color', `rgba(${colorPos.x}, ${colorPos.y}, ${colorPos.z}, 0.3)`);
  genButton1.style('border', `1px solid rgba(${colorPos.x}, ${colorPos.y}, ${colorPos.z}, 0.6)`);
  genButton1.style('padding', '8px 12px');
  genButton1.style('width', '100%'); // Make button fill column width
  genButton1.mousePressed(() => generate(column1, "Die", colorPos, 1, grammarSource1, index1));
  
  genButton2 = createButton("Generate 2");
  genButton2.parent(column2);
  genButton2.style('background-color', `rgba(${colorPos2.x}, ${colorPos2.y}, ${colorPos2.z}, 0.3)`);
  genButton2.style('border', `1px solid rgba(${colorPos2.x}, ${colorPos2.y}, ${colorPos2.z}, 0.6)`);
  genButton2.style('padding', '8px 12px');
  genButton2.style('width', '100%'); // Make button fill column width
  genButton2.mousePressed(() => generate(column2, "Live", colorPos2, 2, grammarSource1, index2));
  
  genButton3 = createButton("Generate 3");
  genButton3.parent(column3);
  genButton3.style('background-color', `rgba(${colorPos3.x}, ${colorPos3.y}, ${colorPos3.z}, 0.3)`);
  genButton3.style('border', `1px solid rgba(${colorPos3.x}, ${colorPos3.y}, ${colorPos3.z}, 0.6)`);
  genButton3.style('padding', '8px 12px');
  genButton3.style('width', '100%'); // Make button fill column width
  genButton3.mousePressed(() => generate(column3, "Die", colorPos3, 3, grammarSource2, index3));
  
  genButton4 = createButton("Generate 4");
  genButton4.parent(column4);
  genButton4.style('background-color', `rgba(${colorPos4.x}, ${colorPos4.y}, ${colorPos4.z}, 0.3)`);
  genButton4.style('border', `1px solid rgba(${colorPos4.x}, ${colorPos4.y}, ${colorPos4.z}, 0.6)`);
  genButton4.style('padding', '8px 12px');
  genButton4.style('width', '100%'); // Make button fill column width
  genButton4.mousePressed(() => generate(column4, "Live", colorPos4, 4, grammarSource2, index4));

  // Remove title texts - they are no longer needed

  // Shuffle the verbs initially for the first cycle
  shuffledVerbs1 = shuffleArray([...grammarSource1.verb]);
  shuffledVerbs2 = shuffleArray([...grammarSource1.verb]);
  shuffledVerbs3 = shuffleArray([...grammarSource2.verb]);
  shuffledVerbs4 = shuffleArray([...grammarSource2.verb]);
} 

function defineColorRegions() {
  // Define several distinct color regions
  colorRegions = [
    // Red region
    {
      name: "Red",
      rMin: 150, rMax: 255,
      gMin: 20, gMax: 100,
      bMin: 20, bMax: 100
    },
    // Blue region
    {
      name: "Blue",
      rMin: 20, rMax: 100,
      gMin: 20, gMax: 100,
      bMin: 150, bMax: 255
    },
    // Green region
    {
      name: "Green",
      rMin: 20, rMax: 100,
      gMin: 150, gMax: 255,
      bMin: 20, bMax: 100
    },
    // Yellow/Orange region
    {
      name: "Yellow",
      rMin: 150, rMax: 255,
      gMin: 150, gMax: 255,
      bMin: 20, bMax: 100
    },
    // Purple region
    {
      name: "Purple",
      rMin: 100, rMax: 200,
      gMin: 20, gMax: 100,
      bMin: 150, bMax: 255
    },
    // Teal region
    {
      name: "Teal",
      rMin: 20, rMax: 100,
      gMin: 150, gMax: 220,
      bMin: 150, bMax: 220
    },
    // Pink region
    {
      name: "Pink",
      rMin: 200, rMax: 255,
      gMin: 100, gMax: 180,
      bMin: 150, bMax: 220
    },
    // Brown region
    {
      name: "Brown",
      rMin: 120, rMax: 180,
      gMin: 60, gMax: 120,
      bMin: 20, bMax: 80
    }
  ];
}

function draw() { 
  // Drawing not needed
}



function generate(column, endPhrase, posVector, columnNumber, sourceGrammar, regionIndex) {
  // Determine which index and array to use
  let currentIndex, shuffledVerbs;
  
  if (columnNumber === 1) {
    currentIndex = currentIndex1;
    shuffledVerbs = shuffledVerbs1;
    
    // Check if we've reached 15 phrases for this column
    if (currentIndex1 >= 15) {
      // Don't add any more phrases after 15
      return;
    }
  } else if (columnNumber === 2) {
    currentIndex = currentIndex2;
    shuffledVerbs = shuffledVerbs2;
    
    // Check if we've reached 15 phrases for this column
    if (currentIndex2 >= 15) {
      // Don't add any more phrases after 15
      return;
    }
  } else if (columnNumber === 3) {
    currentIndex = currentIndex3;
    shuffledVerbs = shuffledVerbs3;
    
    // Check if we've reached 15 phrases for this column
    if (currentIndex3 >= 15) {
      // Don't add any more phrases after 15
      return;
    }
  } else {
    currentIndex = currentIndex4;
    shuffledVerbs = shuffledVerbs4;
    
    // Check if we've reached 15 phrases for this column
    if (currentIndex4 >= 15) {
      // Don't add any more phrases after 15
      return;
    }
  }
  
  // If all verbs have been shown, reshuffle and restart
  if (currentIndex >= shuffledVerbs.length) {
    shuffledVerbs = shuffleArray([...sourceGrammar.verb]);
    
    if (columnNumber === 1) {
      shuffledVerbs1 = shuffledVerbs;
      currentIndex1 = 0;
      currentIndex = 0;
    } else if (columnNumber === 2) {
      shuffledVerbs2 = shuffledVerbs;
      currentIndex2 = 0;
      currentIndex = 0;
    } else if (columnNumber === 3) {
      shuffledVerbs3 = shuffledVerbs;
      currentIndex3 = 0;
      currentIndex = 0;
    } else {
      shuffledVerbs4 = shuffledVerbs;
      currentIndex4 = 0;
      currentIndex = 0;
    }
  }

  // Get the current verb and form the sentence with capitalization
  let currentVerb = shuffledVerbs[currentIndex].toUpperCase(); // Capitalize the verb
  let capitalizedEndPhrase = endPhrase.toUpperCase(); // Capitalize LIVE or DIE
  let sentence = `${currentVerb} and ${capitalizedEndPhrase}`;

  // Get the direction vector for this column
  let dirVector;
  if (columnNumber === 1) dirVector = colorDir1;
  else if (columnNumber === 2) dirVector = colorDir2;
  else if (columnNumber === 3) dirVector = colorDir3;
  else dirVector = colorDir4;
  
  // Step through the color space in a consistent direction
  // Every 5 steps, slightly change the direction to avoid getting stuck
  if (currentIndex % 5 === 0) {
    // Slightly adjust direction vector to create variation while maintaining continuity
    let small_jitter = p5.Vector.random3D();
    small_jitter.mult(0.2); // Very small adjustment
    dirVector.add(small_jitter);
    dirVector.normalize(); // Keep it unit length
  }
  
  // Clone the direction vector before modifying (to avoid changing the original)
  let step = dirVector.copy();
  step.mult(30); // Step size
  
  // Add the step to the position vector
  posVector.add(step);
  
  // Get the region constraints for this column
  let region = colorRegions[regionIndex];
  
  // Constrain to valid RGB values while staying in the color region
  posVector.x = constrain(posVector.x, region.rMin, region.rMax);
  posVector.y = constrain(posVector.y, region.gMin, region.gMax);
  posVector.z = constrain(posVector.z, region.bMin, region.bMax);
  
  // Check if we're hitting the boundaries - if so, reflect the direction
  let hitBoundary = false;
  
  if (posVector.x <= region.rMin || posVector.x >= region.rMax) {
    dirVector.x *= -1; // Reflect x direction
    hitBoundary = true;
  }
  
  if (posVector.y <= region.gMin || posVector.y >= region.gMax) {
    dirVector.y *= -1; // Reflect y direction
    hitBoundary = true;
  }
  
  if (posVector.z <= region.bMin || posVector.z >= region.bMax) {
    dirVector.z *= -1; // Reflect z direction
    hitBoundary = true;
  }
  
  // If we hit a boundary, normalize the direction vector again
  if (hitBoundary) {
    dirVector.normalize();
  }
  
  // Find the nearest named color
  let colorName = findNearest(posVector);
  let colorVector = vectors[colorName];
  
  // Display the sentence with the color
  let outputElem = createP(sentence);
  outputElem.parent(column);
  outputElem.style('line-height', '1.5');
  outputElem.style('white-space', 'pre-line');
  outputElem.style('color', `rgb(${colorVector.x}, ${colorVector.y}, ${colorVector.z})`);
  outputElem.style('font-size', '18px'); // Slightly smaller text to fit better
  outputElem.style('margin', '10px 0');
  outputElem.style('word-wrap', 'break-word'); // Prevent text overflow
  outputElem.style('text-align', 'center'); // Center align the text
  outputElem.style('font-weight', 'bold'); // Make all text bold

  // Move to the next verb
  if (columnNumber === 1) {
    currentIndex1++;
    
    // Disable button after 15 phrases
    if (currentIndex1 >= 15) {
      genButton1.attribute('disabled', '');
      genButton1.style('opacity', '0.5');
      genButton1.style('cursor', 'default');
    }
  } else if (columnNumber === 2) {
    currentIndex2++;
    
    // Disable button after 15 phrases
    if (currentIndex2 >= 15) {
      genButton2.attribute('disabled', '');
      genButton2.style('opacity', '0.5');
      genButton2.style('cursor', 'default');
    }
  } else if (columnNumber === 3) {
    currentIndex3++;
    
    // Disable button after 15 phrases
    if (currentIndex3 >= 15) {
      genButton3.attribute('disabled', '');
      genButton3.style('opacity', '0.5');
      genButton3.style('cursor', 'default');
    }
  } else {
    currentIndex4++;
    
    // Disable button after 15 phrases
    if (currentIndex4 >= 15) {
      genButton4.attribute('disabled', '');
      genButton4.style('opacity', '0.5');
      genButton4.style('cursor', 'default');
    }
  }
}

// Utility: Fisher-Yates Shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// The original verb list for columns 1 and 2
let grammarSource1 = {
  "verb": [
    "Live", "Piss", "Eat", "Sleep", "Love", "Hate",
    "Fuck", "Speak", "Lie", "Hear", "Cry", "Kiss",
    "Rage", "Laugh", "Touch", "Feel", "Fear", "Sick",
    "Well", "White", "Red", "Yellow"
  ]
};

// The new verb list for columns 3 and 4
let grammarSource2 = {
  "verb": [
    "Sing", "Scream", "Young", "Old", "Out", "Run",
    "Stay", "Play", "Kill", "Suck", "Come", "Go",
    "Know", "Yell", "Smell", "Fall", "Rise", "Stand",
    "Sit", "Spit", "Try", "Fail", "Smile"
  ]
};

function processData(data){
  let vectors = {};
  let colors = data.colors;

  for (let i = 0; i < colors.length; i++){
    let label = colors[i].color;  
    let rgb = color(colors[i].hex);
    vectors[label] = createVector(red(rgb), green(rgb), blue(rgb));  
    // make a p5.Vector out of the RGB values
  }
  return vectors;
}

function findNearest(v){
  let keys = Object.keys(vectors);
  keys.sort((a,b) =>{
    let d1 = distance(v, vectors[a]);
    let d2 = distance(v, vectors[b]);
    return d1 - d2;
  });
  return keys[0]; // Return the closest color name
}

function distance(v1, v2){
  return p5.Vector.dist(v1, v2);
}

// Add a function to find opposite color regions
function findOppositeColorRegion(index) {
  let region = colorRegions[index];
  
  // Define opposites based on color properties
  if (region.name === "Red") return findIndexByName("Green");
  if (region.name === "Green") return findIndexByName("Red");
  if (region.name === "Blue") return findIndexByName("Yellow");
  if (region.name === "Yellow") return findIndexByName("Blue");
  if (region.name === "Purple") return findIndexByName("Teal");
  if (region.name === "Teal") return findIndexByName("Purple");
  if (region.name === "Pink") return findIndexByName("Brown");
  if (region.name === "Brown") return findIndexByName("Pink");
  
  // Fallback - if no defined opposite, just pick something else
  let availableIndices = [...Array(colorRegions.length).keys()].filter(i => i !== index);
  return availableIndices[Math.floor(Math.random() * availableIndices.length)];
}

// Helper function to find a region index by name
function findIndexByName(name) {
  for (let i = 0; i < colorRegions.length; i++) {
    if (colorRegions[i].name === name) return i;
  }
  return 0; // Fallback to first index if not found
}