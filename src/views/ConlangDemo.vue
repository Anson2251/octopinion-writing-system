<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface WordEncodingData {
  vocabulary: Record<string, string>
}

type CaseType = 'nom' | 'acc' | 'gen' | 'dat' | 'abl' | 'ins' | 'voc' | 'loc' | 'all'
type InputMode = 'words' | 'letters'

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

const inputText = ref('')
const inputMode = ref<InputMode>('words')
const vocabulary = ref<Record<string, string>>({})
const notFoundWords = ref<Set<string>>(new Set())

onMounted(async () => {
  try {
    const response = await fetch('/word-encoding.json')
    if (!response.ok) {
      throw new Error('Failed to load word encoding data')
    }
    const data: WordEncodingData = await response.json()
    vocabulary.value = data.vocabulary
  } catch (err) {
    console.error('Failed to load vocabulary:', err)
  }
})

// Parse encoding into syllables, handling negative markers
// e.g., "S17-S12-S13--S17-S7-S7" -> [S17, S12, S13, -S17, S7, S7]
function parseEncoding(encoding: string): { syllable: string; isNegative: boolean }[] {
  const parts = encoding.split('-')
  const result: { syllable: string; isNegative: boolean }[] = []

  let nextIsNegative = false

  for (const part of parts) {
    if (part === '') {
      // An empty part means the following token should be negative
      nextIsNegative = true
    } else {
      // This part is a syllable like "S17" - convert to letter (1=A, 2=B, etc.)
      const syllableNumber = parseInt(part.replace(/^S/i, ''), 10)
      const letter = syllableNumber > 0 && syllableNumber <= 26
        ? String.fromCharCode(64 + syllableNumber) // 65 is 'A'
        : part.replace(/^S/i, '')
      result.push({
        syllable: letter,
        isNegative: nextIsNegative
      })
      nextIsNegative = false // Reset after consuming a token
    }
  }

  return result
}

// Parse letter sequence directly (e.g., "QMC-QGG" -> [Q, M, C, -Q, G, G])
function parseLetterSequence(sequence: string): { syllable: string; isNegative: boolean }[] {
  const result: { syllable: string; isNegative: boolean }[] = []
  let isNegative = false

  for (const char of sequence.toUpperCase()) {
    if (char === '-') {
      isNegative = true
    } else if (char >= 'A' && char <= 'Z') {
      result.push({
        syllable: char,
        isNegative: isNegative
      })
      isNegative = false
    }
    // Ignore other characters
  }

  return result
}

const words = computed(() => {
  if (!inputText.value.trim()) return []

  const notFound = new Set<string>()

  const result = inputText.value
    .trim()
    .split(/\s+/)
    .map(rawWord => {
      // Parse case from suffix (e.g., "arm.acc" or "QMC-QGG.acc")
      const caseMatch = rawWord.match(/^(.+?)[.:](\w+)$/)
      let wordOrLetters = rawWord
      let wordCase: CaseType = 'nom'

      if (caseMatch && caseMatch[1] && caseMatch[2]) {
        wordOrLetters = caseMatch[1]
        const caseCode = caseMatch[2].toLowerCase()
        if (caseCode in caseNames) {
          wordCase = caseCode as CaseType
        }
      }

      let syllables: { syllable: string; isNegative: boolean }[]

      if (inputMode.value === 'letters') {
        // Letter mode: parse letters directly
        syllables = parseLetterSequence(wordOrLetters)
        if (syllables.length === 0) {
          notFound.add(rawWord)
          return null
        }
      } else {
        // Word mode: look up in vocabulary
        const word = wordOrLetters.toLowerCase()
        const encoding = vocabulary.value[word]
        if (!encoding) {
          notFound.add(rawWord)
          return null
        }
        // Parse encoding into syllables
        syllables = parseEncoding(encoding)
      }

      // Take only first 5 syllables for display
      const displaySyllables = syllables.slice(0, 5)

      return {
        word: wordOrLetters,
        syllables: displaySyllables,
        case: wordCase
      }
    })
    .filter((data): data is NonNullable<typeof data> => data !== null)

  notFoundWords.value = notFound
  return result
})
</script>

<template>
  <div class="conlang-demo">
    <h1>Octopinion Writing System Demo</h1>

    <p class="description">
      <template v-if="inputMode === 'words'">
        Enter vocabulary words (space-separated). Each word will be converted to its Octopinion encoding.<br>
        Add case with suffix: .nom .acc .gen .dat .abl .ins .voc .loc .all<br>
        Example: arm.acc eye.gen
      </template>
      <template v-else>
        Enter letters directly (space-separated words). Use - before a letter for negative.<br>
        Add case with suffix: .nom .acc .gen .dat .abl .ins .voc .loc .all<br>
        Example: QMC-QGG.acc ABC.def
      </template>
    </p>

    <div class="display-area">
      <div v-if="words.length === 0" class="placeholder">
        Type below to see your text in Octopinion...
      </div>

      <div v-else class="words-container">
        <template v-for="(wordData, wordIndex) in words" :key="wordIndex">
        <div
          v-if="wordData.syllables.length > 0"
          class="word-wrapper"
        >
          <div
            class="word-block"
            :class="['case-' + wordData.case]"
            :title="caseNames[wordData.case]"
          >
            <!-- Position 2: Top (horizontal rectangle) -->
            <span
              v-if="wordData.syllables.length >= 2"
              class="syllable pos-2"
              :class="{ negative: wordData.syllables[1]?.isNegative }"
            >
              {{ wordData.syllables[1]?.syllable }}
            </span>

            <!-- Position 5: Left (vertical rectangle) -->
            <span
              v-if="wordData.syllables.length >= 5"
              class="syllable pos-5"
              :class="{ negative: wordData.syllables[4]?.isNegative }"
            >
              {{ wordData.syllables[4]?.syllable }}
            </span>

            <!-- Position 1: Center (square) -->
            <span
              v-if="wordData.syllables.length >= 1"
              class="syllable pos-1"
              :class="{ negative: wordData.syllables[0]?.isNegative }"
            >
              {{ wordData.syllables[0]?.syllable }}
            </span>

            <!-- Position 3: Right (vertical rectangle) -->
            <span
              v-if="wordData.syllables.length >= 3"
              class="syllable pos-3"
              :class="{ negative: wordData.syllables[2]?.isNegative }"
            >
              {{ wordData.syllables[2]?.syllable }}
            </span>

            <!-- Position 4: Bottom (horizontal rectangle) -->
            <span
              v-if="wordData.syllables.length >= 4"
              class="syllable pos-4"
              :class="{ negative: wordData.syllables[3]?.isNegative }"
            >
              {{ wordData.syllables[3]?.syllable }}
            </span>
          </div>
          <div class="case-label">{{ caseNames[wordData.case] }}</div>
        </div>
        </template>
      </div>
    </div>

    <div class="input-area">
      <div class="mode-switch">
        <button
          class="mode-btn"
          :class="{ active: inputMode === 'words' }"
          @click="inputMode = 'words'"
        >
          Words
        </button>
        <button
          class="mode-btn"
          :class="{ active: inputMode === 'letters' }"
          @click="inputMode = 'letters'"
        >
          Letters
        </button>
      </div>
      <input
        v-model="inputText"
        type="text"
        :placeholder="inputMode === 'words'
          ? 'Enter words with case: arm.acc eye.gen head'
          : 'Enter letters with case: QMC-QGG.acc ABC.def'"
      />
      <div v-if="notFoundWords.size > 0" class="not-found">
        {{ inputMode === 'words' ? 'Words not found' : 'Invalid input' }}: {{ Array.from(notFoundWords).join(', ') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.conlang-demo {
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #111;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  justify-content: flex-start;
  padding: 40px 20px;
  overflow-y: auto;
}

.placeholder {
  color: #ccc;
  font-size: 20px;
  font-style: italic;
}

.words-container {
  display: flex;
  flex-direction: row-reverse;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
}

.word-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.case-label {
  font-size: 9px;
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
  gap: 4px;
  align-items: center;
  justify-items: center;
  padding: 6px;
  position: relative;
}

/* Case markers - large 30-degree arcs wrapping around the word */
.word-block::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 76px;
  height: 76px;
  margin-top: -38px;
  margin-left: -38px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: all 0.3s ease;
}

/* Nominative - no marker */
.case-nom::before {
  display: none;
}

/* Accusative - arc at top (centered, wider angle) */
.case-acc::before {
  border-top-color: #000;
  clip-path: polygon(30% 0%, 70% 0%, 70% 30%, 30% 30%);
}

/* Genitive - arc at top-right corner */
.case-gen::before {
  border-top-color: #000;
  border-right-color: #000;
  clip-path: polygon(63% 0%, 100% 0%, 100% 37%, 80% 37%, 63% 20%);
}

/* Dative - arc at right side (wider angle) */
.case-dat::before {
  border-right-color: #000;
  clip-path: polygon(70% 30%, 100% 30%, 100% 70%, 70% 70%);
}

/* Ablative - arc at bottom-right corner */
.case-abl::before {
  border-right-color: #000;
  border-bottom-color: #000;
  clip-path: polygon(80% 63%, 100% 63%, 100% 100%, 63% 100%, 63% 80%);
}

/* Instrumental - arc at bottom (wider angle) */
.case-ins::before {
  border-bottom-color: #000;
  clip-path: polygon(30% 70%, 70% 70%, 70% 100%, 30% 100%);
}

/* Vocative - arc at bottom-left corner */
.case-voc::before {
  border-bottom-color: #000;
  border-left-color: #000;
  clip-path: polygon(0% 63%, 20% 63%, 37% 80%, 37% 100%, 0% 100%);
}

/* Locative - arc at left side (wider angle) */
.case-loc::before {
  border-left-color: #000;
  clip-path: polygon(0% 30%, 30% 30%, 30% 70%, 0% 70%);
}

/* Allative - arc at top-left corner */
.case-all::before {
  border-left-color: #000;
  border-top-color: #000;
  clip-path: polygon(0% 0%, 37% 0%, 37% 20%, 20% 37%, 0% 37%);
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
  position: relative;
}

.syllable:hover {
  color: #333;
}

.syllable.negative::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #d32f2f;
  transform: translateY(-50%) rotate(-15deg);
}

/* Position 1: Center - square */
.pos-1 {
  grid-area: center;
  font-size: 28px;
  width: 28px;
  height: 28px;
}

/* Position 2: Top - horizontal rectangle */
.pos-2 {
  grid-area: top;
  font-size: 20px;
  width: 28px;
  height: 14px;
  transform: scaleY(0.7);
  transform-origin: center;
}

/* Position 3: Right - vertical rectangle */
.pos-3 {
  grid-area: right;
  font-size: 20px;
  width: 14px;
  height: 28px;
  transform: scaleX(0.7);
  transform-origin: center;
}

/* Position 4: Bottom - horizontal rectangle */
.pos-4 {
  grid-area: bottom;
  font-size: 20px;
  width: 28px;
  height: 14px;
  transform: scaleY(0.7);
  transform-origin: center;
}

/* Position 5: Left - vertical rectangle */
.pos-5 {
  grid-area: left;
  font-size: 20px;
  width: 14px;
  height: 28px;
  transform: scaleX(0.7);
  transform-origin: center;
}

.input-area {
  padding: 30px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
}

.mode-switch {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-bottom: 15px;
}

.mode-btn {
  padding: 10px 24px;
  font-size: 14px;
  border: 2px solid #ccc;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn:first-child {
  border-radius: 8px 0 0 8px;
  border-right: none;
}

.mode-btn:last-child {
  border-radius: 0 8px 8px 0;
}

.mode-btn:hover {
  background: #f0f0f0;
}

.mode-btn.active {
  background: #000;
  color: #fff;
  border-color: #000;
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

.not-found {
  text-align: center;
  color: #d32f2f;
  font-size: 14px;
  margin-top: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pos-1 {
    font-size: 24px;
    width: 24px;
    height: 24px;
  }
  .pos-2, .pos-4 {
    font-size: 17px;
    width: 24px;
    height: 12px;
  }
  .pos-3, .pos-5 {
    font-size: 17px;
    width: 12px;
    height: 24px;
  }
  .words-container {
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .pos-1 {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }
  .pos-2, .pos-4 {
    font-size: 14px;
    width: 20px;
    height: 10px;
  }
  .pos-3, .pos-5 {
    font-size: 14px;
    width: 10px;
    height: 20px;
  }
  .words-container {
    gap: 10px;
  }

  .mode-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
