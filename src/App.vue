<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="app">
    <nav class="nav">
      <div class="nav-brand">Octopinion</div>
      <div class="nav-links">
        <router-link
          to="/"
          class="nav-link"
          :class="{ active: route.name === 'conlang' }"
        >
          Octopinion Demo
        </router-link>
        <router-link
          to="/word-encoding"
          class="nav-link"
          :class="{ active: route.name === 'word-encoding' }"
        >
          Word Encoding
        </router-link>
        <router-link
          to="/codebook-words"
          class="nav-link"
          :class="{ active: route.name === 'codebook-words' }"
        >
          Codebook Words
        </router-link>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
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
  background: #fff;
  color: #111;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.nav {
  background: #000;
  color: #fff;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  font-size: 20px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 10px;
}

.nav-link {
  color: #ccc;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  min-height: calc(100vh - 60px);
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 10px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .main-content {
    min-height: calc(100vh - 100px);
  }
}
</style>
