import { createRouter, createMemoryHistory } from 'vue-router'
import ConlangDemo from '../views/ConlangDemo.vue'
import WordEncoding from '../views/WordEncoding.vue'
import CodebookWords from '../views/CodebookWords.vue'
import Alphabet from '../views/Alphabet.vue'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
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
    },
    {
      path: '/alphabet',
      name: 'alphabet',
      component: Alphabet
    }
  ]
})

export default router
