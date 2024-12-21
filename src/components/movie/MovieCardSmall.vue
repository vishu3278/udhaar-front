<template>
    <article class="flex gap-2 shrink-0 border border-sky-200">
        <figure>
            <img :src="img_uri+movie.poster_path" alt="" height="200" class="h-60">
        </figure>
        <div class="w-48 h-60 overflow-clip p-2">
            <h6 class="text-sky-600 font-semibold">{{movie.title}}</h6>
            <p>{{movie.overview}}</p>
            <button @click="$emit('show-detail', this.movie)">detail</button>
        </div>
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