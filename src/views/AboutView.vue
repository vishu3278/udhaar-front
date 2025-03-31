<template>
    <div class="about container">
        <h2 class="text-3xl text-center py-5">About</h2>
        <hr>
        <div class="flex flex-row gap-5 my-4">
            <main class="basis-[30%]">
                <section class="p-3 flex gap-4 bg-slate-100 rounded mb-2">
                    <h5 class="mt-0 mb-3 text-teal-600">Udhaar</h5>
                    <ul class="list-disc list-inside">
                        <li>Dashboard</li>
                        <li>Add udhaar</li>
                        <li>Add payee</li>
                        <li>Add transaction</li>
                    </ul>
                </section>
                <section class="p-3 flex gap-4 bg-slate-100 rounded mb-2">
                    <h5 class="mt-0 mb-3 text-teal-600">Invoice</h5>
                    <ul class="list-disc list-inside">
                        <li>Add invoice</li>
                        <li>Add company</li>
                        <li>Add items in invoice</li>
                        <li>Print / download invoice</li>
                    </ul>
                </section>
                <section class="p-3 flex gap-4 bg-slate-100 rounded mb-2">
                    <h5 class="mt-0 mb-3 text-teal-600">Movies</h5>
                    <ul class="list-disc list-inside">
                        <li>Search movies by title</li>
                        <li>Grid view with pagination</li>
                        <li>Get details of movie (in progress)</li>
                    </ul>
                </section>
                <h5>Created using </h5>
                <ul class="list-inside list-disc">
                    <li>Vue js 3</li>
                    <li>Tailwind</li>
                    <li>Firebase</li>
                    <li>External APIs</li>
                </ul>
            </main>
            <aside class="basis-[20%]">
                <hr>
                <!-- <button @click="loadPeople">Load</button> -->
                <!-- <p>People </p> -->
                <!-- <ul class="list-inside list-disc">
                    <li v-for="u in users">{{u.name}} | {{u.phone}}</li>
                </ul> -->
                <!-- <h4>Add people</h4>

                <div class="form-group">
                    <input type="text" v-model="name" placeholder="Name">
                </div>
                <div class="form-group">
                    <input type="number" v-model="phone" placeholder="Phone">
                </div>
                <div class="form-group">
                    <input type="email" v-model="email" placeholder="Email">
                </div>
                <button @click="addPeople">Add</button> -->
                <h5 class="text-teal-800">Chart via api </h5>
                (https://image-charts.com)
                <img src="https://image-charts.com/chart?chs=254x254&chd=t:60,40&cht=p3&chl=Hello%7CWorld&chan=1500">
                <hr>
                <h5 class="text-teal-800">QR Code api </h5>(https://api.qrserver.com)
                <img src="https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&amp;size=128x128&format=svg&color=235410&bgcolor=ffeecc&margin=2&qzone=1" alt="qrcode" title="HelloWorld" />
                
            </aside>
            <aside class="basis-[50%]">
                <span class="text-3xl align-middle">&#x1F606;</span>
                <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Nunito+Sans&weight=600&size=22&pause=1000&color=115e59&center=false&vCenter=true&width=480&height=48&lines=Random+joke+using+free+api+quickly;Using+two+different+APIs+to+get+data;Random+joke+will+appear+after+one+minute" alt="Typing SVG" /></a>
                <!-- <iframe src="https://www.raaga.com/embed/widget-m.php?artist=Gostho Gopal Das&l=B&g=&ty=S" width="100%" height="212" frameborder="0" allowtransparency="true"></iframe> -->
                <!-- <hr> -->
                <news-card></news-card>
            </aside>
        </div>
    </div>
</template>
<script>
import axios from "axios"
import NewsCard from '@/components/NewsCard.vue'
export default {
    name: "About",
    components: {
        NewsCard,
    },
    data() {
        return {
            users: [],
            name: "",
            phone: "",
            email: ""
        }
    },
    mounted() {
        /*axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json", {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(insult => {
            console.log(insult)
        })*/
    },
    methods: {
        loadPeople() {
            console.log('inside method')
            /*const us = axios.get(
                import.meta.env.VITE_API_URL + "/people").then(res => {
                console.log(res.data)
                this.users = res.data
            }).catch(err => console.warn(err))*/
        },
        /*addPeople() {
            if (!this.name) return
            axios.post(
                import.meta.env.VITE_API_URL + "/people", { name: this.name, phone: this.phone, email: this.email }).then((res) => {
                console.log(res.data)
            })
        }*/
    }
}
</script>
<style lang="scss" scoped>

</style>