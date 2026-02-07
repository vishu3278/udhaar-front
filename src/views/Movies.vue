<template>
    <section class="bg-secondary p-2 mb-3">
        <h3 class="text-center text-sky-800 font-bold">Movies</h3>
        <div class="flex items-center gap-1">
            <div class="search-wrapper">
                <div class="input-group flex  items-center gap-2">
                    <span class="">Search by </span>
                    <label><input type="radio" name="param" value="movie" v-model="queryType" checked> Title</label>
                    <label><input type="radio" name="param" value="keyword" v-model="queryType"> Keyword</label>
                    <input type="search" class="form-input flex-grow" v-model="query" placeholder="...">
                    <label><input type="checkbox" v-model="adult"> Adult</label>
                    <button class="btn btn-primary " @click="searchMovie">Search</button>
                </div>
            </div>
            <div class="account-info inline-flex items-center gap-2">
                <img src="/no-profile.jpeg" class="w-10 h-10 rounded-full" alt="avatar"> <span>Name</span> <span>(Username)</span>
            </div>
            <!-- <div class="flex align-center flex-wrap gap-2 mt-2">
                <h5>Genres</h5>
                <button v-for="g in genres" :key="g.id" class="btn-sm">{{g.name}}</button>
            </div> -->
            <!-- <router-link to="/addinvoice" class="btn btn-primary btn-sm "><i class="ri-add-line"></i> Add</router-link> -->
        </div>
    </section>
    <div class="px-10 transition" :class="{'side-panel-open': sidePanel}">
        
        <h5 class="font-bold text-sky-800">Popular</h5>
        <section id="movieScroll" class="flex gap-5 overflow-auto mb-5">
            <movie-card-small v-for="p in popular" :key="p.id" :movie="p" @show-detail="showDetail">
            </movie-card-small>
        </section>
        <h5 v-if="movies.results" class="text-center text-lg font-light text-sky-600"><span class="font-bold">{{movies.total_results}}</span> results found for "{{query}}"</h5><br>
        <div id="movieWrapper" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 row-auto">
            <div v-for="m in movies.results" class=" ">
                <movie-card :movie="m" @show-detail="showDetail"></movie-card>
                <!-- <div v-if="queryType == 'keyword'" class="shadow">{{m.id}} - {{m.name}} <br><button class="btn btn-sm" @click="showDetail(m)">detail</button></div> -->
            </div>
        </div>
        <div v-show="movies.total_results == 0" class="empty rounded-md bg-gradient-to-br from-orange-100 to-orange-200 p-2 shadow-md max-w-fit text-center mx-auto my-4">
            <div class="empty-icon text-orange-300">
                <i class="ri-movie-2-line text-5xl "></i>
                <!-- <i class="icon icon-people"></i> -->
            </div>
            <p class="empty-title text-xl font-bold text-orange-400 ">No movies to show</p>
            <p class="empty-subtitle text-base">Search for a movie by entering keyword and click the Search button.</p>
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
        <h5 class="font-bold text-sky-800">Top Rated</h5>
        <section id="movieScroll" class="flex gap-5 overflow-auto mb-5">
            <movie-card-small v-for="p in toprated" :key="p.id" :movie="p" @show-detail="showDetail">
            </movie-card-small>
        </section>
    </div>
    <article v-if="sidePanel" class="side-panel fixed bg-gradient-to-br to-sky-100 from-yellow-50 inset-y-0 right-0 z-30 shadow" v-click-outside="onClickOutside">
        <movie-detail :detail="detail" @close-panel="sidePanel = false"></movie-detail>
    </article>
</template>
<script>
// import { getInvoices, getCompanies } from "@/firebase.js"
// import { format, formatDistanceToNow, compareAsc } from 'date-fns'
import MovieCardSmall from "@/components/movie/MovieCardSmall.vue"
import MovieCard from "@/components/movie/MovieCard.vue"
import MovieDetail from "@/components/movie/MovieDetail.vue"
// import AddCompanyForm from '@/components/AddCompanyForm.vue'
// import * as echarts from 'echarts';
import { api_key, base_uri, img_uri, profile_uri, no_profile } from '@/constants.js'
import axios from 'axios'
import vClickOutside from 'click-outside-vue3'
export default {

    name: 'MoviesView',
    components: {
        MovieCardSmall,
        MovieCard,
        MovieDetail,
        // AddCompanyForm,
    },
    directives: {
      clickOutside: vClickOutside.directive
    },
    data() {
        return {
            img_uri,
            no_profile,
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
            toprated: [],
        }
    },

    mounted() {
        // console.log('mounted')
        /*axios.get(`${base_uri}/genre/movie/list?api_key=${api_key}`).then(res => {
            // console.log(res.data)
            this.genres = res.data.genres
        })*/

        axios.get(`${base_uri}/movie/popular?api_key=${api_key}`)
            .then(res => {
                // console.log(res.data)
                this.popular = res.data.results
            })
            .catch(err => console.error(err));

        const scrollContainer = document.getElementById("movieScroll");

        scrollContainer.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY;
        });

        const options = {method: 'GET', headers: {accept: 'application/json'}};

        axios.get(`${base_uri}/movie/top_rated?api_key=${api_key}&page=1`)
            .then(res => this.toprated = res.data.results)
            .catch(err => console.error(err))
            .then(() => console.log("always"))

    },
    methods: {
        onClickOutside(event){
            // console.log(event)
            this.sidePanel = false
        },
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
                // axios.get(`${base_uri}/search/${this.queryType}?api_key=${api_key}&query=${this.query}&page=${this.page}`)
                axios.get(`${base_uri}/discover/movie?api_key=${api_key}&include_adult=${this.adult}&page=${this.page}&with_keywords=${this.query}`)
                    .then(movies => {
                        // console.log(movies)
                        this.movies = movies.data
                    })
                    .catch(e => console.warn(e))
            }
        },
        showDetail(movie) {
            // console.log(movie)
            axios.get(`${base_uri}/movie/${movie.id}?api_key=${api_key}&append_to_response=credits,images,videos,keywords`)
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
    width: 560px;
    &-open {
        padding-right: 600px;
    }
}
</style>