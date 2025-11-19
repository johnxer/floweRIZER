<template>
    <div class="sm-container">
        <div class="">
            <h1 class="md-headline text-center">
                Flower organizer
            </h1>
            <p>

            </p>
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
            <div class="text-end mt-2">
                <button
                    type="button"
                    @click="switchLogin"
                    class=""
                >
                    {{ switchLabel }}
                </button>
            </div>
        </div>

    </div>
</template>



<script setup>
import { computed, ref } from 'vue';

import TheLogin from '@/components/features/auth/TheLogin.vue';
import TheSignUp from '@/components/features/auth/TheSignUp.vue';

const isLogin = ref(true);

const switchLogin = () => {
    isLogin.value = !isLogin.value
}

const switchLabel = computed(() => isLogin.value ? 'Or sign up' : 'Or log in')

</script>

<style lang="scss" scoped></style>