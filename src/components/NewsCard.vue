<template>
    <div class="card ">
        <!-- <h4>News card</h4> -->
        <div v-if="joke.length > 0 || jokes.length > 0">
            <h4 class="font-bold">
                <span class="text-3xl align-middle">&#x1F606;</span>
                Random Joke</h4>
            <template v-if="joke.length > 0">
                <!-- <div v-for="j of joke" class="bg-gradient-to-br from-slate-100 to-slate-300 p-2 my-6 rounded relative">
                    <span class="rounded-t-md bg-gradient-to-b from-slate-300 to-slate-100 px-2 text-slate-600 absolute -top-3 left-0">{{j.type}}</span>
                    <p class="text-teal-700 text-xl font-bold"> {{j.setup}}</p>
                    <p class="text-emerald-600 text-lg font-medium ">{{j.punchline}}</p>
                </div> -->
                <div class="bg-gradient-to-br from-slate-100 to-slate-300 p-2 my-6 rounded relative">
                    <span class="rounded-t-md bg-gradient-to-b from-slate-300 to-slate-100 px-2 text-slate-600 absolute -top-3 left-0">{{joke[0].type}}</span>
                    <a href="https://git.io/typing-svg"><img :src="typingText" alt="Typing SVG" /></a>
                </div>
            </template>
            <template v-if="jokes.length > 0">
                <div v-for="jk of jokes" class="bg-gradient-to-br from-slate-100 to-slate-300 p-2 my-6 rounded relative">
                    <span class="rounded-t-md bg-gradient-to-b from-slate-300 to-slate-100 px-2 text-slate-600 absolute -top-3 left-0">{{jk.category}}</span>
                    <p class="text-teal-700 text-xl font-bold"> {{jk.setup}}</p>
                    <p class="text-emerald-600 text-lg font-medium ">{{jk.delivery}}</p>
                </div>
            </template>
        </div>
        <!-- 
        <div class="card-image">
            <img v-if="news.poster_path" :src="img_uri+news.poster_path" class="img-responsive">
            <img v-else-if="news.backdrop_path" :src="img_uri+news.backdrop_path" class="img-responsive">
            <img v-else src="https://placehold.co/300x440/9ab/ddd?text=No+Poster" class="img-responsive" alt="">
        </div>
        <div class="card-header py-1 px-2">
            <div class="card-title text-lg font-semibold leading-6 text-sky-600">{{news.title || news.name}} <small v-show="news.adult" class="font-semibold  inline-block bg-rose-400 rounded-full text-center text-white size-5 leading-5 ml-4">A</small></div>
            <div class="card-subtitle font-medium text-sky-600">{{news.original_title}}</div>
            <figure class="avatar avatar-sm text-uppercase " :data-initial="news.original_language" ></figure>
            <span class="border border-amber-500 rounded-full inline-block px-2 h-6 mr-4 text-amber-600">{{humanDate(news.release_date)}}</span> <span class="border border-amber-500 text-amber-600 text-center rounded-full inline-block size-6">{{news.original_language}}</span><br>
            <span class="text-rose-500 mr-4">Avg. Vote: {{news.vote_average}}</span> <span class="text-rose-400">Popularity: {{movie.popularity}}</span>
        </div>
        <div class="card-body text-base px-2">
            <p class="line-clamp-6">{{news.overview}}</p>
        </div>
        <div class="card-footer ">
            <button class="btn btn-primary w-full" @click="$emit('show-detail', this.news)">More</button>
        </div>
     -->
    </div>
</template>
<script>
import axios from 'axios'
import { newsApi, jokeApi, jokeApi2, date_format, typingApi } from '@/constants.js'
import { format } from 'date-fns'
export default {

    name: 'NewsCard',
    /*props: {
        news: { type: Object }
    },*/
    data() {
        return {
            newsApi,
            news: {},
            date_format,
            j1: {
                setup: "",
                punchline: ""
            },
            joke: [],
            jokes: [],
            typingApi,
            option: "font=Nunito+Sans&weight=700&size=22&pause=1000&color=0f766e&center=false&vCenter=true&width=720&height=84&multiline=true&lines=",
        }
    },
    computed: {
      typingText () {
        this.j1.setup = encodeURI(this.joke[0].setup).replaceAll("%20", "+");
        this.j1.punchline = encodeURI(this.joke[0].punchline).replaceAll("%20", "+");
        return this.typingApi + this.option + this.j1.setup + ";" + this.j1.punchline;
      }
    },
    mounted() {
        console.log("news card mounted ")
        /*This API supports category wise news. Here is a complete list of all categories.

        all
        national //Indian News only
        business
        sports
        world
        politics
        technology
        startup
        entertainment
        miscellaneous
        hatke
        science
        automobile*/

        /*const n = axios.get(`${newsApi}news?category=science`).then(ne => {
            console.info(n);
        })*/

        setInterval(() => {
            this.getRandomJoke()
        }, 60000)

        // joke api 2
        /*Any? or Programming,Miscellaneous,Dark,Pun,Spooky,Christmas?
        blacklistFlags=nsfw,religious,political,racist,sexist,explicit
        &type=twopart
        &contains=dumb
        &amount=2*/

        // sample
        // https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart&contains=tits&amount=2

        const j2 = axios.get(`${jokeApi2}Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart&amount=3`).then(jo2 => {
            // console.info(jo2)
            if (jo2.status == 200) {
                this.jokes = jo2.data.jokes
            }
        })
    },
    methods: {
        humanDate(d) {
            if (d) {
                return format(new Date(d), this.date_format)
            } else {
                return "No date"
            }
        },
        getRandomJoke(){
            // joke api 1
            // Try /random_joke, /random_ten, /jokes/random, or /jokes/ten , /jokes/random/
            axios.get(`${jokeApi}jokes/random`).then(jo => {
                // console.info(jo)
                if (jo.status == 200) {
                    this.joke[0] = jo.data
                }
            })
        },
    }
}
</script>
<style lang="css" scoped>
</style>