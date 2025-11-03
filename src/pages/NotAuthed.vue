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
                    v-if="showPwRecovery" 
                    @pw-reset-done="handleLoginShow"
                />
                <div v-else>

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
                    </div>
                </div>
            </transition>
        </div>
    </base-container>
</template>



<script setup>

import BaseContainer from '../components/Base/BaseContainer.vue';


import PwReset from '../components/Auth/PwReset.vue';
import TheLogin from '../components/Auth/TheLogin.vue';
import TheSignUp from '../components/Auth/TheSignUp.vue';


import { computed, ref } from 'vue';



const isLogin = ref(true);

const handleSwitchLogin = () => {
    isLogin.value = !isLogin.value
}

const showPwRecovery = ref(false)

const handlePwRecovery = () => {
    showPwRecovery.value = !showPwRecovery.value
}

const handleLoginShow = () => {
    showPwRecovery.value = false
    isLogin.value = true;
}

const switchLabel = computed(() => isLogin.value ? 'Or sign up' : 'Or log in')

</script>

<style lang="scss" scoped></style>