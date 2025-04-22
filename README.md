# Vec2Color Word Visualization

A text-to-color visualization tool that generates short phrases and maps them to colors using the XKCD color survey data. The visualization creates four columns of text that step through color space with each new phrase, creating a visual narrative.

## Overview

This project maps words to specific colors using a vector-based approach. It:
1. Uses the XKCD color survey data to map color names to RGB values
2. Generates phrases in the format "[VERB] and [LIVE/DIE]" (e.g., "LOVE and DIE")
3. Steps through RGB color space for each phrase, creating a visual progression
4. Creates opposing color schemes between columns for visual contrast

## Features

- Four columns of text generation, each with its own color region
- Automated color progression that follows a consistent path through RGB space
- Color regions with complementary/opposing pairs for visual contrast
- Interactive buttons to generate new phrases
- A reset button to start a new "chapter" of text

## Technical Details

### Color Mapping

The project uses the XKCD color survey data (`xkcd.json`), which contains 954 named colors with their corresponding RGB values. This allows the visualization to:

1. Start with a random position in a specific color region
2. Step through color space in a consistent direction
3. Find the nearest named color from the XKCD dataset for each text phrase

Sample from the XKCD data:
```json
{
    "color": "bright blue",
    "hex": "#0165fc"
}
```

### Color Regions

The code defines 8 distinct color regions, each with min/max values for R, G, and B channels:

```javascript
// Example color region
{
  name: "Red",
  rMin: 150, rMax: 255,
  gMin: 20, gMax: 100,
  bMin: 20, bMax: 100
}
```

The system pairs opposing color regions (e.g., Red with Green, Blue with Yellow) to create visual contrast between columns.

### Text Generation

Each column uses a different list of verbs that are randomly shuffled:

- Columns 1 & 2 use: "Live", "Piss", "Eat", "Sleep", "Love", "Hate", etc.
- Columns 3 & 4 use: "Sing", "Scream", "Young", "Old", "Out", "Run", etc.

Phrases are constructed in the format: "[VERB] and [LIVE/DIE]"
- Columns 1 & 3 end with "DIE"
- Columns 2 & 4 end with "LIVE"

### Color Space Traversal

For each generated phrase:

1. The system takes a step in the current direction through RGB color space
2. It constrains the values to stay within the assigned color region
3. Every 5 steps, it slightly adjusts the direction to create variation
4. If a boundary is hit, it reflects the direction vector
5. The nearest XKCD color name is found for the current position
6. The text is displayed in the corresponding RGB color

## Usage

1. Open `index.html` in a web browser
2. Click one of the "Generate" buttons to start adding phrases to a column
3. Each generated phrase will have a unique color based on its position in the color space
4. Each column follows its own path through its assigned color region
5. When a column reaches 15 phrases, its button will be disabled
6. Click "Click for a New Chapter" at the top to start fresh with new color regions

## Implementation Details

The main algorithm:
1. Defines color regions with min/max RGB boundaries
2. Assigns opposing color regions to the four columns
3. Initializes random starting positions and direction vectors in RGB space
4. For each new phrase:
   - Steps through color space in the current direction
   - Constrains the position to stay within the color region
   - Finds the nearest XKCD color name
   - Displays the text in the corresponding color
   - Updates the direction if necessary

## Dependencies

- p5.js (included in the libraries folder)
- xkcd.json (color survey data)

## How to Modify

- Edit the `grammarSource1` and `grammarSource2` objects to change the vocabulary
- Modify the `defineColorRegions()` function to create different color palettes
- Change the step size (default 30) in the `generate()` function to alter the color progression rate
