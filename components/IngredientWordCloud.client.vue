<script setup lang="ts">
import { useRouter } from "vue-router"
import { Chart, registerables } from "chart.js"
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import AppButton from "./AppButton.vue";

Chart.register(...registerables, WordCloudController, WordElement)
const router = useRouter()
const wordCloudData = await useWordcloud()
const wordCloudCanvas = ref<HTMLCanvasElement>()

const labels = computed(() => wordCloudData.value?.map(([text]) => text))
const data = computed(() => wordCloudData.value?.map(([, count]) => count * 7 + 12))

let wordCloudChart: Chart<"wordCloud", number[], string> | undefined;

function destroyWordCloud() {
  if (wordCloudChart) {
    wordCloudChart.destroy();
  }
  wordCloudChart = undefined
}

const createWorkdCloudChart = () => {
  destroyWordCloud()

  wordCloudChart = new Chart(wordCloudCanvas.value!, {
    type: 'wordCloud',
    data: {
      labels: labels.value!,
      datasets: [{
        label: 'Word Cloud',
        data: data.value!,
        links: labels.value,
        fit: true
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
    }
  })
  wordCloudCanvas.value!.onclick = (event) => {
      const points = wordCloudChart?.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
      if (points?.length) {
        const link = labels.value?.at(points[0].index)
        if (link) {
          router.push("/?ingredient=" + link)
        }
      }
    }
}

onMounted(() => {
  if (wordCloudChart === undefined && wordCloudCanvas.value !== undefined) {
    createWorkdCloudChart()
  }
})

onBeforeUnmount(destroyWordCloud)
</script>

<template>
  <div class="button-list">
    <AppButton @click="() => router.back()"> × </AppButton>
  </div>

  <div id="canvas-container">
    <canvas ref="wordCloudCanvas"></canvas>
  </div>
</template>

<style scoped lang="scss">
#canvas-container {
  height: 100%;
}
canvas {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
