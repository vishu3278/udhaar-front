<template>
  <main class="news-page">
    <section class="news-header">
      <div>
        <p class="eyebrow">Latest stories</p>
        <h1>News</h1>
        <p class="subtitle">A quick look at the headlines that matter.</p>
      </div>
      <div class="flex items-center gap-4">
        <!-- <select v-on:change="changeCountry" v-model="selectedCountry" class="refresh-button">
          <option v-for="c in country" :key="c.code" :value="c.code" :style="`background: url(/${c.flag}.svg) no-repeat left center; background-size: contain;`"> {{ c.name }}</option>
        </select> -->
        <div class="dropdown inline-block w-40 relative z-10">
          <button @click="open = !open" class="flex items-center gap-2 rounded w-full p-2 border-teal-700 text-teal-700 hover:bg-teal-100 hover:text-teal-800">
            <img :src="selectedCountry.flag" :alt="selectedCountry.name" class="icon w-8  " />
            {{ selectedCountry.name }}
          </button>

          <div v-if="open" class="menu absolute z-20 border border-teal-600">
            <button
              v-for="c in country"
              :key="c.code"
              @click="changeCountry(c.code)"
              class="flex items-center gap-2 w-full py-2 px-2 border-0 rounded-none text-teal-800 hover:bg-teal-100 hover:text-teal-800 "
            >
              <img :src="`/${c.flag}`" :alt="c.code" class="icon w-8" />
              {{ c.name }}
            </button>
          </div>
        </div>
      <select @change="changeCategory" v-model="selectedCategory" class="refresh-button capitalize">
        <option v-for="c in category" :key="c">{{ c }}</option>
      </select>
      <button class="refresh-button" type="button" :disabled="isLoading" @click="loadNews">
        <i class="ri-refresh-line" :class="{ spinning: isLoading }"></i>
        Refresh
      </button>
      </div>
    </section>

    <p v-if="error" class="notice">{{ error }}</p>

    <section class="news-list" aria-live="polite">
      <article v-for="article in articles" :key="article.id" class="news-item shadow-md rounded-md border border-stone-100">
        <img
          class="news-image"
          :src="article.image"
          :alt="article.title"
          @error="usePlaceholderImage"
        >
        <div class="news-content">
          <h2>{{ article.title }}</h2>
          <p class="description">{{ article.description }} - <a :href="article.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">more...</a></p>
          
          <footer class="meta">
            <span><i class="ri-user-line"></i>{{ article.author }}</span>
            <span><i class="ri-calendar-line"></i>{{ formatDate(article.date) }}</span>
          </footer>
        </div>
      </article>
    </section>

    <p v-if="isLoading" class="loading">Loading the latest news…</p>
    <p v-else-if="!articles.length" class="empty">No news is available right now.</p>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { newsApi } from '@/constants.js'

const placeholderImage = '/600x400.svg'
const isLoading = ref(false)
const error = ref('')
const open = ref(false)
const articles = ref([])
const country = [{code: 'in', name: 'India', flag: 'in.svg'}, {code: 'us', name: 'United States', flag: 'us.svg'}, {code: 'au', name: 'Australia', flag: 'au.svg'}, {code: 'ru', name: 'Russia', flag: 'ru.svg'}, {code: 'fr', name: 'France', flag: 'fr.svg'}, {code: 'gb', name: 'United Kingdom', flag: 'gb.svg'}]

const selectedCountry = ref(country[0])
const category = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
const selectedCategory = ref('general')

const fallbackArticles = [
  {
    id: 'fallback-1',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
    title: 'Today’s top stories, all in one place',
    description: 'Stay up to date with the latest developments from India and around the world.',
    author: 'News Desk',
    date: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80',
    title: 'A simple, readable way to follow the news',
    description: 'Browse concise headlines, context, and publication details without leaving the app.',
    author: 'Editorial Team',
    date: new Date().toISOString(),
  },
]

function normalizeArticle(article, index) {
  return {
    id: article.id || article.url || `${article.title}-${index}`,
    image: article.urlToImage || article.image || placeholderImage,
    title: article.title || 'Untitled story',
    description: article.description || 'No description is available for this story.',
    content: article.content || 'No content is available for this story.',
    author: article.author || 'News Desk',
    date: article.date || article.publishedAt || new Date().toISOString(),
    url: article.url || '#',
  }
}

function changeCountry(value) {
  selectedCountry.value = country.filter(c => c.code === value)[0]
  open.value = false
  console.info('selecteed', selectedCountry.value.code)
  loadNews()
}

function changeCategory(event) {
  selectedCategory.value = event.target.value
  loadNews()
}

async function loadNews() {
  isLoading.value = true
  error.value = ''

  try {
    
    const { data } = await axios.get(`${newsApi}top-headlines/category/${selectedCategory.value}/${selectedCountry.value.code}.json`)
    // const news = Array.isArray(data?.data) ? data.data : []
    // articles.value = news.map(normalizeArticle)
    articles.value = data.articles.map(normalizeArticle)

    if (!articles.value.length) {
      throw new Error('No articles returned')
    }
  } catch (requestError) {
    articles.value = fallbackArticles
    error.value = 'Live news is unavailable at the moment. Showing featured stories instead.'
  } finally {
    isLoading.value = false
  }
}

function formatDate(date) {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(parsedDate)
}

function usePlaceholderImage(event) {
  event.target.src = placeholderImage
}

onMounted(loadNews)
</script>

<style scoped>
.news-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

.news-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.eyebrow {
  margin: 0 0 .25rem;
  color: #0f766e;
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}

h1, h2, p { margin-top: 0; }
h1 { margin-bottom: .25rem; color: #0f172a; font-size: 2rem; font-weight: 700; }
.subtitle { margin-bottom: 0; color: #64748b; }

.refresh-button {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  border: 1px solid #0f766e;
  border-radius: .375rem;
  background: white;
  color: #0f766e;
  padding: .6rem .75rem;
  cursor: pointer;
}

.refresh-button:disabled { cursor: wait; opacity: .65; }
.spinning { animation: spin 1s linear infinite; }

.news-list { display: grid; gap: 1rem; }

.news-item {
  display: grid;
  grid-template-columns: 220px 1fr;
  overflow: hidden;
  /* border: 1px solid #e2e8f0; */
  /* border-radius: .75rem; */
  background: #fff;
  /* box-shadow: 0 2px 8px rgb(15 23 42 / 7%); */
}

.news-image { width: 100%; height: 100%; min-height: 170px; object-fit: cover; background: #f1f5f9; }
.news-content { padding: 1.1rem 1.2rem; }
h2 { color: #0f172a; font-size: 1.15rem; line-height: 1.35; }
.description { color: #475569; line-height: 1.55; }
.content { color: #475569; line-height: 1.55; margin-top: .5rem; }
.meta { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; color: #64748b; font-size: .875rem; }
.meta span { display: inline-flex; align-items: center; gap: .35rem; }
.notice, .loading, .empty { padding: .75rem 1rem; border-radius: .5rem; }
.notice { background: #fffbeb; color: #92400e; }
.loading, .empty { color: #64748b; text-align: center; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .news-header { align-items: start; flex-direction: column; }
  .news-item { grid-template-columns: 1fr; }
  .news-image { height: 200px; }
}
</style>
