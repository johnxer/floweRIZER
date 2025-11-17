<template>
    <div class="flex mt-2 text-xs">
        <transition
            name="fade"
            mode="out-in"
        >
            <button
                v-if="authStore.isLogin"
                type="button"
                class="cursor-pointer text-primary underline underline-offset-4 hover:no-underline transition-all"
                @click="handlePwRecovery"
            >
                Recover password
            </button>
        </transition>
        <button
            type="button"
            @click="handleSwitchLogin"
            class="cursor-pointer text-primary underline underline-offset-4 hover:no-underline transition-all ml-auto"
        >
            {{ switchLabel }}
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/useAuthStore';

const authStore = useAuthStore()

const handlePwRecovery = () => {
    authStore.showPwRecovery = !authStore.showPwRecovery
}

const handleSwitchLogin = () => {
    authStore.isLogin = !authStore.isLogin
}

const switchLabel = computed(() => authStore.isLogin ? 'Or sign up' : 'Or log in')

</script>

<style lang="scss" scoped></style>