<script>
import { auth } from '/src/stores/auth.js'
import NavigationComponent from './components/NavigationComponent.vue'
export default {
    components: { NavigationComponent },
    data() {
        return {
            auth
        }
    }
}
</script>

<template>
    <Header v-if="auth.is_authenticated"></Header>
    <div id="section-body">
        <NavigationComponent v-if="auth.is_authenticated" />
        <router-view class="section-router"></router-view>
    </div>
    <div id="section-player" v-if="auth.is_authenticated">
        <AudioPlayer />
    </div>
</template>



