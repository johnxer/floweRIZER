<template>
    <div>
        <base-loader v-if="isPendingRoom" />
        <div v-else>
            <base-page-title>
                <span class="inline-flex align-top items-center gap-3">
                    <span class="material-symbols-outlined">
                        {{ detailsRoom.icon }}
                    </span>
                    {{ detailsRoom.name }}
                    <div
                        class="rounded-full size-3"
                        :style="{ backgroundColor: detailsRoom.color }"
                    />
                </span>
            </base-page-title>
            <div class="lg:max-w-[500px] md:max-w-[400px] max-w-full mx-auto">
                <div class="text-gray-400 text-sm mb-1">
                    Created on {{ formattedDate }}
                </div>
                <div class="mb-8 bg-gray-100 dark:bg-gray-900 rounded-xl p-4 text-gray-500 dark:text-gray-400">
                    <div>
                        {{ detailsRoom.desc }}
                    </div>
                </div>
                <div class="">
                    <div>
                        <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-500 hover:rext-gray-400 group/card">
                            <transition-group
                                v-if="plants.length"
                                name="fade"
                                tag="ul"
                                class="space-y-2 mb-4"
                            >
                                <base-plant-list-item
                                    v-for="plant in plants"
                                    :key="plant.id"
                                    :plant="plant"
                                    :show-more-details="true"
                                />
                            </transition-group>
                            <div class="text-center">
                                <base-button
                                    type="button"
                                    @click="toggleModal()"
                                    class="mb-2 py-1 px-1 md:pr-0 inline-flex align-top items-center leading-none justify-center md:justify-start w-2/5 md:w-auto"
                                    :btn-full-width="false"
                                    btn-size="custom"
                                >
                                    <!-- Add a new plant -->

                                    <span class="material-symbols-outlined text-xl mr-1">
                                        add
                                    </span><span class="w-auto md:w-0 group-hover/card:w-[42px] overflow-hidden transition-all duration-400 text-sm flex">Plant</span>

                                </base-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <base-modal
            :modal-toggle="isModalOpen"
            @close-modal="toggleModal"
        >

            <add-new-plant-content
                :room-id="props.roomId"
                @close-modal="toggleModal"
            />
        </base-modal>
    </div>
</template>

<script setup>
import { format } from "date-fns";

import BaseButton from "../../components/Base/BaseButton.vue";
import BaseLoader from '../../components/Base/BaseLoader.vue';
import BaseModal from "../../components/Base/BaseModal/BaseModal.vue";
import BasePageTitle from '../../components/Base/BasePageTitle.vue';
import BasePlantListItem from '../../components/Base/BasePlantListItem.vue';

import AddNewPlantContent from "../../components/AddNewPlantContent.vue";

import { useGetData } from '../../composables/useGetData';

import { computed, ref } from "vue";
import { useGetDetails } from '../../composables/useGetDetail';

const props = defineProps({
    roomId: {
        type: String,
        required: true
    },
})

const {
    error: errorRoom,
    isPending: isPendingRoom,
    details: detailsRoom,
} = useGetDetails(`rooms/${props.roomId}`)

const {
    error: errorPlants,
    isPending: isPendingPlants,
    items: plants,
} = useGetData(`rooms/${props.roomId}/plants`)

const formattedDate = computed(() => {
    const createdAt = detailsRoom.value?.createdAt
    return createdAt?.toDate ? format(createdAt.toDate(), 'MMM d, yyyy') : '—'
})

const isModalOpen = ref(false)

const toggleModal = (state) => {
    if (typeof state === 'boolean') {
        isModalOpen.value = state
    } else {
        isModalOpen.value = !isModalOpen.value
    }
}



</script>

<style lang="scss" scoped></style>