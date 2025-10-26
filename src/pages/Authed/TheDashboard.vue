<template>
    <div>
        <base-page-title>
            Dashboard
        </base-page-title>

        <div class="grid lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div class="self-end">
                <div class="text-lg font-semibold text-gray-600 text-center">

                </div>
                <div class="min-h-[200px] w-full relative">
                    <button class="absolute inset-0 w-full h-full cursor-pointer font-bold text-2xl border-2 border-dashed border-primary-500 text-primary-500 rounded-xl hover:border-primary-700 hover:text-primary-700 transition-all duration-600">
                        Add new room
                    </button>
                </div>
            </div>

            <base-room
                v-for="room in rooms"
                :key="room.id"
                :room="room"
            />
        </div>
        
    </div>
</template>

<script setup>
import { ref } from 'vue';



import BasePageTitle from '../../components/Base/BasePageTitle.vue';
import BaseRoom from '../../components/Base/BaseRoom.vue';

const rooms = ref([
    {
        id: 1,
        name: 'Living room',
        icon: 'meeting_room',
        desc: 'Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar plum ice cream. Tootsie roll brownie danish gingerbread ice cream pastry. Dragée icing chupa chups caramels cotton candy. Oat cake chocolate cake macaroon chupa chups jelly beans chocolate cake cookie. Sweet jelly-o candy toffee chocolate bar jelly beans candy tootsie roll. Apple pie jelly gummi bears jujubes cupcake icing sesame snaps soufflé. Jelly beans lollipop candy canes icing shortbread gummi bears biscuit lemon drops gummi bears. Chocolate cake lollipop sweet cake pudding. Jelly-o chocolate sweet cake sweet roll. Chupa chups donut halvah lollipop cookie chocolate cake chocolate cake. Marshmallow topping chocolate cake candy lollipop chocolate cake. Sweet gingerbread wafer cookie muffin dragée shortbread soufflé. Gummies croissant sesame snaps danish tiramisu.',
        plants: [
            {
                id: 1,
                name: 'Cactus vulgaris',
                imgSrc: 'https://plus.unsplash.com/premium_photo-1681290358247-c160fc097bdb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764',
                desc: 'Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar plum ice cream. Tootsie roll brownie danish gingerbread ice cream pastry. Dragée icing chupa chups caramels cotton candy. Oat cake chocolate cake macaroon chupa chups jelly beans chocolate cake cookie. Sweet jelly-o candy toffee chocolate bar jelly beans candy tootsie roll. Apple pie jelly gummi bears jujubes cupcake icing sesame snaps soufflé. Jelly beans lollipop candy canes icing shortbread gummi bears biscuit lemon drops gummi bears. Chocolate cake lollipop sweet cake pudding. Jelly-o chocolate sweet cake sweet roll. Chupa chups donut halvah lollipop cookie chocolate cake chocolate cake. Marshmallow topping chocolate cake candy lollipop chocolate cake. Sweet gingerbread wafer cookie muffin dragée shortbread soufflé. Gummies croissant sesame snaps danish tiramisu.',
            },
            {
                id: 2,
                name: 'Ficus picus',
                // imgSrc: 'https://images.unsplash.com/photo-1437964706703-40b90bdf563b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074',
                desc: 'Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar plum ice cream. Tootsie roll brownie danish gingerbread ice cream pastry. Dragée icing chupa chups caramels cotton candy. Oat cake chocolate cake macaroon chupa chups jelly beans chocolate cake cookie. Sweet jelly-o candy toffee chocolate bar jelly beans candy tootsie roll. Apple pie jelly gummi bears jujubes cupcake icing sesame snaps soufflé. Jelly beans lollipop candy canes icing shortbread gummi bears biscuit lemon drops gummi bears. Chocolate cake lollipop sweet cake pudding. Jelly-o chocolate sweet cake sweet roll. Chupa chups donut halvah lollipop cookie chocolate cake chocolate cake. Marshmallow topping chocolate cake candy lollipop chocolate cake. Sweet gingerbread wafer cookie muffin dragée shortbread soufflé. Gummies croissant sesame snaps danish tiramisu.',
            }
        ]

    },
    {
        id: 2,
        name: 'Bathroom',
        icon: 'shower',
        desc: 'Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar plum ice cream. Tootsie roll brownie danish gingerbread ice cream pastry. Dragée icing chupa chups caramels cotton candy. Oat cake chocolate cake macaroon chupa chups jelly beans chocolate cake cookie. Sweet jelly-o candy toffee chocolate bar jelly beans candy tootsie roll. Apple pie jelly gummi bears jujubes cupcake icing sesame snaps soufflé. Jelly beans lollipop candy canes icing shortbread gummi bears biscuit lemon drops gummi bears. Chocolate cake lollipop sweet cake pudding. Jelly-o chocolate sweet cake sweet roll. Chupa chups donut halvah lollipop cookie chocolate cake chocolate cake. Marshmallow topping chocolate cake candy lollipop chocolate cake. Sweet gingerbread wafer cookie muffin dragée shortbread soufflé. Gummies croissant sesame snaps danish tiramisu.',
    },
    {
        id: 3,
        name: 'Terrace',
        icon: 'balcony',
        desc: 'Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar plum ice cream. Tootsie roll brownie danish gingerbread ice cream pastry. Dragée icing chupa chups caramels cotton candy. Oat cake chocolate cake macaroon chupa chups jelly beans chocolate cake cookie. Sweet jelly-o candy toffee chocolate bar jelly beans candy tootsie roll. Apple pie jelly gummi bears jujubes cupcake icing sesame snaps soufflé. Jelly beans lollipop candy canes icing shortbread gummi bears biscuit lemon drops gummi bears. Chocolate cake lollipop sweet cake pudding. Jelly-o chocolate sweet cake sweet roll. Chupa chups donut halvah lollipop cookie chocolate cake chocolate cake. Marshmallow topping chocolate cake candy lollipop chocolate cake. Sweet gingerbread wafer cookie muffin dragée shortbread soufflé. Gummies croissant sesame snaps danish tiramisu.',
    },
    {
        id: 4,
        name: 'Kitchen',
        icon: 'fork_spoon',
        desc: 'Danish lemon drops biscuit carrot cake jelly beans tootsie roll. Shortbread muffin tart soufflé tootsie roll sesame snaps sugar plum ice cream. Tootsie roll brownie danish gingerbread ice cream pastry. Dragée icing chupa chups caramels cotton candy. Oat cake chocolate cake macaroon chupa chups jelly beans chocolate cake cookie. Sweet jelly-o candy toffee chocolate bar jelly beans candy tootsie roll. Apple pie jelly gummi bears jujubes cupcake icing sesame snaps soufflé. Jelly beans lollipop candy canes icing shortbread gummi bears biscuit lemon drops gummi bears. Chocolate cake lollipop sweet cake pudding. Jelly-o chocolate sweet cake sweet roll. Chupa chups donut halvah lollipop cookie chocolate cake chocolate cake. Marshmallow topping chocolate cake candy lollipop chocolate cake. Sweet gingerbread wafer cookie muffin dragée shortbread soufflé. Gummies croissant sesame snaps danish tiramisu.',
    }
])

</script>

<style lang="scss" scoped></style>