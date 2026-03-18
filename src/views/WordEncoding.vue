<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface WordEncodingData {
  vocabulary: Record<string, string>
  unique_words: Record<string, string[]>
  statistics: {
    total_concepts: number
    unique_words: number
    synonyms: number
  }
}

const wordData = ref<WordEncodingData | null>(null)
const filterText = ref('')
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await fetch('/word-encoding.json')
    if (!response.ok) {
      throw new Error('Failed to load word encoding data')
    }
    wordData.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})

// Parse encoding into syllables, handling negative markers
function parseEncoding(encoding: string): { syllable: string; isNegative: boolean }[] {
  const parts = encoding.split('--')
  const result: { syllable: string; isNegative: boolean }[] = []

  parts.forEach((part, index) => {
    const syllables = part.split('-').filter(s => s.trim())
    syllables.forEach(syllable => {
      result.push({
        syllable: syllable.trim(),
        isNegative: index > 0 // All parts after -- are negative
      })
    })
  })

  return result
}

const filteredVocabulary = computed(() => {
  if (!wordData.value) return []

  const entries = Object.entries(wordData.value.vocabulary)
  if (!filterText.value.trim()) {
    return entries
  }

  const search = filterText.value.toLowerCase()
  return entries.filter(([word, encoding]) => {
    return word.toLowerCase().includes(search) ||
           encoding.toLowerCase().includes(search)
  })
})

const totalCount = computed(() => wordData.value?.statistics.total_concepts ?? 0)
const filteredCount = computed(() => filteredVocabulary.value.length)
</script>

<template>
  <div class="word-encoding">
    <h1>Word Encoding Reference</h1>

    <div class="stats" v-if="wordData">
      <span class="stat">Total Concepts: {{ totalCount }}</span>
      <span class="stat">Unique Words: {{ wordData.statistics.unique_words }}</span>
      <span class="stat">Synonyms: {{ wordData.statistics.synonyms }}</span>
    </div>

    <div class="filter-section">
      <input
        v-model="filterText"
        type="text"
        placeholder="Filter words or encodings..."
        class="filter-input"
      />
      <span class="filter-count" v-if="wordData">
        Showing {{ filteredCount }} of {{ totalCount }}
      </span>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="wordData" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Word</th>
            <th>Encoding</th>
            <th>Visual Representation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[word, encoding] in filteredVocabulary" :key="word">
            <td class="word-cell">{{ word }}</td>
            <td class="encoding-cell">{{ encoding }}</td>
            <td class="visual-cell">
              <div class="syllables">
                <span
                  v-for="(item, index) in parseEncoding(encoding)"
                  :key="index"
                  class="syllable"
                  :class="{ negative: item.isNegative }"
                >
                  {{ item.syllable }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.word-encoding {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  height: calc(100vh - 60px);
  overflow: auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #000;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-input {
  flex: 1;
  min-width: 250px;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;
}

.filter-input:focus {
  border-color: #000;
}

.filter-count {
  color: #666;
  font-size: 14px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #d32f2f;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-height: calc(100vh - 18em);
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
}

td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

tr:hover {
  background: #f9f9f9;
}

.word-cell {
  font-weight: 500;
  color: #000;
}

.encoding-cell {
  font-family: monospace;
  font-size: 13px;
  color: #666;
}

.visual-cell {
  min-width: 200px;
}

.syllables {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.syllable {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  position: relative;
}

.syllable.negative {
  background: #ffebee;
}

.syllable.negative::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #d32f2f;
  transform: rotate(-15deg);
}

@media (max-width: 768px) {
  .word-encoding {
    padding: 10px;
  }

  th, td {
    padding: 8px;
    font-size: 14px;
  }

  .syllable {
    font-size: 12px;
    padding: 3px 6px;
  }
}
</style>
