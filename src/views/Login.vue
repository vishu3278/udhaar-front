<template>
    <main>
        <div class="container bottom-progress">
            <div class="grid sm:grid-cols-2 gap-4">
                <div class="column p-8">
                    <img src="mobile-login-concept.avif" alt="">
                </div>
                <div class="column p-4 ">
                    <div class="tab flex gap-2 mb-4">
                        
                        <button @click="tab = 'login'" class="btn info" :class="{active: tab == 'login'}">Login</button>
                    
                        <button @click="tab = 'register'" class="btn info" :class="{active: tab == 'register'}">Register</button>
                        
                    </div>
                    <template v-if="tab == 'login'">
                        <div class="card-body p-5 border rounded shadow">
                            <!-- <div class="card-title h5">Login</div>
                            <div class="card-subtitle text-gray">to use the app</div> -->
                            <form action="">
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input class="form-input" type="email" v-model="email" placeholder="Enter email">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Password</label>
                                    <input class="form-input" type="password" v-model="password" placeholder="Password">
                                </div>
                            </form>
                            <div v-show="state.loginError" class="toast bg-pink-100 px-4 py-2 rounded text-red-600 text-base">
                                <!-- <button class="btn btn-clear float-right"></button> -->
                                {{state.loginError}}
                            </div>
                            <div class="card-footer p-4">
                                <button class="btn submit" @click="login">Login</button>
                            </div>
                        </div>
                    </template>
                    <template v-if="tab == 'register'">
                        <div class="card-body p-5 border rounded">
                            <!-- <div class="card-title h5">Register</div>
                            <div class="card-subtitle text-gray">to use the app</div> -->
                            <form action="">
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input class="form-input" type="email" v-model="email" placeholder="Enter email">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Password</label>
                                    <input class="form-input" type="password" v-model="password" placeholder="Password">
                                </div>
                            </form>
                            <div v-show="state.regError" class="toast bg-pink-100 px-4 py-2 rounded text-red-600 text-base">
                                <!-- <button class="btn btn-clear float-right"></button> -->
                                {{state.regError}}
                            </div>
                        </div>
                        <div class="card-footer p-4">
                            <button class="btn submit" @click="register">Register</button>
                        </div>
                    </template>
                
                </div>
            </div>
        </div>
    </main>
</template>
<script setup>
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { createUser } from '@/firebase/auth.js'
// import TheWelcome from '@/components/TheWelcome.vue'
import { reactive, computed } from 'vue'
import { ref, watch } from 'vue'
import router from '@/router'
import { auth } from '@/firebase.js'
const email = ref('')
const password = ref('')
const tab = ref('login')
const user = ref({})
const state = reactive({ loginError: '', regError: '' })
watch(tab, (newValue) => {
    if (newValue == "login") { state.regError == '' }
    if (newValue == "register") { state.loginError == '' }
})
const login = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            console.info(userCredential)
            user.value = userCredential.user;
            sessionStorage.setItem("user", JSON.stringify({ accessToken: userCredential.user.accessToken, email: userCredential.user.email, name: userCredential.user.displayName, phone: userCredential.user.phoneNumber, photo: userCredential.user.photoURL, uid: userCredential.user.uid }))
            router.push('/')
        })
        .catch((error) => {
            console.log(error.code, error.message)
            state.loginError = error.message
            /*const errorCode = error.code;
            const errorMessage = error.message;*/
        });
}
const register = () => {
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            user.value = userCredential.user;
            console.info(userCredential)

        })
        .catch((error) => {
            console.log(error.code, error.message)
            /*const errorCode = error.code;
            const errorMessage = error.message;*/

        });
}
</script>
<style lang="scss" scoped>
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

main {
    padding: 2rem;
    min-height: calc(100vh - 65px);
}
.bottom-progress {
    &::after {
        content: "";
        height: 4px;
        width: 100%;
        display: block;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradient 25s ease infinite;
    }

}

.tab {
    button {
        @apply rounded text-lg;
    }
    button.active {
        font-weight: bold;
        @apply bg-blue-500 text-white;
    }

    button:focus {
        outline: none;
        box-shadow: none;
    }
}
.form-group {
    @apply mb-5;
    label {
        @apply mb-2 text-base;
    }
    .form-input {
        @apply text-base px-4 py-2;
    }
}
.submit {
    @apply text-base font-medium;
}
</style>