<template>
    <article class="flex gap-2 shrink-0 bg-gradient-to-tl to-yellow-50 from-sky-50 relative">
        <figure>
            <img :src="img_uri+movie.poster_path" alt="" height="200" class="h-64">
        </figure>
        <div class="w-48 h-64 overflow-clip p-2">
            <h5 class="text-sky-600 font-bold">{{movie.title}}</h5>
            <p class="line-clamp-6">{{movie.overview}}</p>
            <p class="inline-block text-sky-600 border border-sky-600 rounded-full px-2 ">{{movie.vote_average}}</p>
            <br>
            <button class="uppercase mt-4 px-4 py-1 rounded-md tracking-wider" @click="$emit('show-detail', this.movie)">Detail</button>
        </div>
        <!-- <div class=" flex items-center justify-center">
        </div> -->
    </article>
</template>
<script>
import { base_uri, img_uri, profile_uri } from '@/constants.js'
export default {

    name: 'MovieCardSmall',

    props: {
        movie: Object,
    },

    data() {
        return {
            img_uri,

        }
    }
}
</script>
<style lang="scss" scoped>
</style>