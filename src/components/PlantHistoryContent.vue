<template>

    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🌱</span>Plant's history log
        </template>
        <div class="relative">
            <base-loader
                v-if="isPendingPlant || isLoadingActions"
                class="static"
            >
                Loading plant's history...
            </base-loader>

            <div v-else>
                <ul class="flex flex-col gap-4">
                    <li class="grid ">
                        <div class="text-gray-400 dark:text-gray-600 text-xs ml-[50px]">
                            {{ formattedDate }}

                        </div>
                        <div class="text-gray-600 dark:text-gray-500 grid grid-cols-[40px_1fr] gap-[10px] items-start">
                            <span class="noto-color-emoji-regular text-base bg-gray-100 dark:bg-gray-800 p-2 rounded-full flex items-center justify-center shrink-0">
                                🪴
                            </span> 
                            <span class="self-center text-sm md:text-base">
                                Plant added
                            </span>
                        </div>
                    </li>
                    <li
                        v-for="action in formattedActions"
                        :key="action.id"
                        class="grid "
                    >
                        <div class="text-gray-400 dark:text-gray-600 text-xs ml-[50px]">
                            {{ action.formattedDate }}

                        </div>
                        <div class="text-gray-600 dark:text-gray-500 grid grid-cols-[40px_1fr] gap-[10px] items-start">
                            <span class="noto-color-emoji-regular text-base bg-gray-100 dark:bg-gray-800 p-2 rounded-full flex items-center justify-center shrink-0">
                                
                                {{ action.emojiIcon }}
                            </span> 
                            <span class="self-center text-sm md:text-base">
                                Plant {{ action.action }}
                                <template v-if="action.action === 'moved'">
                                    from <strong>{{ action.originName }}</strong> to <strong>{{ action.targetName }}</strong>
                                </template>
                                <template v-else>
                                    changed
                                    <template v-if="action.action === 'name'">
                                        from <strong>{{ action.originalVal }}</strong> to <strong>{{ action.newVal }}</strong>
                                    </template>
                                    <template v-else-if="action.action === 'icon'">
                                        from <strong class="material-symbols-outlined text-2xl mx-1">{{ action.originalVal }}</strong> to <strong class="material-symbols-outlined text-2xl mx-1">{{ action.newVal }}</strong>
                                    </template>
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
import { usePlantsStore } from '../stores/usePlantsStore';

import { doc, getDoc } from "firebase/firestore";
import { computed, ref, watchEffect } from "vue";
import { useAuth } from "../composables/useAuth";
import { db } from "../firebase/config";
import BaseLoader from './Base/BaseLoader.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';

const { getUid } = useAuth();

const uid = getUid()


const plantsStore = usePlantsStore()

const {
    error: errorPlant,
    isPending: isPendingPlant,
    details: detailsPlant,
} = useGetDetails(`rooms/${plantsStore.selectedRoomId}/plants/${plantsStore.selectedPlantId}`)

const formattedDate = computed(() => {
    const createdAt = detailsPlant.value?.createdAt
    return createdAt?.toDate ? format(createdAt.toDate(), 'MMM d, yyyy') : '—'
})

const actionEmojiMap = {
    watered: {
        emoji: '💧'
    },
    moved: {
        emoji: '🚀'
    },
    name: {
        emoji: '✏️'
    },
    icon: {
        emoji: '✏️'
    },
    description: {
        emoji: '✏️'
    },
    image: {
        emoji: '✏️'
    }
}

const formattedActions = ref([])

const isLoadingActions = ref(false)

watchEffect(async () => {
    const log = detailsPlant.value?.log;

    if (!log?.length) {
        formattedActions.value = []
        return
    }

    isLoadingActions.value = true

    const roomIds = [
        ...new Set(
            log.flatMap(r => [r.origin, r.target]).filter(Boolean)
        )
    ]

    console.log(roomIds)

    const RoomDocument = await Promise.all(
        roomIds.map(id => getDoc(doc(db, `users/${uid}/rooms/${id}`)))
    )

    const roomMap = new Map()

    RoomDocument.forEach((snap, index) => {
        const id = roomIds[index]
        roomMap.set(id, snap.data()?.name)
    })

    formattedActions.value = log.map(a => {
        const date = a.date?.toDate ? a.date.toDate() : new Date(a.date)

        return {
            ...a,
            emojiIcon: actionEmojiMap[a.action]?.emoji || '',
            formattedDate: format(date, 'MMM d, yyyy'),
            originName: roomMap.get(a.origin) ?? null,
            targetName: roomMap.get(a.target) ?? '<room deleted>',
        }
    })

    isLoadingActions.value = false

})

</script>

<style lang="scss" scoped></style>