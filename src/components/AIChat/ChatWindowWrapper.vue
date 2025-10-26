<template>
    <div class="fixed bottom-22 right-6 w-84 h-120 bg-white shadow-xl rounded-2xl">
        <div class="flex flex-col h-full">
            <ul class="p-4 overflow-auto">

                <li
                    v-for="chatMessage in chatMessages"
                    :key="chatMessage.date"
                >
                    {{ chatMessage.user }}
                    {{ chatMessage.question }}
                    {{ chatMessage.time }}
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
                    class="p-4 w-full focus:outline-0"
                    @keyup.enter="submitQuestion"
                    :disabled="isLoading"
                    v-model.trim="question"
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

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


const email = user.value.email;

const submitQuestion = async () => {
    console.log(question.value)

    const userData = {
        user: email,
        question: question.value,
        date: new Date()
    }

    chatMessages.value.push(userData)

    const success = await askFlowerBot(question.value);

    

    if (success) {
        console.log(answer.value)

        const aiData = {
            user: 'AI adviser',
            question: answer.value,
            date: new Date()
        }

        chatMessages.value.push(aiData)
    
        inputText.value = ''
    }

}

</script>

<style lang="scss" scoped></style>