<template>
    <section class="bg-secondary p-2 mb-3">
        <div class="d-flex align-center gap-1">
            <h3 class="text-center text-sky-800 font-bold">Movies</h3>
            <div class="search-wrapper">
                <div class="input-group flex  items-center gap-2">
                    <span class="">Search by </span>
                    <label><input type="radio" name="param" value="movie" v-model="queryType" checked> Title</label>
                    <label><input type="radio" name="param" value="keyword" v-model="queryType"> Keyword</label>
                    <input type="search" class="form-input flex-grow" v-model="query" placeholder="...">
                    <label v-show="queryType=='movie'"><input type="checkbox" v-model="adult"> Adult</label>
                    <button class="btn btn-primary " @click="searchMovie">Search</button>
                </div>
            </div>
            <!-- <div class="flex align-center flex-wrap gap-2 mt-2">
                <h5>Genres</h5>
                <button v-for="g in genres" :key="g.id" class="btn-sm">{{g.name}}</button>
            </div> -->
            <!-- <router-link to="/addinvoice" class="btn btn-primary btn-sm "><i class="ri-add-line"></i> Add</router-link> -->
        </div>
    </section>
    <div class="container">
        <!-- <div class="search-wrapper">
            <div class="input-group">
                <span class="input-group-addon">Search</span>
                <input type="text" class="form-input" v-model="query" placeholder="...">
                <button class="btn btn-primary input-group-btn" @click="searchMovie">Search</button>
            </div>
        </div> -->
        <h5 class="font-bold text-sky-800">Popular</h5>
        <section id="movieScroll" class="flex gap-5 overflow-auto mb-5">
            <movie-card-small v-for="p in popular" :key="p.id" :movie="p" @show-detail="showDetail">
            </movie-card-small>
        </section>
        <h5 v-if="movies.results" class="text-center text-lg font-light text-sky-600"><span class="font-bold">{{movies.total_results}}</span> results found for "{{query}}"</h5><br>
        <div id="movieWrapper" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 row-auto">
            <div v-for="m in movies.results" class=" ">
                <movie-card v-if="queryType == 'movie'" :movie="m" @show-detail="showDetail"></movie-card>
                <div v-if="queryType == 'keyword'" class="shadow">{{m.id}} - {{m.name}} <br><button class="btn btn-sm" @click="showDetail(m)">detail</button></div>
            </div>
        </div>
        <div v-show="movies.total_results == 0" class="empty">
            <div class="empty-icon">
                <i class="ri-movie-2-line ri-5x"></i>
                <!-- <i class="icon icon-people"></i> -->
            </div>
            <p class="empty-title h4 text-error">No movies to show</p>
            <p class="empty-subtitle">Search for a movie by entering keyword and click the Search button.</p>
            <!-- <div class="empty-action">
                <button class="btn btn-primary">Send a message</button>
            </div> -->
        </div>
        <hr>
        <ul class="flex items-center justify-center flex-wrap gap-1 my-5">
            <!-- <li class="page-item disabled">
                <a href="#" tabindex="-1">Previous</a>
            </li> -->
            <li v-for="n in movies.total_pages">
                <a class="py-1 px-2 border border-sky-600 rounded-md inline-block min-w-6 cursor-pointer hover:bg-sky-200 hover:text-sky-600" :class="{'text-white bg-sky-400 font-bold': n == movies.page}" @click.stop="searchPage(n)">{{n}}</a>
            </li>
            <!-- <li class="page-item active">
                <a href="#">1</a>
            </li>
            <li class="page-item">
                <a href="#">12</a>
            </li> -->
            <!-- <li class="page-item">
                <a href="#">Next</a>
            </li> -->
        </ul>
        <hr>
    </div>
    <article v-if="sidePanel" class="side-panel fixed bg-gradient-to-br to-sky-100 from-yellow-50 inset-y-0 right-0 z-10 shadow">
        <movie-detail :detail="detail" @close-panel="sidePanel = false"></movie-detail>
    </article>
</template>
<script>
// import { getInvoices, getCompanies } from "@/firebase.js"
import { format, formatDistanceToNow, compareAsc } from 'date-fns'
import MovieCardSmall from "@/components/movie/MovieCardSmall.vue"
import MovieCard from "@/components/movie/MovieCard.vue"
import MovieDetail from "@/components/movie/MovieDetail.vue"
// import AddCompanyForm from '@/components/AddCompanyForm.vue'
// import * as echarts from 'echarts';
import { api_key, base_uri, img_uri, profile_uri } from '@/constants.js'
import axios from 'axios'
export default {

    name: 'MoviesView',
    components: {
        MovieCardSmall,
        MovieCard,
        MovieDetail,
        // AddCompanyForm,
    },
    data() {
        return {
            img_uri,
            queryType: "movie",
            movies: [],
            query: "",
            page: 1,
            adult: false,
            editCompany: null,
            msg: "",
            balance: 0,
            totalDebit: 0,
            totalCredit: 0,
            activeInvoice: null,
            detail: null,
            sidePanel: false,
            // genres: [],
            popular: [],
        }
    },

    mounted() {
        // console.log('mounted')
        /*axios.get(`${base_uri}/genre/movie/list?api_key=${api_key}`).then(res => {
            // console.log(res.data)
            this.genres = res.data.genres
        })*/

        axios.get(`${base_uri}/movie/popular?api_key=${api_key}`).then(res => {
            // console.log(res.data)
            this.popular = res.data.results
        })

        const scrollContainer = document.getElementById("movieScroll");

        scrollContainer.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY;
        });

    },
    methods: {

        closeModal() {
            this.msg = null
        },
        autocloseModal(duration = 3500) {
            setTimeout(() => {
                this.msg = null
            }, duration)
        },

        searchMovie() {
            // url: `${base_uri}/search/movie?api_key=${api_key}&query=${q}`,
            if (this.queryType == "movie") {
                axios.get(`${base_uri}/search/${this.queryType}?api_key=${api_key}&include_adult=${this.adult}&query=${this.query}&page=${this.page}`)
                    .then(movies => {
                        this.movies = movies.data
                    })
                    .catch(e => console.warn(e))
            }

            if (this.queryType == "keyword") {
                axios.get(`${base_uri}/search/${this.queryType}?api_key=${api_key}&query=${this.query}&page=${this.page}`)
                    .then(movies => {
                        this.movies = movies.data
                    })
                    .catch(e => console.warn(e))
            }
        },
        showDetail(movie) {
            // console.log(movie)
            axios.get(`${base_uri}/movie/${movie.id}?api_key=${api_key}&append_to_response=credits,images`)
                .then(response => {
                    // console.log(response)
                    this.detail = response.data
                    this.sidePanel = true
                })
                .catch(err => console.error(err));
        },
        searchPage(page) {
            this.page = page
            // console.log(page)
            const elm = document.getElementById("movieWrapper")
            // console.log(elm.offsetTop)
            window.scrollTo({ top: elm.offsetTop, left: 0, behavior: 'smooth' })
            this.searchMovie()
        }
    }
}
</script>
<style lang="scss" scoped>
.search-wrapper {
    margin-block: 0.1rem;
    margin-inline: auto;
    max-width: 40rem;
}

.side-panel {
    width: 33vw;
    min-width: 560px;
}
</style>