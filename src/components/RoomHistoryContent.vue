<template>

    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🏠</span>Rooms's history log
        </template>
        <div class="relative">
            <base-loader
                v-if="isPendingRoom"
                class="static"
            >
                Loading plant's history...
            </base-loader>

            <div v-else>
                <ul class="flex flex-col gap-4">
                    <li class="grid">
                        <div class="text-gray-400 dark:text-gray-600 text-xs ml-[40px]">
                            {{ formattedDate }}
                        </div>
                        <div class="text-gray-600 dark:text-gray-500 grid grid-cols-[30px_1fr] gap-[10px] items-start">
                            <span class="size-[30px] text-xl text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined">
                                    add
                                </span>
                            </span>
                            <span class="self-center text-sm md:text-base">
                                Room added
                            </span>
                        </div>
                    </li>
                    <li
                        v-for="action in formattedActions"
                        :key="action.id"
                        class="grid "
                    >
                        <div class="text-gray-400 dark:text-gray-600 text-xs ml-[40px]">
                            {{ action.formattedDate }}

                        </div>
                        <div class="text-gray-600 dark:text-gray-500 grid grid-cols-[30px_1fr] gap-[10px] items-start">
                            <span class="size-[30px] text-xl text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined">
                                    {{ action.icon }}
                                </span>
                            </span>
                            <span class="self-center text-sm md:text-base">
                                Room's {{ action.action }} changed
                                <template v-if="action.action === 'name'">
                                    from <strong>{{ action.originalVal }}</strong> to <strong>{{ action.newVal }}</strong>
                                </template>
                                <template v-else-if="action.action === 'icon'">
                                    from <strong class="material-symbols-outlined text-2xl mx-1">{{ action.originalVal }}</strong> to <strong class="material-symbols-outlined text-2xl mx-1">{{ action.newVal }}</strong>
                                </template>
                            </span>

                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </base-modal-content>
</template>

<script setup>
import { format } from "date-fns";

import { useGetDetails } from '../composables/useGetDetail';

import { computed, ref, watchEffect } from "vue";
import { useAuth } from "../composables/useAuth";
import { useRoomsStore } from "../stores/useRoomsStore";
import BaseLoader from './Base/BaseLoader.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';

const { getUid } = useAuth();

const uid = getUid()


const roomsStore = useRoomsStore()

const {
    error: errorRoom,
    isPending: isPendingRoom,
    details: detailsRoom,
} = useGetDetails(`rooms/${roomsStore.selectedRoomId}`)

watchEffect(() => {
    console.log('createdAt:', detailsRoom.value?.createdAt)
    console.log('type:', typeof detailsRoom.value?.createdAt)
})

const formattedDate = computed(() => {
    const createdAt = detailsRoom.value?.createdAt

    return createdAt?.toDate ? format(createdAt.toDate(), 'MMM d, yyyy') : '—'
})

const actionIconMap = {
    name: {
        icon: 'edit'
    },
    icon: {
        icon: 'edit'
    },
    description: {
        icon: 'edit'
    },
    image: {
        icon: 'edit'
    }
}

const formattedActions = ref([])

const isLoadingActions = ref(false)

watchEffect(async () => {
    const log = detailsRoom.value?.log;

    if (!log?.length) {
        formattedActions.value = []
        return
    }

    isLoadingActions.value = true

    formattedActions.value = log.map(a => {
        const date = a.date?.toDate ? a.date.toDate() : new Date(a.date)

        return {
            ...a,
            icon: actionIconMap[a.action]?.icon || '',
            formattedDate: format(date, 'MMM d, yyyy'),
        }
    })

    isLoadingActions.value = false

})

</script>

<style lang="scss" scoped></style>