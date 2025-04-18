<template>
    <main>
        <div class="container py-4">
            <h4 class="text-center">Harry Potter</h4>
            <section class="grid grid-cols-6 gap-4 my-4">
                <div v-for="c in allChars" class="border p-2 hover:bg-sky-100" @click="active = c.id">
                    <figure class="w-full p-2 rounded relative" style="min-height: 2.5rem;">
                        <img v-if="c.image" :src="c.image" :alt="c.actor" class="object-cover h-80 w-full">
                        <figcaption class="absolute bottom-2 z-10 px-2 py-1 bg-gradient-to-b from-yellow-200 to-yellow-100 rounded-tr">{{c.actor}}</figcaption>
                    </figure>
                    <h5 class="text-indigo-600">
                        {{c.name}}
                    </h5>
                    <div class="flex gap-1">
                        <p v-if="c.hogwartsStaff" class="inline-block px-2 py-1 rounded bg-orange-300">Staff</p>
                        <p v-if="c.hogwartsStudent" class="inline-block px-2 py-1 rounded bg-blue-300">Student</p>
                        <p v-if="c.alive" class="inline-block px-2 py-1 rounded bg-green-200">Alive</p>
                        <p v-if="c.wizard" class="inline-block px-2 py-1 rounded bg-rose-200">Wizard</p>

                    </div>
                    <p class="text-lg text-indigo-500">
                        {{c.species}} - {{c.gender}} 
                    </p>
                    <p v-if="c.ancestry">Ancestry- {{c.ancestry}}</p>
                    <p v-if="c.house">House- {{c.house}}</p>
                    <div v-show="active == c.id" class="extra ">
                        <div class="flex gap-2">
                            <p v-if="c.hairColour"><span class="px-1 inline-block align-middle border-2 rounded " :style="{borderColor: c.hairColour, backgroundImage: `linear-gradient(145deg, transparent, ${c.hairColour})`}" >{{c.hairColour}}</span>  &#129457;</p>
                            <p v-if="c.eyeColour"><span class="px-1 inline-block align-middle border-2 rounded " :style="{borderColor: c.eyeColour, backgroundImage: `conic-gradient(transparent, ${c.eyeColour}, whitesmoke, ${c.eyeColour}, white, ${c.eyeColour}, ghostwhite, ${c.eyeColour}, transparent, ${c.eyeColour}, transparent)` }" >{{c.eyeColour}}</span> &#128064;</p>
                        </div>
                        <p v-if="c.dateOfBirth">DOB: {{c.dateOfBirth}}</p>
                        <p v-if="c.patronus">Patronus: {{c.patronus}}</p>
                        <template v-if="c?.alternate_names && c?.alternate_names?.length > 0">
                            <p class="font-semibold">Alternate names/AKA</p>
                            <ul class="list-disc ml-4">
                                <li v-for="aka in c.alternate_names">{{aka}}</li>
                            </ul>
                        </template>
                    </div>
                </div>
            </section>
            <div class="loading loading-lg"></div>
        </div>
    </main>
</template>
<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'
import { harry } from '@/constants.js'
const error = ref('')
const active = ref(null)
const allChars = ref("characters")
const hogwartzStaff = ref('characters/staff')
const hogwartzStudents = ref("characters/students")
const griffindorChars = ref("characters/house/gryffindor")
const charactor = ref("character/:id")
const spells = ref("spells")

onMounted(() => {
    console.log("component mounted")
    axios.get(harry+"characters").then(chars => {
        // console.log(chars.data)
        allChars.value = chars.data
    })
})
/*const getChar = (id) => {
    axios.get(harry+"character/"+id).then(char => {
        console.log(char)
    })
}*/

</script>
<style lang="scss" scoped>

</style>