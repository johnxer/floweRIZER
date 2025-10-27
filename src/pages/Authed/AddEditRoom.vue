<template>
    <div>
        <base-page-title>
            Add/Edit room
        </base-page-title>
        <div class="max-w-[300px] mx-auto">
            <form
                @submit.prevent=""
                novalidate
            >
                <div class="space-y-4">
                    <base-input-wrapper
                    >
                        <input
                            type="text"
                            placeholder="Enter room name..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer"
                            v-model.trim="name"
                        />
                    </base-input-wrapper>
                    Icon select
                    <base-input-wrapper
                    >
                        <textarea
                            placeholder="Enter room description..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer h-[100px] resize-none"
                            v-model.trim="desc"
                        />
                    </base-input-wrapper>

                </div>
                <base-button class="mt-8">
                    Add/Edit room
                </base-button>
            </form>
        </div>

    </div>
</template>

<script setup>

import BasePageTitle from '../../components/Base/BasePageTitle.vue';
import BaseButton from '../../components/Base/BaseButton.vue';
import BaseInputWrapper from '../../components/Base/BaseInputWrapper.vue';
import { ref } from 'vue';

const name = ref('')
const desc = ref('')

</script>

<style lang="scss" scoped></style>