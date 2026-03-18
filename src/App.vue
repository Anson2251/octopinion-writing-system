<script setup lang="ts">
import { ref, computed } from 'vue'

const inputText = ref('')

type CaseType = 'nom' | 'acc' | 'gen' | 'dat' | 'abl' | 'ins' | 'voc' | 'loc' | 'all'

const caseNames: Record<CaseType, string> = {
  nom: 'Nominative',
  acc: 'Accusative',
  gen: 'Genitive',
  dat: 'Dative',
  abl: 'Ablative',
  ins: 'Instrumental',
  voc: 'Vocative',
  loc: 'Locative',
  all: 'Allative'
}

const words = computed(() => {
  if (!inputText.value.trim()) return []

  return inputText.value
    .trim()
    .split(/\s+/)
    .map(rawWord => {
      // Parse case from suffix (e.g., "abc.acc" or "abc:acc")
      const caseMatch = rawWord.match(/^(.+?)[.:](\w+)$/)
      let word = rawWord.toLocaleUpperCase()
      let wordCase: CaseType = 'nom'

      if (caseMatch && caseMatch[1] && caseMatch[2]) {
        word = caseMatch[1].toLocaleUpperCase()
        const caseCode = caseMatch[2].toLowerCase()
        if (caseCode in caseNames) {
          wordCase = caseCode as CaseType
        }
      }

      return {
        syllables: word.split('').filter((_, i) => i < 5),
        case: wordCase
      }
    })
    .filter(data => data.syllables.length > 0)
})
</script>

<template>
  <div class="app">
    <h1>Conlang Writing System Demo</h1>

    <p class="description">
      Enter letter sequences (space-separated). Each sequence becomes a word with 1-5 syllables.
      Words are written right-to-left.<br>
      Add case with suffix: .nom .acc .gen .dat .abl .ins .voc .loc .all
    </p>

    <div class="display-area">
      <div v-if="words.length === 0" class="placeholder">
        Type below to see your text in conlang...
      </div>

      <div v-else class="words-container">
        <div
          v-for="(wordData, wordIndex) in words"
          :key="wordIndex"
          class="word-wrapper"
        >
          <div
            class="word-block"
            :class="['case-' + wordData.case]"
            :title="caseNames[wordData.case]"
          >
            <!-- Position 2: Top (horizontal rectangle) -->
            <span v-if="wordData.syllables.length >= 2" class="syllable pos-2">
              {{ wordData.syllables[1] }}
            </span>

            <!-- Position 5: Left (vertical rectangle) -->
            <span v-if="wordData.syllables.length >= 5" class="syllable pos-5">
              {{ wordData.syllables[4] }}
            </span>

            <!-- Position 1: Center (square) -->
            <span class="syllable pos-1">
              {{ wordData.syllables[0] }}
            </span>

            <!-- Position 3: Right (vertical rectangle) -->
            <span v-if="wordData.syllables.length >= 3" class="syllable pos-3">
              {{ wordData.syllables[2] }}
            </span>

            <!-- Position 4: Bottom (horizontal rectangle) -->
            <span v-if="wordData.syllables.length >= 4" class="syllable pos-4">
              {{ wordData.syllables[3] }}
            </span>
          </div>
          <div class="case-label">{{ caseNames[wordData.case] }}</div>
        </div>
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="inputText"
        type="text"
        placeholder="Enter letters with case: abc.acc def.gen gh"
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
  max-width: 700px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.5;
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
  gap: 80px;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
}

.word-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.case-label {
  font-size: 12px;
  color: #666;
  text-transform: capitalize;
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
  padding: 15px;
  position: relative;
}

/* Case markers - lines on the edge */
.word-block::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 3px;
  background: #000;
  transition: all 0.3s ease;
}

/* Nominative - no marker */
.case-nom::before {
  display: none;
}

/* Accusative - line at top */
.case-acc::before {
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
}

/* Genitive - line at top-left corner */
.case-gen::before {
  top: 5px;
  left: 5px;
  transform: rotate(-45deg);
  transform-origin: left center;
}

/* Dative - line at left */
.case-dat::before {
  top: 50%;
  left: 5px;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
}

/* Ablative - line at bottom-left corner */
.case-abl::before {
  bottom: 5px;
  left: 5px;
  transform: rotate(45deg);
  transform-origin: left center;
}

/* Instrumental - line at bottom */
.case-ins::before {
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
}

/* Vocative - line at bottom-right corner */
.case-voc::before {
  bottom: 5px;
  right: 5px;
  transform: rotate(-45deg);
  transform-origin: right center;
}

/* Locative - line at right */
.case-loc::before {
  top: 50%;
  right: 5px;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
}

/* Allative - line at top-right corner */
.case-all::before {
  top: 5px;
  right: 5px;
  transform: rotate(45deg);
  transform-origin: right center;
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
  max-width: 700px;
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
