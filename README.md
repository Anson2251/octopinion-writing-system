# Octopinion Writing System Demo

An interactive demo for a constructed language (Octopinion) writing system, built with Vue 3 and Vite.

## Writing System

Each word in this writing system contains 1-5 syllables arranged in a cross pattern:

```
    [2]  ← 2nd syllable (top, horizontal)
[5] [1] [3]  ← 5th (left), 1st (center), 3rd (right)
    [4]  ← 4th syllable (bottom, horizontal)
```

### Structure Rules

- **Position 1 (Center)**: 1st syllable - Most significant, displayed as a square
- **Position 2 (Top)**: 2nd syllable - Horizontal rectangle
- **Position 3 (Right)**: 3rd syllable - Vertical rectangle  
- **Position 4 (Bottom)**: 4th syllable - Horizontal rectangle
- **Position 5 (Left)**: 5th syllable - Vertical rectangle

Words are written **right-to-left** on the page.

### Syllable Structure

Each syllable follows this format (shown in the image):
- The center glyph is the main body
- Outer positions modify or extend the meaning
- The first syllable carries the most semantic weight

## Usage

1. Open the app in your browser
2. Type letter sequences in the input box at the bottom
3. Separate words with spaces (e.g., "abc def gh")
4. Each letter represents one syllable
5. Words with 1-5 letters will be displayed in the cross formation
6. Words are displayed right-to-left

### Example Inputs

- `a` - Single syllable word (just the center)
- `ab` - Two syllables (center + top)
- `abc` - Three syllables (center + top + right)
- `abcd` - Four syllables (center + top + right + bottom)
- `abcde` - Five syllables (full cross)
