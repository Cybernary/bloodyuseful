<template>
  <SplashScreen v-if="showSplash" @start="dismissSplash" />
  <BloodyUseful v-else />
</template>

<script>
import { Capacitor } from '@capacitor/core'
import BloodyUseful from './components/BloodyUseful.vue'
import SplashScreen from './components/SplashScreen.vue'

export default {
  name: 'App',
  components: { BloodyUseful, SplashScreen },
  data() {
    const isWeb = !Capacitor.isNativePlatform()
    let splashSeen = false
    try {
      splashSeen = localStorage.getItem('splashSeen') === '1'
    } catch (e) {
      splashSeen = false
    }
    return {
      showSplash: isWeb ? !splashSeen : true
    }
  },
  methods: {
    dismissSplash() {
      this.showSplash = false
      try {
        localStorage.setItem('splashSeen', '1')
      } catch (e) {
        return
      }
    }
  }
}
</script>
