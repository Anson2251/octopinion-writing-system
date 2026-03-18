<script setup lang="ts">
import { ref, computed } from 'vue'

const inputText = ref('')

const words = computed(() => {
  if (!inputText.value.trim()) return []
  return inputText.value.toLocaleUpperCase()
    .trim()
    .split(/\s+/)
    .map(word => word.split(''))
    .filter(syllables => syllables.length > 0 && syllables.length <= 5)
})
</script>

<template>
  <div class="app">
    <h1>Conlang Writing System Demo</h1>

    <p class="description">
      Enter letter sequences (space-separated). Each sequence becomes a word with 1-5 syllables.
      Words are written right-to-left.
    </p>

    <div class="display-area">
      <div v-if="words.length === 0" class="placeholder">
        Type below to see your text in conlang...
      </div>

      <div v-else class="words-container">
        <div
          v-for="(word, wordIndex) in words"
          :key="wordIndex"
          class="word-block"
        >
          <!-- Position 2: Top (horizontal rectangle) -->
          <span v-if="word.length >= 2" class="syllable pos-2">
            {{ word[1] }}
          </span>

          <!-- Position 5: Left (vertical rectangle) -->
          <span v-if="word.length >= 5" class="syllable pos-5">
            {{ word[4] }}
          </span>

          <!-- Position 1: Center (square) -->
          <span class="syllable pos-1">
            {{ word[0] }}
          </span>

          <!-- Position 3: Right (vertical rectangle) -->
          <span v-if="word.length >= 3" class="syllable pos-3">
            {{ word[2] }}
          </span>

          <!-- Position 4: Bottom (horizontal rectangle) -->
          <span v-if="word.length >= 4" class="syllable pos-4">
            {{ word[3] }}
          </span>
        </div>
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="inputText"
        type="text"
        placeholder="Enter letters (e.g., 'abc def gh')"
      />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #111;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  text-align: center;
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

.description {
  text-align: center;
  padding: 0 20px 20px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  font-size: 14px;
}

.display-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.placeholder {
  color: #ccc;
  font-size: 20px;
  font-style: italic;
}

.words-container {
  display: flex;
  flex-direction: row-reverse;
  gap: 60px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.word-block {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    ". top ."
    "left center right"
    ". bottom .";
  gap: 10px;
  align-items: center;
  justify-items: center;
  padding: 10px;
}

.syllable {
  font-family: 'Untitled1', sans-serif;
  line-height: 1;
  color: #000;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.syllable:hover {
  color: #333;
}

/* Position 1: Center - square */
.pos-1 {
  grid-area: center;
  font-size: 70px;
  width: 70px;
  height: 70px;
}

/* Position 2: Top - horizontal rectangle */
.pos-2 {
  grid-area: top;
  font-size: 50px;
  width: 70px;
  height: 35px;
  transform: scaleY(0.7);
  transform-origin: center;
}

/* Position 3: Right - vertical rectangle */
.pos-3 {
  grid-area: right;
  font-size: 50px;
  width: 35px;
  height: 70px;
  transform: scaleX(0.7);
  transform-origin: center;
}

/* Position 4: Bottom - horizontal rectangle */
.pos-4 {
  grid-area: bottom;
  font-size: 50px;
  width: 70px;
  height: 35px;
  transform: scaleY(0.7);
  transform-origin: center;
}

/* Position 5: Left - vertical rectangle */
.pos-5 {
  grid-area: left;
  font-size: 50px;
  width: 35px;
  height: 70px;
  transform: scaleX(0.7);
  transform-origin: center;
}

.input-area {
  padding: 30px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
}

input {
  width: 100%;
  max-width: 600px;
  display: block;
  margin: 0 auto;
  padding: 15px 20px;
  font-size: 18px;
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 8px;
  color: #000;
  outline: none;
  transition: border-color 0.3s ease;
}

input::placeholder {
  color: #999;
}

input:focus {
  border-color: #000;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pos-1 {
    font-size: 50px;
    width: 50px;
    height: 50px;
  }
  .pos-2, .pos-4 {
    font-size: 35px;
    width: 50px;
    height: 25px;
  }
  .pos-3, .pos-5 {
    font-size: 35px;
    width: 25px;
    height: 50px;
  }
  .words-container {
    gap: 40px;
  }
}

@media (max-width: 480px) {
  .pos-1 {
    font-size: 35px;
    width: 35px;
    height: 35px;
  }
  .pos-2, .pos-4 {
    font-size: 25px;
    width: 35px;
    height: 18px;
  }
  .pos-3, .pos-5 {
    font-size: 25px;
    width: 18px;
    height: 35px;
  }
  .words-container {
    gap: 30px;
  }
}
</style>
