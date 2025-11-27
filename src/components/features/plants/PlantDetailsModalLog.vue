<template>
    <div class="relative">
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader v-if="isPending || isLoadingActions">
                Loading plant's history...
            </base-loader>

            <div v-else-if="props.error">
                {{ props.error }}
            </div>
            <div v-else="props.data">
                <ul class="flex flex-col gap-4">
                    <li class="grid ">
                        <div class="text-gray-400 dark:text-gray-600 text-xs ml-[40px]">
                            {{ formattedDate }}

                        </div>
                        <div class="text-gray-600 dark:text-gray-500 grid grid-cols-[30px_1fr] gap-[10px] items-start">
                            <span class="size-[30px] text-xl text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded-full flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined">
                                    add
                                </span>
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
                                Plant {{ action.action }}
                                <template v-if="action.action === 'moved'">
                                    from <strong>{{ action.originName }}</strong> to <strong>{{ action.targetName }}</strong>
                                </template>
                                <template v-else-if="action.action !== 'watered'">
                                    changed
                                    <template v-if="action.action === 'name'">
                                        from <strong>{{ action.originalVal }}</strong> to <strong>{{ action.newVal }}</strong>
                                    </template>
                                </template>
                            </span>

                        </div>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";

import { db } from "@/firebase/config";
import { format } from "date-fns";
import { doc, getDoc } from "firebase/firestore";

import BaseLoader from '@/components/base/BaseLoader.vue';


import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore()

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    isPending: {
        type: Boolean,
        required: true
    },
    error: {
        type: [Object, null],
        required: false,
        default: null
    }
})

const formattedDate = computed(() => {
    const createdAt = props.data?.createdAt
    return createdAt?.toDate ? format(createdAt.toDate(), 'MMM d, yyyy') : '—'
})

const actionIconMap = {
    watered: {
        icon: 'humidity_high'
    },
    moved: {
        icon: 'arrow_forward'
    },
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
    const log = props.data?.log;

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
        roomIds.map(id => getDoc(doc(db, `users/${authStore.user?.uid}/rooms/${id}`)))
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
            icon: actionIconMap[a.action]?.icon || '',
            formattedDate: format(date, 'MMM d, yyyy'),
            originName: roomMap.get(a.origin) ?? null,
            targetName: roomMap.get(a.target) ?? '<room deleted>',
        }
    })

    isLoadingActions.value = false

})

</script>

<style lang="scss" scoped></style>