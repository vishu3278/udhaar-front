<template>
    <div class="card h-full grid grid-cols-1">
        <div class="card-header p-4">
            <button class="absolute right-4 top-4 z-10 cursor-pointer" @click="$emit('close-panel')">x</button>
            <div class="card-title text-2xl font-semibold text-sky-700 pr-12">{{detail.title}}</div>
            <div class="card-subtitle text-lg text-sky-600 mb-4">Original title: {{detail.original_title}}</div>
            <!-- <figure class="avatar avatar-sm text-uppercase " :data-initial="detail.original_language"></figure> -->
            <div class="flex gap-4">
                <span class="border border-amber-500 rounded-full px-2 h-6 text-amber-600">{{detail.release_date}}</span>
                <span class="border border-amber-500 text-amber-600 rounded-full size-6 text-center">{{detail.original_language}}</span>
                <span class="border border-amber-400 text-amber-600 rounded-full px-2 h-6">{{detail.runtime}} min</span>
            </div>
        </div>
        <div class="overflow-auto">
            <figure v-if="detail.poster_path" class="card-image p-4">
                <img :src="img_uri+detail.poster_path" class="">
            </figure>
            <figure v-if="detail.backdrop_path" class="">
                <img :src="img_uri+detail.backdrop_path" class="object-cover w-full h-96">
            </figure>
            <div class="card-body p-4 grid grid-cols-1 gap-y-2 text-base divide-y">
                <div class="">
                    <span class="text-slate-500">Genres: </span>
                    <span v-for="g in detail.genres" :key="g.id" class="border border-indigo-300 rounded-full px-2 text-indigo-500 ml-1">{{g.name}}</span>
                </div>
                <div class="">
                    <span class="text-slate-500">Country of origin: </span>
                    <span v-for="c in detail.origin_country" class="text-indigo-500">{{c}}</span>
                </div>
                <div class="">
                    <span class="text-slate-500">Production companies: </span>
                    <div v-for="c in detail.production_companies" :key="c.id" class="text-indigo-500 border border-indigo-300 rounded px-2 py-1 mt-1"><img :src="logo_uri+c.logo_path" alt=""> {{c.name}} </div>
                </div>
                <div class="">
                    <span class="text-slate-500">Spoken language: </span>
                    <span v-for="l in detail.spoken_languages" class="text-slate-700">{{l.english_name}} - {{l.name}}, </span>
                </div>
                <p class="text-slate-700">
                    <span class="text-slate-500">Overview:</span><br>
                    {{detail.overview}}
                </p>
            </div>
            <p v-show="posters.length > 0" class="text-base text-slate-500 font-semibold">Posters</p>
            <div class="images flex gap-2 overflow-x-auto mb-3" >
                <img v-for="im in posters" :src="img_uri+im.file_path" class="w-48 h-64 object-contain" alt="">
            </div>
            <p v-show="backdrops.length > 0" class="text-base text-slate-500 font-semibold">Backdrops</p>
            <div class="images flex gap-2 overflow-x-auto mb-3">
                <img v-for="im in backdrops" :src="img_uri+im.file_path" class="w-96 h-56 object-contain" alt="">
            </div>
            <p v-show="logos.length > 0" class="text-base text-slate-500 font-semibold">Logos</p>
            <div class="images flex gap-2 overflow-x-auto mb-3">
                <img v-for="im in logos" :src="img_uri+im.file_path" class="w-48 h-48 object-contain bg-slate-200" alt="">
            </div>
        </div>
        <!-- <div class="card-footer">
            <button class="btn btn-sm btn-primary">More</button>
        </div> -->
    </div>
</template>
<script>
import { api_key, base_uri, img_uri, logo_uri, profile_uri } from '@/constants.js'
import axios from 'axios'
export default {

    name: 'MovieDetail',
    props: {
        detail: { type: Object }
    },
    data() {
        return {
            img_uri,
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
            movie2: {
                "adult": false,
                "backdrop_path": "/j6yFkB8dO9dWHdZzVDK4yRbBo6W.jpg",
                "belongs_to_collection": null,
                "budget": 0,
                "genres": [{
                        "id": 16,
                        "name": "Animation"
                    },
                    {
                        "id": 35,
                        "name": "Comedy"
                    }
                ],
                "homepage": "",
                "id": 234328,
                "imdb_id": "tt0060557",
                "origin_country": [
                    "US"
                ],
                "original_language": "en",
                "original_title": "Jerry, Jerry, Quite Contrary",
                "overview": "Jerry keeps sleepwalking and doing things unknowingly to Tom. He becomes aware of this and tries to stay awake.",
                "popularity": 2.334,
                "poster_path": "/ehs1bN08gQihkLNKt7vbp3OXqHQ.jpg",
                "production_companies": [],
                "production_countries": [{
                    "iso_3166_1": "US",
                    "name": "United States of America"
                }],
                "release_date": "1966-02-17",
                "revenue": 0,
                "runtime": 7,
                "spoken_languages": [{
                    "english_name": "No Language",
                    "iso_639_1": "xx",
                    "name": "No Language"
                }],
                "status": "Released",
                "tagline": "",
                "title": "Jerry, Jerry, Quite Contrary",
                "video": false,
                "vote_average": 6.1,
                "vote_count": 20
            },
            movie1: {
                "adult": false,
                "backdrop_path": "/mQ4lYhaLZPoqI1xrn82XsHNQECd.jpg",
                "belongs_to_collection": null,
                "budget": 10000000,
                "genres": [{
                        "id": 18,
                        "name": "Drama"
                    },
                    {
                        "id": 80,
                        "name": "Crime"
                    }
                ],
                "homepage": "http://www.bacfilms.com/site/nipournicontre/",
                "id": 11958,
                "imdb_id": "tt0298082",
                "origin_country": [
                    "FR"
                ],
                "original_language": "fr",
                "original_title": "Ni pour, ni contre (bien au contraire)",
                "overview": "\"Ni Pour, Ni Contre\" tracks the fall of a young TV camerawoman, Caty, after she becomes involved with a group of petty criminals and their enigmatic leader, Jean. The gang lives hand-to-mouth until the day Jean plans a daring bank robbery. Although other gang members feel out of their league, Jean persuades them to take part and Caty finds herself in a hellish world of betrayal, violence and murder.",
                "popularity": 16.09,
                "poster_path": "/rgd2DStNLE8zblUPJcez6r3Y3b5.jpg",
                "production_companies": [{
                        "id": 2756,
                        "logo_path": null,
                        "name": "Vertigo Productions",
                        "origin_country": "FR"
                    },
                    {
                        "id": 1115,
                        "logo_path": "/ntH7T5gsN6wtyrfHGHJDTuneQ7o.png",
                        "name": "M6 Films",
                        "origin_country": "FR"
                    },
                    {
                        "id": 10572,
                        "logo_path": null,
                        "name": "Ce Qui Me Meut Motion Pictures",
                        "origin_country": "FR"
                    },
                    {
                        "id": 6586,
                        "logo_path": null,
                        "name": "TPS Star",
                        "origin_country": "FR"
                    },
                    {
                        "id": 11261,
                        "logo_path": "/g7p4vSwqsIo6zYptyN3hoDxFp7y.png",
                        "name": "M6",
                        "origin_country": "FR"
                    }
                ],
                "production_countries": [{
                    "iso_3166_1": "FR",
                    "name": "France"
                }],
                "release_date": "2003-03-05",
                "revenue": 0,
                "runtime": 111,
                "spoken_languages": [{
                        "english_name": "French",
                        "iso_639_1": "fr",
                        "name": "Français"
                    },
                    {
                        "english_name": "English",
                        "iso_639_1": "en",
                        "name": "English"
                    }
                ],
                "status": "Released",
                "tagline": "The wrong path is often the best.",
                "title": "Not For, or Against (Quite the Contrary)",
                "video": false,
                "vote_average": 6,
                "vote_count": 65
            },
        }
    },
    computed: {
        /*images() {
            if (this.detail?.id) {
                this.fetchImages()
            }
            return true
        }*/
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
        // const scrollContainer = document.querySelector("overflow-x-auto");

    },
    methods: {
        fetchImages(){
            axios.get(`${base_uri}/movie/${this.detail.id}/images?api_key=${api_key}`)
                .then(response => {
                    // console.log(response.data)
                    this.posters = response.data.posters
                    this.logos = response.data.logos
                    this.backdrops = response.data.backdrops
                })
                .catch(err => console.error(err));

        },
        /*hscroll(scrollContainer){
            scrollContainer.addEventListener("wheel", (evt) => {
                evt.preventDefault();
                scrollContainer.scrollLeft += evt.deltaY;
            });

        },*/
    }

}
</script>
<style lang="css" scoped>
</style>