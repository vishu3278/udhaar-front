<template>
    <div class="card h-full grid grid-cols-1 outline outline-4 outline-zinc-300 ">
        <div class="card-header p-4">
            <button class="absolute right-4 top-4 z-10 cursor-pointer" @click="$emit('close-panel')">x</button>
            <div class="card-title text-2xl font-semibold text-sky-700 pr-12">{{detail.title}}</div>
            <div class="card-subtitle text-lg text-sky-600 mb-4">Original title: {{detail.original_title}}</div>
            <!-- <figure class="avatar avatar-sm text-uppercase " :data-initial="detail.original_language"></figure> -->
            <div class="flex items-center justify-between">
                <div class="flex gap-4">
                    <span class="border border-amber-500 rounded-full px-2 h-6 text-amber-600">{{formattedDate(detail.release_date)}}</span>
                    <span class="border border-amber-500 text-amber-600 rounded-full size-6 text-center">{{detail.original_language}}</span>
                    <span class="border border-amber-400 text-amber-600 rounded-full px-2 h-6">{{detail.runtime}} min</span>
                </div>
                <div class="inline-flex items-center gap-2">
                    <div class="w-40 border  rounded-full overflow-clip" :class="`border-${avg.color}`" style="padding: 1px;">
                        <span class="inline-block bg-gradient-to-br text-white rounded-full" :class="avg.class" :style="{width: avg.percent+'%'}">&nbsp;</span>
                    </div>
                    <span class=" rounded-full border px-2" :class="[`border-${avg.color}`, `text-${avg.color}`]" title="Avg. vote">{{detail.vote_average}}</span>
                    <span class="rounded-full border px-2" :class="[`border-${avg.color}`, `text-${avg.color}`]" title="Votes">{{detail.vote_count}}</span>
                </div>
            </div>

        </div>
        <div class="overflow-auto">
            <figure v-if="detail.poster_path" class="card-image p-4">
                <img :src="img_uri+detail.poster_path" class="float-left mr-4">
                <p class="text-slate-700 text-base">
                    <span class="text-sky-600 font-bold">Overview:</span><br>
                    {{detail.overview}}
                </p>
            </figure>
            <hr class="clear-both">
            <!-- <figure v-if="detail.backdrop_path" class="">
                <img :src="img_uri+detail.backdrop_path" class="object-cover w-full h-96">
            </figure> -->
            <div class="card-body p-4 grid grid-cols-1 gap-y-2 text-base divide-y">
                <div class="">
                    <span class="text-slate-500">Genres: </span>
                    <span v-for="g in detail.genres" :key="g.id" class="border border-sky-400 rounded-full px-2 text-sky-600 ml-1">{{g.name}}</span>
                </div>
                <div class="">
                    <span class="text-slate-500">Country of origin: </span>
                    <span v-for="c in detail.origin_country" class="text-sky-600">{{c}}</span>
                </div>
                <div class="">
                    <span class="text-slate-500">Spoken language: </span>
                    <span v-for="l in detail.spoken_languages" class="text-sky-600">{{l.english_name}} - {{l.name}}, </span>
                </div>
                <!-- cast -->
                <div v-if="detail.credits.cast.length > 0">
                    <h6 class="text-slate-500 font-semibold">Cast</h6>
                    <div class="flex gap-4 overflow-x-auto py-1">
                        <figure v-for="cast in detail.credits.cast" :key="cast.id" class="text-sky-600 w-40 shrink-0 bg-sky-100 text-center shadow">
                            <img v-if="cast.profile_path" :src="profile_uri+cast.profile_path" :alt="cast.name">
                            <img v-else src="/400x600.svg" :alt="cast.name">
                            <figcaption class="font-semibold">{{cast.name}}</figcaption>
                            <figcaption class="text-slate-500">({{cast.character}})</figcaption>
                        </figure>
                    </div>
                </div>
                <!-- crew -->
                <div v-if="detail.credits.crew.length > 0">
                    <h6 class="text-slate-500 font-semibold">Crew</h6>
                    <div class="flex gap-4 overflow-x-auto py-1">
                        <figure v-for="crew in detail.credits.crew" :key="crew.id" class="text-sky-600 w-36 shrink-0 bg-sky-100 text-center shadow">
                            <img v-if="crew.profile_path" :src="profile_uri+crew.profile_path" :alt="crew.name">
                            <img v-else src="/400x600.svg" :alt="crew.name">
                            <figcaption class="font-semibold">{{crew.name}}</figcaption>
                            <figcaption class="text-slate-600">{{crew.job}}</figcaption>
                            <figcaption class="text-slate-400">{{crew.department}}</figcaption>
                        </figure>
                    </div>
                </div>
                <div v-if="detail.production_companies.length > 0" >
                    <h6 class="text-slate-500 font-semibold">Production companies </h6>
                    <div class="flex gap-4 overflow-x-auto py-1">
                        <figure v-for="c in detail.production_companies" :key="c.id" class="text-sky-600 border flex flex-col justify-between border-sky-200 shrink-0 w-40 text-center">
                            <img v-if="c.logo_path" :src="logo_uri+c.logo_path" :alt="c.name">
                            <img v-else src="/600x400.svg" :alt="c.name">
                            <figcaption>{{c.name}}</figcaption>
                        </figure>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <p v-show="posters.length > 0" class="text-base text-slate-500 font-bold">Posters</p>
                <div class="images flex gap-2 overflow-x-auto mb-3" >
                    <img v-for="im in posters" :src="img_uri+im.file_path" class="w-48 h-64 object-contain" alt="">
                </div>
                <p v-show="backdrops.length > 0" class="text-base text-slate-500 font-bold">Backdrops</p>
                <div class="images flex gap-2 overflow-x-auto mb-3">
                    <img v-for="im in backdrops" :src="img_uri+im.file_path" class="w-96 h-56 object-contain" alt="">
                </div>
                <p v-show="logos.length > 0" class="text-base text-slate-500 font-bold">Logos</p>
                <div class="images flex gap-2 overflow-x-auto mb-3">
                    <img v-for="im in logos" :src="img_uri+im.file_path" class="w-36 h-36 object-contain bg-slate-200" alt="">
                </div>
            </div>
        </div>
        <!-- <div class="card-footer">
            <button class="btn btn-sm btn-primary">More</button>
        </div> -->
    </div>
</template>
<script>
import { api_key, base_uri, img_uri, logo_uri, profile_uri, no_profile, no_img, date_format } from '@/constants.js'
import axios from 'axios'
import { format } from "date-fns";
/*const no_profile ="@/assets/400x600.svg"
const no_img ="@/assets/600x400.svg"*/
export default {

    name: 'MovieDetail',
    props: {
        detail: { type: Object }
    },
    data() {
        return {
            img_uri,
            logo_uri,
            profile_uri,
            no_profile,
            no_img,
            date_format,
            movie: {
                "adult": false,
                "backdrop_path": "/4VFRn5xcD8o3qUMrSShm3I6zpfl.jpg",
                "belongs_to_collection": { "id": 148065, "name": "Doraemon Movies", "poster_path": "/4TLSP1KD1uAlp2q1rTrc6SFlktX.jpg", "backdrop_path": "/rc6OFcSasL5YxBRPUQVwxmVF6h5.jpg" },
                "budget": 0,
                "genres": [{ "id": 16, "name": "Animation" }, { "id": 12, "name": "Adventure" }, { "id": 10751, "name": "Family" }],
                "homepage": "http://doraeiga.com/2009/",
                "id": 95935,
                "imdb_id": "tt1264885",
                "origin_country": ["JP"],
                "original_language": "ja",
                "original_title": "映画ドラえもん 新・のび太の宇宙開拓史",
                "overview": "While Nobita is sleeping, he suddenly feels the floor is trembling, like there would be an earthquake in his room. A little rabbit from an alternate universe named Chamii opens the door between the dimensions using a hammer and gets inside Nobita's room through the floor. Nobita wakes up and Doraemon hears somebody steal food from the fridge in the kitchen. It is Chamii, who gets caught by Doraemon and Nobita. She shows them the passageway through Nobita's floor into the spaceship. After they enter the spaceship, they see Koya Koya Planet. They meet a boy named Roppuru.",
                "popularity": 12.566,
                "poster_path": "/6F5mriTD7HrVSJf7o0BrAedw5LX.jpg",
                "production_companies": [{ "id": 5141, "logo_path": "/fK2QKfHdSdw42Xx4MiD7KhDufBV.png", "name": "Shin-Ei Animation", "origin_country": "JP" }],
                "production_countries": [{ "iso_3166_1": "JP", "name": "Japan" }],
                "release_date": "2009-03-07",
                "revenue": 25400000,
                "runtime": 102,
                "spoken_languages": [{ "english_name": "Japanese", "iso_639_1": "ja", "name": "日本語" }],
                "status": "Released",
                "tagline": "",
                "title": "Doraemon: The New Record of Nobita's Spaceblazer",
                "video": false,
                "vote_average": 6.9,
                "vote_count": 41
            },
            movie2: {},
            movie1: {},
        }
    },
    computed: {
        /*images() {
            if (this.detail?.id) {
                this.fetchImages()
            }
            return true
        }*/
        avg(){
            let percent = (this.detail.vote_average/10)*100

            if(this.detail.vote_average > 0.1 && this.detail.vote_average < 2.9){
                return {class: 'from-fuchsia-300 to-fuchsia-600', color: "fuchsia-600", percent }
            }
            if(this.detail.vote_average > 3 && this.detail.vote_average < 4.6){
                return {class: 'from-rose-300 to-rose-600', color: "rose-600", percent }
            }
            if(this.detail.vote_average > 4.5 && this.detail.vote_average < 6.1){
                return {class: 'from-amber-300 to-amber-600', color: "amber-600", percent }
            }
            if(this.detail.vote_average > 6 && this.detail.vote_average < 7.6){
                return {class: 'from-sky-300 to-sky-600', color: "sky-600", percent }
            }
            if(this.detail.vote_average > 7.5 && this.detail.vote_average < 8.9){
                return {class: 'from-teal-300 to-teal-600', color: "teal-600", percent }
            }
            if(this.detail.vote_average > 8.8 ){
                return {class: 'from-green-300 to-green-600', color: "green-600", percent }
            }
            return { class: 'from-zinc-300 to-zinc-600', color: "zinc-600", percent: 0}
        },
        posters(){
            return this.detail?.images.posters
            },
        logos(){
            return this.detail?.images.logos
        },
        backdrops(){
            return this.detail?.images.backdrops
        },
    },
    mounted() {
        const scrollContainer = document.querySelectorAll(".overflow-x-auto");
        // console.log(scrollContainer)
        for(let x of scrollContainer){
            // console.log(x)
            x.addEventListener("wheel", (evt) => {
                evt.preventDefault();
                x.scrollLeft += evt.deltaY;
            });
        }

    },
    methods: {
        /*fetchImages(){
            axios.get(`${base_uri}/movie/${this.detail.id}/images?api_key=${api_key}`)
                .then(response => {
                    // console.log(response.data)
                    this.posters = response.data.posters
                    this.logos = response.data.logos
                    this.backdrops = response.data.backdrops
                })
                .catch(err => console.error(err));

        },*/
        formattedDate(datestring){
            if(datestring){
                return format(new Date(datestring), this.date_format)
            } else {
                return "No date"
            }
        }
        
    }

}
</script>
<style lang="css" scoped>
</style>