<template>
    <div class="card h-full grid grid-cols-1 outline outline-4 outline-zinc-300 " >
        <div class="card-header p-4 ">
            <button class="absolute right-4 top-4 z-10 cursor-pointer" @click="$emit('close-panel')">x</button>
            <div class="card-title text-2xl font-semibold text-sky-700 pr-12">{{detail.title}}
            </div>
            <p class="text-sky-600">{{detail.tagline}}</p>
            <div class="card-subtitle text-lg text-sky-600 mb-4">Original title: {{detail.original_title}}</div>
            <!-- <figure class="avatar avatar-sm text-uppercase " :data-initial="detail.original_language"></figure> -->
            <div class="flex items-center justify-between">
                <div class="flex gap-4">
                    <span class="border border-amber-500 rounded-full px-2 h-6 text-amber-600">{{formattedDate(detail.release_date)}}</span>
                    <span class="border border-amber-500 text-amber-600 rounded-full size-6 text-center">{{detail.original_language}}</span>
                    <span class="border border-amber-400 text-amber-600 rounded-full px-2 h-6">{{detail.runtime}} min</span>
                </div>
                <div class="inline-flex items-center gap-2">
                    <div class="w-40 border rounded-full overflow-clip" :class="`border-${avg.color}`" style="padding: 1px;">
                        <span class="inline-block bg-gradient-to-br text-white rounded-full transition-all duration-500 delay-500" :class="avg.class" :style="{width: avg.percent+'%'}">&nbsp;</span>
                    </div>
                    <span class=" rounded-full border px-2" :class="[`border-${avg.color}`, `text-${avg.color}`]" title="Avg. vote">{{detail.vote_average}}</span>
                    <span class="rounded-full border px-2" :class="[`border-${avg.color}`, `text-${avg.color}`]" title="Votes">{{detail.vote_count}}</span>
                </div>
            </div>

        </div>
        <div class="card-body overflow-y-auto">
            <figure v-if="detail.poster_path" class="card-image p-4 " >
                <img :src="img_uri+detail.poster_path" id="posterImg" class="float-left mr-4" loading="lazy" @load="getPromColor()" >
                <p class="text-slate-700 text-base">
                    <span class="text-sky-600 font-bold">Overview:</span><br>
                    {{detail.overview}}
                </p>
                <div class="clear-left"></div>
            </figure>
            <hr class="clear-both">
            <!-- <figure v-if="detail.backdrop_path" class="">
                <img :src="img_uri+detail.backdrop_path" class="object-cover w-full h-96">
            </figure> -->
            <iframe v-if="videos.length>0" height="360" width="100%" :src="`https://www.youtube.com/embed/${videos[0].key}?autoplay=0&mute=0&rel=0`" allowfullscreen></iframe>
            <div class="card-body p-4 grid grid-cols-1 gap-y-2 text-base divide-y">
                <div id="budget">
                    <span class="text-slate-500">Budget: </span>
                    <span class="text-blue-600"><i class="ri-money-dollar-circle-fill text-lg"></i> {{detail.budget}}</span>
                </div>
                <div id="genres">
                    <span class="text-slate-500">Genres: </span>
                    <span v-for="g in detail.genres" :key="g.id" class="border border-blue-400 rounded-full px-2 text-blue-600 ml-1">{{g.name}}</span>
                </div>
                <div v-show="detail.keywords.keywords.length > 0" id="keywords " class="inline-flex flex-wrap gap-1">
                    <span class="text-slate-500">Keywords: </span>
                    <span v-for="kw in detail.keywords.keywords" :key="kw.id" class="border border-sky-400 rounded-full px-2 text-sky-600 text-sm">{{kw.name}}</span>
                </div>
                <div id="country">
                    <span class="text-slate-500">Country of origin: </span>
                    <span v-for="c in detail.origin_country" :key="c" class="text-sky-600">{{c}}</span>
                </div>
                <div id="language">
                    <span class="text-slate-500">Spoken language: </span>
                    <span v-for="l in detail.spoken_languages" :key="l.iso_639_1" class="text-sky-600">{{l.english_name}} - {{l.name}}, </span>
                </div>
                <!-- cast -->
                <div v-if="detail.credits.cast.length > 0" id="cast">
                    <h6 class="text-slate-500 font-semibold">Cast</h6>
                    <div id="castCarousel" class="flex gap-4 overflow-x-auto py-1">
                        <figure v-for="cast in detail.credits.cast" :key="cast.id" class="text-sky-600 w-40 shrink-0 bg-sky-100 text-center shadow">
                            <img v-if="cast.profile_path" :src="profile_uri+cast.profile_path" :alt="cast.name" loading="lazy">
                            <img v-else src="/400x600.svg" :alt="cast.name" loading="lazy">
                            <figcaption class="font-semibold">{{cast.name}}</figcaption>
                            <figcaption class="text-slate-500">({{cast.character}})</figcaption>
                        </figure>
                    </div>
                </div>
                <!-- crew -->
                <div v-if="detail.credits.crew.length > 0" id="crew">
                    <h6 class="text-slate-500 font-semibold">Crew</h6>
                    <div id="crewCarousel" class="flex gap-2 overflow-x-auto py-1">
                        <figure v-for="crew in detail.credits.crew" :key="crew.id" class="text-sky-600 w-32 shrink-0 bg-sky-100 text-center shadow">
                            <img v-if="crew.profile_path" :src="profile_uri+crew.profile_path" :alt="crew.name" loading="lazy">
                            <img v-else src="/400x600.svg" :alt="crew.name" loading="lazy">
                            <figcaption class="font-semibold">{{crew.name}}</figcaption>
                            <figcaption class="text-slate-600">{{crew.job}}</figcaption>
                            <!-- <figcaption class="text-slate-400">{{crew.department}}</figcaption> -->
                        </figure>
                    </div>
                </div>
                <div v-if="detail.production_companies.length > 0" id="company" >
                    <h6 class="text-slate-500 font-semibold">Production companies </h6>
                    <div id="companyCarousel" class="flex gap-4 overflow-x-auto py-1">
                        <figure v-for="c in detail.production_companies" :key="c.id" class="text-sky-600 border flex flex-col justify-between border-sky-200 shrink-0 w-40 text-center">
                            <img v-if="c.logo_path" :src="logo_uri+c.logo_path" :alt="c.name" loading="lazy">
                            <img v-else src="/600x400.svg" :alt="c.name" loading="lazy">
                            <figcaption>{{c.name}}</figcaption>
                        </figure>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <p v-show="posters.length > 0" class="text-base text-slate-500 font-bold">Posters</p>
                <div id="posterGrid" class="gap-2 mb-3 overflow-x-auto" style="display: grid; grid-template-columns: repeat(2, 1fr); grid-auto-flow: column; grid-auto-columns: minmax(150px, 150px); grid-template-rows: repeat(2, 230px); height: 480px;" >
                    <img v-for="(im, index) in posters" :key="'p-'+index" :src="img_uri+im.file_path" loading="lazy" class="object-cover" alt="">
                </div>
                <p v-show="backdrops.length > 0" class="text-base text-slate-500 font-bold">Backdrops</p>
                <div class="relative group">
                    <div id="backdropGrid" class="gap-2 mb-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory" style="display: flex; flex-wrap: nowrap; height: 340px;" @mouseenter="pauseCarousel('backdropGrid')" @mouseleave="resumeCarousel('backdropGrid')">
                        <img v-for="(im, index) in backdrops" :key="'b-'+index" :src="img_uri+im.file_path" loading="lazy" class="object-cover shrink-0 snap-center" style="aspect-ratio: 300 / 170; width: 100%;" alt="">
                    </div>
                    <!-- Navigation Buttons -->
                    <button v-show="backdrops.length > 1" @click="manualScroll('backdropGrid', -1)" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <i class="ri-arrow-left-s-line text-2xl"></i>
                    </button>
                    <button v-show="backdrops.length > 1" @click="manualScroll('backdropGrid', 1)" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <i class="ri-arrow-right-s-line text-2xl"></i>
                    </button>
                    <!-- Indicators -->
                    <div v-show="backdrops.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        <span v-for="(_, index) in backdrops" :key="'ind-'+index" 
                            class="size-2 rounded-full transition-all duration-300 cursor-pointer"
                            :class="currentBackdropIndex === index ? 'bg-white w-4' : 'bg-white/40'"
                            @click="scrollToIndex('backdropGrid', index)">
                        </span>
                    </div>
                </div>
                <!-- <p v-show="logos.length > 0" class="text-base text-slate-500 font-bold">Logos</p>
                <div class="images flex gap-2 overflow-x-auto mb-3">
                    <img v-for="im in logos" :src="img_uri+im.file_path" class="w-36 h-36 object-contain bg-slate-200" alt="">
                </div> -->
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
// import { prominent } from 'color.js'
// import '/Vibrant.min.js'

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
            promColor: ["#667889", "#9abcde", "#ddeeff"],
            currentBackdropIndex: 0,
            carouselIntervals: {},
        }
    },
    computed: {
        /*images() {
            if (this.detail?.id) {
                this.fetchImages()
            }
            return true
        }*/
        /*promColor(){
            if (this.detail.poster_path) {
                prominent(img_uri + this.detail.poster_path, { format: "hex" }).then(color => {
                  // console.log(color) // [241, 221, 63]
                  return color
                })
            } else {
                return ["#223344", "#778899", "#ddeeff"]
            }
        },*/
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
        videos(){
            return this.detail?.videos.results.filter(v => v.type == "Trailer")
        }
    },
    mounted() {
        // const scrollContainer = document.querySelectorAll(".overflow-x-auto");
        // console.log(scrollContainer)
        /*for(let x of scrollContainer){
            x.addEventListener("wheel", (evt) => {
                evt.preventDefault();
                x.scrollLeft += evt.deltaY;
            });
        }*/

        this.$nextTick(() => {
            this.setupCarousel("castCarousel");
            this.setupCarousel("crewCarousel");
            this.setupCarousel("companyCarousel");
            this.setupCarousel("posterGrid");
            this.initBackdropCarousel();
        });
    },
    watch: {
        'detail.credits.crew': {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    this.$nextTick(() => {
                        this.setupCarousel("crewCarousel");
                    });
                }
            },
            deep: true
        },
        'detail.production_companies': {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    this.$nextTick(() => {
                        this.setupCarousel("companyCarousel");
                    });
                }
            },
            deep: true
        },
        posters: {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    this.$nextTick(() => {
                        this.setupCarousel("posterGrid");
                    });
                }
            }
        },
        backdrops: {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    this.$nextTick(() => {
                        this.initBackdropCarousel();
                    });
                }
            }
        }
    },
    beforeUnmount() {
        // Clean up all carousel intervals and event listeners
        if (this._carouselCleanups) {
            this._carouselCleanups.forEach(cleanup => cleanup());
            this._carouselCleanups = [];
        }
        // Clean up backdrop carousel interval
        Object.values(this.carouselIntervals).forEach(clearInterval);
    },
    methods: {
        initBackdropCarousel() {
            const carousel = document.getElementById('backdropGrid');
            if (!carousel) return;

            // Track current index based on scroll position
            const handleScroll = () => {
                const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
                this.currentBackdropIndex = index;
            };

            carousel.addEventListener('scroll', handleScroll);
            
            // Initial auto-play
            this.resumeCarousel('backdropGrid');

            // Cleanup
            this._carouselCleanups = this._carouselCleanups || [];
            this._carouselCleanups.push(() => {
                carousel.removeEventListener('scroll', handleScroll);
                this.pauseCarousel('backdropGrid');
            });
        },
        manualScroll(id, direction) {
            const carousel = document.getElementById(id);
            if (!carousel) return;
            
            const nextIndex = (this.currentBackdropIndex + direction + this.backdrops.length) % this.backdrops.length;
            this.scrollToIndex(id, nextIndex);
        },
        scrollToIndex(id, index) {
            const carousel = document.getElementById(id);
            if (!carousel) return;
            
            carousel.scrollTo({
                left: index * carousel.clientWidth,
                behavior: 'smooth'
            });
            this.currentBackdropIndex = index;
        },
        pauseCarousel(id) {
            if (this.carouselIntervals[id]) {
                clearInterval(this.carouselIntervals[id]);
                delete this.carouselIntervals[id];
            }
        },
        resumeCarousel(id) {
            this.pauseCarousel(id);
            if (this.backdrops && this.backdrops.length > 1) {
                this.carouselIntervals[id] = setInterval(() => {
                    this.manualScroll(id, 1);
                }, 5000); // 5 seconds interval
            }
        },
        setupCarousel(carouselId) {
            const carousel = document.getElementById(carouselId);
            if (!carousel) return;

            let isAutoScrolling = true;
            let scrollSpeed = 50;
            let scrollDirection = 1; // 1 for right, -1 for left
            let maxScrollLeft = 0;

            // Calculate max scroll position
            const updateMaxScroll = () => {
                maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            };

            // Update max scroll on window resize
            window.addEventListener('resize', updateMaxScroll);
            updateMaxScroll();

            const autoScroll = () => {
                if (isAutoScrolling) {
                    const currentScroll = carousel.scrollLeft;
                    const nextScroll = currentScroll + (2 * scrollDirection);

                    // Check if we've reached the end
                    if (scrollDirection === 1 && currentScroll >= maxScrollLeft - 10) {
                        scrollDirection = -1; // Start scrolling left
                        setTimeout(() => {
                            carousel.scrollLeft = maxScrollLeft;
                        }, 1000);
                    }
                    // Check if we've reached the beginning
                    else if (scrollDirection === -1 && currentScroll <= 10) {
                        scrollDirection = 1; // Start scrolling right
                        setTimeout(() => {
                            carousel.scrollLeft = 0;
                        }, 1000);
                    }
                    else {
                        carousel.scrollBy({
                            left: 2 * scrollDirection,
                            behavior: 'smooth'
                        });
                    }
                }
            };

            // Auto-scroll interval
            const scrollInterval = setInterval(autoScroll, scrollSpeed);

            // Manual scroll with wheel
            carousel.addEventListener("wheel", (evt) => {
                evt.preventDefault();
                isAutoScrolling = false;
                scrollDirection = evt.deltaY > 0 ? 1 : -1;

                const scrollAmount = evt.deltaY > 0 ? 100 : -100;
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });

                // Resume auto-scroll after 5 seconds of no interaction
                clearTimeout(carousel.resumeTimeout);
                carousel.resumeTimeout = setTimeout(() => {
                    isAutoScrolling = true;
                    scrollDirection = 1; // Reset to forward direction
                }, 5000);
            });

            // Resume on mouse leave
            carousel.addEventListener("mouseleave", () => {
                isAutoScrolling = true;
            });

            // Pause on mouse enter
            carousel.addEventListener("mouseenter", () => {
                isAutoScrolling = false;
            });

            // Store cleanup functions for later use
            carousel._cleanup = () => {
                clearInterval(scrollInterval);
                window.removeEventListener('resize', updateMaxScroll);
            };

            // Cleanup on component destroy - store reference for manual cleanup
            this._carouselCleanups = this._carouselCleanups || [];
            this._carouselCleanups.push(carousel._cleanup);
        },
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
        },
        getPromColor(){
            /*if (this.detail.poster_path) {
                prominent(this.img_uri + this.detail.poster_path, { format: "hex" }).then(color => {
                  // console.log(color) // [241, 221, 63]
                  this.promColor = color
                })
            } */
            // var img = document.createElement('img');
            // img.setAttribute('src', 'examples/octocat.png')
            let img = document.getElementById("posterImg")
            
        },
        
    }

}
</script>
<style lang="scss" scoped>
#castCarousel,
#crewCarousel,
#companyCarousel {
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: rgba(100, 150, 255, 0.4) transparent;
}

#posterGrid,
#backdropGrid {
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: rgba(100, 150, 255, 0.4) transparent;
    gap: 0.5rem;
}

#castCarousel::-webkit-scrollbar,
#crewCarousel::-webkit-scrollbar,
#companyCarousel::-webkit-scrollbar,
#posterGrid::-webkit-scrollbar,
#backdropGrid::-webkit-scrollbar {
    height: 6px;
}

#castCarousel::-webkit-scrollbar-track,
#crewCarousel::-webkit-scrollbar-track,
#companyCarousel::-webkit-scrollbar-track,
#posterGrid::-webkit-scrollbar-track,
#backdropGrid::-webkit-scrollbar-track {
    background: transparent;
}

#castCarousel::-webkit-scrollbar-thumb,
#crewCarousel::-webkit-scrollbar-thumb,
#companyCarousel::-webkit-scrollbar-thumb,
#posterGrid::-webkit-scrollbar-thumb,
#backdropGrid::-webkit-scrollbar-thumb {
    background: rgba(100, 150, 255, 0.4);
    border-radius: 3px;
}

#castCarousel::-webkit-scrollbar-thumb:hover,
#crewCarousel::-webkit-scrollbar-thumb:hover,
#companyCarousel::-webkit-scrollbar-thumb:hover,
#posterGrid::-webkit-scrollbar-thumb:hover,
#backdropGrid::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 150, 255, 0.6);
}

#castCarousel::-webkit-scrollbar-button,
#crewCarousel::-webkit-scrollbar-button,
#companyCarousel::-webkit-scrollbar-button,
#posterGrid::-webkit-scrollbar-button,
#backdropGrid::-webkit-scrollbar-button {
    display: none;
}
</style>