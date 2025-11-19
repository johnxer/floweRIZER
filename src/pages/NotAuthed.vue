<template>
    <base-container
        :is-authed="false"
    >
        <div class="max-w-[300px] mx-auto">
            <transition
                name="fade"
                mode="out-in"
            >
                <pw-reset 
                    v-if="authStore.showPwRecovery" 
                    @pw-reset-done="handleLoginShow"
                />
                <div v-else>

                    <transition
                        name="fade"
                        mode="out-in"
                    >
                        <the-login v-if="authStore.isLogin" />
                        <the-sign-up
                            v-else
                            class="md-column"
                        />
                    </transition>
                    <!-- <div class="flex mt-2 text-xs">
                        <transition
                            name="fade"
                            mode="out-in"
                        >
                            <button
                                v-if="isLogin"
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
                    </div> -->
                </div>
            </transition>
        </div>
    </base-container>
</template>



<script setup>

import BaseContainer from '@/components/base/BaseContainer.vue';

import PwReset from '@/components/features/auth/PwReset.vue';
import TheLogin from '@/components/features/auth/TheLogin.vue';
import TheSignUp from '@/components/features/auth/TheSignUp.vue';


import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore()

const handleLoginShow = () => {
    authStore.showPwRecovery = false
    authStore.isLogin = true;
}

</script>

<style lang="scss" scoped></style>