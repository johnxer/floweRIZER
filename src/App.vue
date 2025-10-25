<template>
    <the-header
        v-if="isAuthed"
        :project-title="projectName"
    >
        <!-- <template #end>
            <vue-popper
                arrow
                offsetDistance="0"
                >
                <button class="text-3xl relative cursor-help">
                    <span class="material-symbols-outlined">
                        menu
                    </span>
                </button>
                <template #content>
                    <div class="text-xs max-w-[300px] font-normal">
                        <ul>
                            <li>
                                <button @click="logoutHandle">
                                    Log out
                                </button>
                            </li>
                        </ul>
                    </div>
                </template>
            </vue-popper>

            
        </template> -->
    </the-header>
    <div class="container mt-8 mx-auto px-6">
        <the-logo-circle
            v-if="!isAuthed"
            :project-title="projectName"
        />
        <router-view />
    </div>
</template>

<script setup>
import { ref } from 'vue';

// import VuePopper from 'vue3-popper';

import TheHeader from './components/UI/TheHeader.vue';
import TheLogoCircle from './components/UI/TheLogoCircle.vue';

const projectName = import.meta.env.VITE_PROJECT_NAME


const isAuthed = ref(true)


</script>

<style lang="scss" scoped></style>