<template>
    <div class="card shadow shadow-slate-300">
        <div class="card-image">
            <img v-if="movie.poster_path" :src="img_uri+movie.poster_path" loading="lazy" class="img-responsive">
            <img v-else-if="movie.backdrop_path" :src="img_uri+movie.backdrop_path" loading="lazy" class="img-responsive">
            <img v-else src="https://placehold.co/300x440/9ab/ddd?text=No+Poster" class="img-responsive" alt="">
        </div>
        <div class="card-header py-1 px-2">
            <div class="card-title text-lg font-semibold leading-6 text-sky-600">{{movie.title || movie.name}} <small v-show="movie.adult" class="font-semibold  inline-block bg-rose-400 rounded-full text-center text-white size-5 leading-5 ml-4">A</small></div>
            <div class="card-subtitle font-medium text-sky-600">{{movie.original_title}}</div>
            <figure class="avatar avatar-sm text-uppercase " :data-initial="movie.original_language" ></figure>
            <span class="border border-amber-500 rounded-full inline-block px-2 h-6 mr-4 text-amber-600">{{humanDate(movie.release_date)}}</span> <span class="border border-amber-500 text-amber-600 text-center rounded-full inline-block size-6">{{movie.original_language}}</span><br>
            <span class="text-rose-500 mr-4">Avg. Vote: {{movie.vote_average}}</span> <span class="text-rose-400">Popularity: {{movie.popularity}}</span>
        </div>
        <div class="card-body text-base px-2">
            <p class="line-clamp-6">{{movie.overview}}</p>
        </div>
        <div class="card-footer ">
            <button class="btn btn-primary w-full" @click="$emit('show-detail', this.movie)">More</button>
        </div>
    </div>
</template>
<script>
import { api_key, base_uri, img_uri, profile_uri, date_format } from '../../constants.js'
import { format } from 'date-fns'
export default {

    name: 'MovieCard',
    props: {
        movie: { type: Object }
    },
    data() {
        return {
        	img_uri,
            date_format,
        }
    },
    methods: {
        humanDate(d) {
            if(d){
                return format(new Date(d), this.date_format)
            } else {
                return "No date"
            }
        },
    }
}
</script>
<style lang="css" scoped>
</style>