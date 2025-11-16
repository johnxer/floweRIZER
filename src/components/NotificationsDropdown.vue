<template>
    <v-dropdown
        trap-focus
        popper-class="popper-slide"
    >
        <button
            class="relative transition-colors duration-600 flex p-2"
            :class="hasNotifications ? 'cursor-pointer text-gray-400 dark:text-gray-600 hover:dark:text-primary-600' : 'cursor-default text-gray-200 dark:text-gray-800'"
            :disabled="!hasNotifications"
        >
            <span class="material-symbols-outlined text-2xl relative">
                notifications
                <span
                    v-if="hasNotifications"
                    class="absolute top-0 right-0 flex size-2"
                >
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                    <span class="relative inline-flex size-2 rounded-full bg-primary-500" />
                </span>
            </span>
        </button>
        <template #popper>
            <div class="text-base max-w-[300px] font-normal p-4 max-h-[300px] overflow-y-auto">
                <transition-group
                    name="fade"
                    tag="ul"
                    class="text-sm"
                >
                    <li
                        v-for="notification in notifications"
                        :key="notification.id"
                        class="border-b last:border-0 border-gray-200 dark:border-gray-800 pb-2 mb-2 last:pb-0 last:mb-0"
                    >
                        <div class="flex gap-2 items-start">
                            <span class="material-symbols-outlined text-xl text-gray-300 dark:text-gray-500 relative -top-[1px]">
                                info
                            </span>
                            <div
                                v-html="notification.action"
                                class="text-gray-600 dark:text-gray-500"
                            />
                        </div>
                        <div class="text-end flex justify-end gap-6">
                            <button
                                type="button"
                                class="mt-2 cursor-pointer transition-all duration-600 text-primary-500 hover:text-primary-700 dark:hover:text-primary-700 inline-flex align-top items-center gap-1"
                                @click="handleWatering(notification.id)"
                                v-close-popper="isLastNotification"
                            >
                                <span class="material-symbols-outlined text-lg">
                                    humidity_high
                                </span>
                                <span>
                                    Water plant
                                </span>
                            </button>
                        </div>
                    </li>
                </transition-group>
            </div>
        </template>
    </v-dropdown>
</template>

<script setup>
import { differenceInDays } from 'date-fns';
import { computed } from 'vue';
import { useGetDataByUserId } from '../composables/useGetData';
import { useUpdateData } from '../composables/useUpdateData';


const {
    error,
    isPending,
    items: plants
} = useGetDataByUserId('plants')

const {
    error: errorUpdateData,
    isPending: isPendingUpdateData,
    waterPlant
} = useUpdateData()

const notificationsArrayFromFB = computed(() => {
    if (!plants.value?.length) return []

    return plants.value
        .filter(p => {
            if (!p.lastWateredDate) return true

            const lastWatered = p.lastWateredDate.toDate
                ? p.lastWateredDate.toDate()
                : new Date(p.lastWateredDate)

            const daysAgo = differenceInDays(new Date(), lastWatered)
            return daysAgo > p.wateringFrequency
        }).map(p => ({
            ...p,
            type: 1,
        }))
})


const typeNotificationsMap = [
    {
        id: 1,
        action: 'Water plant ##plantName## within 24 hours'
    },
    {
        id: 2,
        action: 'Fertilize ##plantName## this week'
    }
]

const notifications = computed(() => {
    return notificationsArrayFromFB.value.map(n => {
        const typeD = typeNotificationsMap.find(m => m.id === n.type)

        const objekt = {
            ...n,
            action: typeD ? typeD.action.replace('##plantName##', `<strong>${n.name}</strong>`) : 'Unknown action'
        }

        return objekt
    })
})

const hasNotifications = computed(() => notifications.value.length)

const isLastNotification = computed(() => {
    return notifications.value.length < 2
})

const handleWatering = async (plantId) => {
    await waterPlant(plantId)
}

</script>

<style lang="scss" scoped></style>