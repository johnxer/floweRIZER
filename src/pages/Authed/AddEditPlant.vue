<template>
    <div>
        <base-page-title>
            Add/Edit plant
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
                            placeholder="Enter plant name..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer"
                            v-model.trim="name"
                        />
                    </base-input-wrapper>
                    Plant image
                    <base-input-wrapper
                    >
                        <textarea
                            placeholder="Enter plant description..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer h-[100px] resize-none"
                            v-model.trim="desc"
                        />
                    </base-input-wrapper>
                    <base-input-wrapper
                    >
                        <select
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer h-[100px] resize-none"
                            v-model.trim="room"
                        >
                            <option value='' selected disabled>Select room...</option>
                            <option value='none'>No room yet...</option>
                            <option value='living_room'>Living room</option>
                        </select>
                    </base-input-wrapper>


                </div>
                <base-button class="mt-8">
                    Add/Edit plant
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
const room = ref('')

</script>

<style lang="scss" scoped></style>