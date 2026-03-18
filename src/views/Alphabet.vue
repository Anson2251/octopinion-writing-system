<script setup lang="ts">
// Generate alphabet A-Z
const alphabet = Array.from({ length: 20 }, (_, i) => ({
  letter: String.fromCharCode(65 + i), // A-Z
  octopinion: String.fromCharCode(65 + i) // Same letter but will use conlang font
}))

// Generate digits 0-7
const digits = Array.from({ length: 8 }, (_, i) => ({
  digit: i.toString(),
  octopinion: String.fromCharCode(i + 48)
}))
</script>

<template>
  <div class="alphabet-page">
    <h1>Octopinion Alphabet Reference</h1>

    <div class="section">
      <h2>Letters</h2>
      <div class="alphabet-grid">
        <div
          v-for="(item, index) in alphabet"
          :key="index"
          class="letter-card"
        >
          <div class="english">{{ item.letter }}</div>
          <div class="octopinion">{{ item.octopinion }}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Digits (0-7)</h2>
      <div class="digits-grid">
        <div
          v-for="(item, index) in digits"
          :key="index"
          class="digit-card"
        >
          <div class="english">{{ item.digit }}</div>
          <div class="octopinion">{{ item.octopinion }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alphabet-page {
  padding: 20px;
  padding-top: 0;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #000;
}

.section {
  margin-bottom: 40px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
}

.alphabet-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  max-width: 800px;
  margin: 0 auto;
}

.digits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.letter-card,
.digit-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.letter-card:hover,
.digit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.english {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
}

.octopinion {
  font-family: 'Untitled1', sans-serif;
  font-size: 32px;
  color: #000;
  line-height: 1;
}

@media (max-width: 768px) {
  .alphabet-page {
    padding: 15px;
  }

  .alphabet-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .digits-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .octopinion {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .alphabet-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .octopinion {
    font-size: 24px;
  }
}
</style>
