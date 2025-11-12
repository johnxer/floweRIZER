<template>
    <base-container>
        <div class="text-center md:max-w-[600px] max-w-full mx-auto flex items-center flex-col ">
            <h1 class="text-2xl md:text-3xl text-gray-700 font-semibold mb-8">
                <span class="text-primary-700 text-[2.5rem] font-black">Oops!</span><br class="md:hidden"/> Your page went root-bound!
            </h1>
            <img
                alt="404 page"
                src="/src/img/404.svg"
                class="w-full sm:w-1/2"
            >
        </div>
    </base-container>
</template>

<script setup>
import BaseContainer from '../components/Base/BaseContainer.vue';

</script>

<style lang="scss" scoped></style>