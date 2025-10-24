<template>
    <div class="max-w-[300px] mx-auto">
        <transition
            name="fade"
            mode="out-in"
        >
            <the-login v-if="isLogin" />
            <the-sign-up
                v-else
                class="md-column"
            />
        </transition>
        <div class="flex mt-2 text-xs">
            <transition name="fade" mode="out-in">
                <button
                    v-if="isLogin"
                    type="button"
                    class="cursor-pointer text-primary underline underline-offset-4 hover:no-underline transition-all"
                >
                    Recover password
                </button>
            </transition>
            <button
                type="button"
                @click="switchLogin"
                class="cursor-pointer text-primary underline underline-offset-4 hover:no-underline transition-all ml-auto"
            >
                {{ switchLabel }}
            </button>
        </div>
    </div>
</template>



<script setup>
import TheLogin from '../components/Auth/TheLogin.vue';
import TheSignUp from '../components/Auth/TheSignUp.vue';


import { computed, ref } from 'vue';



const isLogin = ref(true);

const switchLogin = () => {
    isLogin.value = !isLogin.value
}

const switchLabel = computed(() => isLogin.value ? 'Or sign up' : 'Or log in')

</script>

<style lang="scss" scoped></style>