<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface SimilarityData {
  word: string
  similarity: number
}

type CodebookData = Record<string, SimilarityData[]>

const codebookData = ref<CodebookData | null>(null)
const loading = ref(true)
const error = ref('')
const expandedClusters = ref<Set<string>>(new Set())

onMounted(async () => {
  try {
    const response = await fetch('./codebook-words.json')
    if (!response.ok) {
      throw new Error('Failed to load codebook words data')
    }
    codebookData.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})

function toggleCluster(clusterId: string) {
  if (expandedClusters.value.has(clusterId)) {
    expandedClusters.value.delete(clusterId)
  } else {
    expandedClusters.value.add(clusterId)
  }
}

const sortedClusters = computed(() => {
  if (!codebookData.value) return []
  return Object.entries(codebookData.value).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
})

function getSimilarityColor(similarity: number): string {
  // Higher similarity = darker/more intense color
  if (similarity >= 0.9) return '#1a5f1a'
  if (similarity >= 0.8) return '#2e7d32'
  if (similarity >= 0.7) return '#4caf50'
  if (similarity >= 0.6) return '#81c784'
  return '#a5d6a7'
}
</script>

<template>
  <div class="codebook-words">
    <h1>Codebook Words - Similarity Clusters</h1>

    <p class="description">
      Each cluster (0-19) represents a concept group. Words within each cluster are sorted by similarity score.
    </p>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="codebookData" style="height: calc(100vh - 13em); overflow: auto;">
    <div class="clusters">
      <div
        v-for="[clusterId, words] in sortedClusters"
        :key="clusterId"
        class="cluster"
      >
        <div
          class="cluster-header"
          @click="toggleCluster(clusterId)"
        >
          <span class="cluster-id">Cluster {{ clusterId }} ({{ String.fromCharCode(65 + Number(clusterId)) }})</span>
          <div class="cluster-representative">
          <div style="width: fit-content; color: #2e7d32; background: #e8f5e9; padding: 4px 12px; border-radius: 16px;" :title="words[0] ? `Similarity: ${(words[0].similarity * 100).toFixed(1)}%` : ''">
            {{ words[0]?.word }}
          </div></div>
          <span class="cluster-count">{{ words.length }} words</span>
          <span class="expand-icon">
            {{ expandedClusters.has(clusterId) ? '▼' : '▶' }}
          </span>
        </div>

        <div v-if="expandedClusters.has(clusterId)" class="cluster-content">
          <table>
            <thead>
              <tr>
                <th>Word</th>
                <th>Similarity</th>
                <th>Visual</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in words" :key="index">
                <td class="word-cell">{{ item.word }}</td>
                <td class="similarity-cell">
                  <div class="similarity-bar-container">
                    <div
                      class="similarity-bar"
                      :style="{
                        width: `${item.similarity * 100}%`,
                        backgroundColor: getSimilarityColor(item.similarity)
                      }"
                    ></div>
                    <span class="similarity-value">
                      {{ (item.similarity * 100).toFixed(1) }}%
                    </span>
                  </div>
                </td>
                <td class="visual-cell">
                  <div
                    class="similarity-dot"
                    :style="{ backgroundColor: getSimilarityColor(item.similarity) }"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.codebook-words {
  padding: 20px;
  padding-top: 0;
  max-width: 900px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  height: calc(100vh - 60px);
  overflow: auto;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
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

.clusters {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cluster {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.cluster-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f5f5f5;
  cursor: pointer;
  transition: background 0.2s ease;
  user-select: none;
}

.cluster-header:hover {
  background: #e0e0e0;
}

.cluster-id {
  font-weight: 600;
  font-size: 16px;
  color: #000;
  min-width: 80px;
}

.cluster-representative {
  flex: 1;
  font-weight: 500;
  font-size: 15px;
  margin: 0 15px;
  text-align: center;
}

.cluster-count {
  color: #666;
  font-size: 14px;
  margin-right: 15px;
}

.expand-icon {
  color: #666;
  font-size: 12px;
}

.cluster-content {
  padding: 0;
  background: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #fafafa;
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

td {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

tr:hover {
  background: #fafafa;
}

.word-cell {
  font-weight: 500;
  width: 150px;
}

.similarity-cell {
  width: 60%;
}

.similarity-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.similarity-bar {
  height: 20px;
  border-radius: 10px;
  transition: width 0.3s ease;
  min-width: 4px;
}

.similarity-value {
  font-size: 13px;
  color: #666;
  min-width: 50px;
}

.visual-cell {
  width: 50px;
  text-align: center;
}

.similarity-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

@media (max-width: 768px) {
  .codebook-words {
    padding: 10px;
  }

  .cluster-header {
    padding: 12px 15px;
  }

  th, td {
    padding: 8px;
    font-size: 13px;
  }

  .word-cell {
    width: 100px;
  }
}
</style>
