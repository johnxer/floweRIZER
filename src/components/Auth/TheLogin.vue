<template>
    <form
        submit.prevent=""
        novalidate
    >
        <div class="space-y-4">
            <base-input-wrapper icon-name="email">
                <input
                    type="email"
                    placeholder="Enter email..."
                    class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold text-white/80 peer"
                />
            </base-input-wrapper>
            <base-input-wrapper icon-name="lock">
                <input
                    type="password"
                    placeholder="Enter password..."
                    class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold text-white/80 peer"
                />
            </base-input-wrapper>
        </div>
        <base-button class="mt-8">
            Login
        </base-button>
    </form>
</template>

<script setup>
import BaseButton from '../Base/BaseButton.vue';
import BaseInputWrapper from '../Base/BaseInputWrapper.vue';

</script>