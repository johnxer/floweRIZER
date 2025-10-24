<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useCounterStore } from '../stores/counter'

const isToggled = ref(true)

const counter = useCounterStore()

const fetchData = async () => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
  console.log(res.data)
}

const toggleHandler = () => {
    isToggled.value = !isToggled.value
}

</script>

<template>
  <div class="card grid-cols-1fr-auto grid-cols-1fr-1fr-auto">
    <p>Counter: {{ counter.count }}</p>
    <div class="flex gap-6">
    <button @click="counter.increment" class="px-4 py-2 bg-blue-500 text-white rounded bg-omfg tab-6 flex items-center">
      <span class="material-symbols-outlined text-xl mr-1">add</span>Increment
    </button>

    <button @click="fetchData" class="px-4 py-2 bg-green-500 text-white rounded">
      Test Axios
    </button>

    <button @click="toggleHandler" class="px-4 py-2 bg-avocado-500 text-white rounded">
      Test toggle (custom theme bg)
    </button>
    </div>
  </div>

  <div class="card mt-6">
    <transition name="fade" mode="out-in">
        <div v-if="isToggled">
            Is Toggled
        </div>
        <div v-else>
            Not Toggled
        </div>
        </transition>
  </div>
</template>