<template>
    <div class="fixed bottom-22 right-6 w-84 h-120 bg-white shadow-xl rounded-xl border border-gray-100">
        <div class="flex flex-col h-full">
            <ul
                v-if="chatMessages"
                class="p-4 overflow-auto space-y-4 grow-1"
            >

                <li
                    v-for="chatMessage in chatMessages"
                    :key="chatMessage.date"
                >
                    <!-- <div class="flex justify-between gap-2 text-xs">
                        <span>
                            {{ chatMessage.user }}
                        </span>
                        <span>
                            {{ chatMessage.date }}
                        </span>
                    </div> -->
                    <div
                        class="relative p-3 rounded-bl-2xl rounded-br-2xl text-sm"
                        :class="chatMessage.user === 'AI adviser' ?
                            'bg-primary-100 rounded-tr-2xl after:content-[\'\'] after:absolute after:top-0 after:border-t-[0] after:border-b-[12px] after:border-r-[0.5rem] after:border-transparent after:border-r-primary-100 after:-left-2' :
                            'bg-primary-500 rounded-tl-2xl after:content-[\'\'] after:absolute after:top-0 after:border-t-[0] after:border-b-[12px] after:border-l-[0.5rem] after:border-transparent after:border-l-primary-500 after:-right-2'"
                    >
                        <div
                            class="text-xs mb-1 flex items-center gap-1"
                            :class="chatMessage.user === 'AI adviser' ?
                                'text-primary-700/50' :
                                'text-white/75'"
                        >
                            <span class="material-symbols-outlined text-base">
                                
                                {{ 
                                    chatMessage.user === 'AI adviser' ? 'network_intelligence' : 'face'
                                    }}
                                
                            </span>
                            {{ chatMessage.user }}
                        </div>
                        <p
                            class="text-sm"
                            :class="chatMessage.user === 'AI adviser' ?
                                'text-primary-700' :
                                'text-white'"
                        >
                            {{ chatMessage.message }}
                        </p>
                        <div 
                            class="text-[10px] text-end italic"
                            :class="chatMessage.user === 'AI adviser' ?
                                'text-primary-700/50' :
                                'text-white/75'"
                        >

                            {{ chatMessage.date }}
                        </div>
                    </div>
                </li>
                <!-- <li>
                    <div>
                        <span class="material-symbols-outlined">
                            face
                        </span>
                        johnxer
                    </div>
                    <div>
                        Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar
                    </div>
                </li> -->
                <!-- <li>
                    <div>
                        <span class="material-symbols-outlined">
                            <span class="material-symbols-outlined">
                                network_intelligence
                            </span>
                        </span>
                        AI adviser
                    </div>
                    <div>
                        Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar
                    </div>
                </li> -->
                <!-- <li>
                    <div>
                        <span class="material-symbols-outlined">
                            face
                        </span>
                        johnxer
                    </div>
                    <div>
                        Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar
                    </div>
                </li> -->
                <!-- <li>
                    <div>
                        <span class="material-symbols-outlined">
                            <span class="material-symbols-outlined">
                                network_intelligence
                            </span>
                        </span>
                        AI adviser
                    </div>
                    <div>
                        Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar
                    </div>
                </li> -->
                <li>

                </li>
            </ul>
            <div class="border-t border-gray-200">
                <input
                    type="text"
                    placeholder="Write your question..."
                    class="px-4 py-3 w-full focus:outline-0 bg-gray-50 focus:bg-gray-50 transition-colors duration-600 rounded-b-xl text-sm"
                    @keyup.enter="submitQuestion"
                    :disabled="isLoading"
                    v-model.trim="question"
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useFlowerChat } from '../../composables/useFlowerChat';

const {
    answer,
    error,
    isLoading,
    askFlowerBot,
} = useFlowerChat()

import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../stores/useAuthStore';


const {
    user
} = storeToRefs(useAuthStore())

const question = ref('')

const chatMessages = ref([])

chatMessages.value = [
    {
        user: 'johnxer@gmail.com',
        message: 'Lorem ipsum',
        date: '22.11.1981'
    },
    {
        user: 'AI adviser',
        message: 'Lorem ipsum',
        date: '11.12.2858'
    }
]


const email = computed(() => user.value?.email);

const submitQuestion = async () => {
    if (!question.value || !email.value) return

    const userData = {
        user: email.value,
        message: question.value,
        date: new Date()
    }

    chatMessages.value.push(userData)

    const success = await askFlowerBot(question.value);

    if (success) {
        console.log(answer.value)

        const aiData = {
            user: 'AI adviser',
            message: answer.value,
            date: new Date()
        }

        chatMessages.value.push(aiData)
    }

    question.value = ''

}

</script>

<style lang="scss" scoped></style>