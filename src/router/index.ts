import { createRouter, createWebHistory } from 'vue-router'
import ConlangDemo from '../views/ConlangDemo.vue'
import WordEncoding from '../views/WordEncoding.vue'
import CodebookWords from '../views/CodebookWords.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'conlang',
      component: ConlangDemo
    },
    {
      path: '/word-encoding',
      name: 'word-encoding',
      component: WordEncoding
    },
    {
      path: '/codebook-words',
      name: 'codebook-words',
      component: CodebookWords
    }
  ]
})

export default router
