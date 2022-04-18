<script setup lang="ts">
import { ref, reactive, Ref } from "vue";
type Mode = "sun" | "thunder" | "cloudy" | "flurries" | "sunny" | "rainy";
// defineProps<{ mode: Mode }>();
let mode: Ref<Mode> = ref('rainy')
// mode.value = 'thunder'
</script>

<template>
  <article class="weather">
  <div v-if="mode === 'sun'" class="icon2033 sun-shower">
    <div class="cloud"></div>
    <div class="sun">
      <div class="rays"></div>
    </div>
    <div class="rain"></div>
  </div>

  <div v-if="mode === 'thunder'" class="icon2033 thunder-storm">
    <div class="cloud"></div>
    <div class="lightning">
      <div class="bolt"></div>
      <div class="bolt"></div>
    </div>
  </div>

  <div v-if="mode === 'cloudy'" class="icon2033 cloudy">
    <div class="cloud"></div>
    <div class="cloud"></div>
  </div>

  <div v-if="mode === 'flurries'" class="icon2033 flurries">
    <div class="cloud"></div>
    <div class="snow">
      <div class="flake"></div>
      <div class="flake"></div>
    </div>
  </div>

  <div v-if="mode === 'sunny'" class="icon2033 sunny">
    <div class="sun">
      <div class="rays"></div>
    </div>
  </div>

  <div v-if="mode === 'rainy'" class="icon2033 rainy">
    <div class="cloud"></div>
    <div class="rain"></div>
  </div>
  </article>
</template>

<style scoped>
.weather {
    font-size: 5.6px;
    margin-left: 100px;
    /* background-color:saddlebrown ; */
}
.icon2033 {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 100px;
}
</style>
