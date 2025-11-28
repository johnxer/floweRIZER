<template>
    <div class="flex flex-col h-full">
        <div class="bg-white rounded-t-xl px-4 py-3 shadow-lg relative z-1 flex justify-between items-center dark:bg-gray-800">
            <div class="text-lg md:text-xl">
                <span class="text-primary font-bold">Flower</span><span class="text-primary-700">Chat</span>
            </div>
            <div class="flex gap-1 items-center">
                <button
                    v-if="activeChatId"
                    v-tooltip="{
                        content: 'End chat',
                    }"
                    class="text-red-300 hover:text-red-900 cursor-pointer transition-colors duration-600 text-2xl flex dark:text-red-700"
                    @click="handleEndChat"
                    v-close-popper="true"
                >
                    <span class="material-symbols-outlined">
                        close
                    </span>

                </button>
                <button
                    v-tooltip="{
                        content: 'Minimize chat',
                    }"
                    class="text-gray-500 hover:text-primary cursor-pointer transition-colors duration-600 text-3xl flex dark:text-gray-400"
                    v-close-popper="true"
                    @click="handleMinimizeChat"
                >
                    <span class="material-symbols-outlined">
                        stat_minus_1
                    </span>

                </button>
            </div>
        </div>
        <base-loader
            v-if="isPendingGet"
            class="grow-1 text-gray-400 text-sm flex items-center justify-center"
        >
            Loading chat...
        </base-loader>
        <div
            v-else-if="!activeChatId"
            class="p-4 text-center grow-1 flex flex-col items-center justify-center"
        >
            <span class="material-symbols-outlined text-8xl mb-2 text-gray-200 dark:text-gray-700">
                chat_dashed
            </span>
            <span class="text-lg text-gray-400 dark:text-gray-400">
                Chat has ended
            </span>
            <Button
                class="mt-4"
                type="button"
                size="sm"
                variant="hover-outline"
                @click="handleStartChat"
            >
                Start a new chat
            </Button>
        </div>
        <div
            v-else
            class="p-4 overflow-auto grow-1"
            ref="scrollWrapper"
        >
            <transition-group
                tag="ul"
                name="fade"
                class="space-y-4"
            >
                <li
                    :key="'default'"
                    class="relative p-3 rounded-bl-2xl rounded-br-2xl text-sm bg-primary-500/20 rounded-tr-2xl after:absolute after:top-0 after:border-t-[0] after:border-b-[12px] after:border-r-[0.5rem] after:border-transparent after:border-r-primary-500/20 after:-left-2"
                >
                    <div class="text-xs mb-1 flex items-center gap-1 text-primary-700/50 dark:text-primary-400/50">
                        <span class="material-symbols-outlined text-base">
                            network_intelligence
                        </span>
                        AI adviser
                    </div>
                    <p class="text-sm text-primary-700 dark:text-primary-400">
                        Hey plant lover! I’m floweRIZER 🌼<br />
                        I know (almost) everything about green life — watering, soil, light, you name it! 🌞🌿
                    </p>
                </li>

                <li
                    v-for="message in messages"
                    :key="message.id"
                >
                    <div
                        class="relative p-3 rounded-bl-2xl rounded-br-2xl text-sm"
                        :class="message.role === 'ai' ?
                            'bg-primary-500/20 rounded-tr-2xl after:content-[\'\'] after:absolute after:top-0 after:border-t-[0] after:border-b-[12px] after:border-r-[0.5rem] after:border-transparent after:border-r-primary-500/20 after:-left-2' :
                            'bg-primary-500 rounded-tl-2xl after:content-[\'\'] after:absolute after:top-0 after:border-t-[0] after:border-b-[12px] after:border-l-[0.5rem] after:border-transparent after:border-l-primary-500 after:-right-2'"
                    >
                        <div
                            class="text-xs mb-1 flex items-center gap-1"
                            :class="message.role === 'ai' ?
                                'text-primary-700/50 dark:text-primary-400/50' :
                                'text-white/75'"
                        >
                            <span class="material-symbols-outlined text-base">

                                {{
                                    message.role === 'ai' ? 'network_intelligence' : 'face'
                                }}

                            </span>
                            {{ message.user }}
                        </div>
                        <p
                            class="text-sm"
                            :class="message.role === 'ai' ?
                                'text-primary-700 dark:text-primary-400' :
                                'text-white'"
                        >
                            {{ message.message }}
                        </p>
                        <div
                            class="text-[10px] text-end italic"
                            :class="message.role === 'ai' ?
                                'text-primary-700/50 dark:text-primary-400/50' :
                                'text-white/75'"
                        >

                            {{ formatTimestamp(message.createdAt) }}
                        </div>
                    </div>
                </li>
                <li
                    v-if="isPendingAI"
                    :key="'waiting'"
                    class="animate-pulse flex items-center gap-2 text-gray-500 text-sm justify-end"
                >
                    <span class="material-symbols-outlined text-2xl">
                        network_intelligence
                    </span>
                    AI is thinking...
                </li>
            </transition-group>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-800">
            <input
                type="text"
                placeholder="Write your question..."
                class="px-4 py-3 w-full focus:outline-0 bg-gray-50 focus:bg-gray-50 transition-colors duration-600 rounded-b-xl text-sm dark:bg-gray-800 dark:text-white/75 dark:focus:bg-gray-800 disabled:animate-pulse disabled:text-gray-400 disabled:cursor-wait"
                @keyup.enter="submitQuestion"
                :disabled="isPendingAI"
                v-model.trim="question"
            >
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { formatDistanceToNow } from 'date-fns';

import BaseLoader from '@/components/base/BaseLoader.vue';

import { Button } from '@/components/ui/button';


import { useAuthStore } from '@/stores/useAuthStore';

import { useActiveChat, useFlowerChat, useGetChatData, useSendData } from '@/composables';


const {
    answer,
    error: errorAI,
    isPending: isPendingAI,
    askFlowerBot,
} = useFlowerChat()

const {
    activeChatId,
    isPending: isLoadingChat,
    getOrCreateChat,
    endChat
} = useActiveChat()

const {
    isPending: isPendingSend,
    error: errorSend,
    sendData
} = useSendData()

const authStore = useAuthStore()


const {
    error: errorGet,
    isPending: isPendingGet,
    data: messages,
} = useGetChatData(activeChatId)


const handleEndChat = async () => {
    await endChat()
    messages.value = []
}

const emit = defineEmits(['minimize-chat'])

const handleMinimizeChat = () => {
    emit('minimize-chat')
}


const question = ref('')

const email = computed(() => authStore.user?.email);

const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
        return '';
    }

    const date = new Date(timestamp.seconds * 1000)

    return formatDistanceToNow(date, { addSuffix: true })
}

const submitQuestion = async () => {
    if (!question.value || !email.value) return

    const userData = {
        role: 'user',
        user: email.value,
        message: question.value,
    }

    await sendData('chats', userData, activeChatId.value)

    const success = await askFlowerBot(question.value);

    if (success) {
        console.log(answer.value)

        const aiData = {
            role: 'ai',
            user: 'AI adviser',
            message: answer.value,
        }

        await sendData('chats', aiData, activeChatId.value)

        question.value = ''
    }
}

onMounted(async () => {
    await getOrCreateChat()
})

const handleStartChat = async () => {
    await getOrCreateChat()
}

const scrollWrapper = ref(null)

watch([messages, isPendingAI], async () => {
    await nextTick()
    setTimeout(() => {
        if (scrollWrapper.value) {
            scrollWrapper.value.scrollTo({
                top: scrollWrapper.value.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, 0)
})


</script>

<style lang="scss" scoped></style>