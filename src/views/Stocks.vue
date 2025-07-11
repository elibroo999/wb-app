<template>
  <v-container>
    <h2>Склады</h2>

    <v-progress-circular v-if="loading" indeterminate color="primary" />

    <Line
      v-if="!loading && stocks.length"
      :chart-data="chartData"
      :chart-options="chartOptions"
      class="mb-6"
    />

    <v-table v-if="!loading && stocks.length">
      <thead>
        <tr>
          <th>#</th>
          <th>Артикул</th>
          <th>Размер</th>
          <th>Штрихкод</th>
          <th>Склад</th>
          <th>Кол-во</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in stocks" :key="index">
          <td>{{ index + 1 + (page - 1) * limit }}</td>
          <td>{{ item.supplier_article || '—' }}</td>
          <td>{{ item.tech_size || '—' }}</td>
          <td>{{ item.barcode }}</td>
          <td>{{ item.warehouse_name }}</td>
          <td>{{ item.quantity }}</td>
        </tr>
      </tbody>
    </v-table>

    <v-alert v-else-if="!loading" type="info">Нет данных за текущий день</v-alert>

    <v-pagination
      v-model="page"
      :length="totalPages"
      :total-visible="5"
      class="mt-4"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { fetchStocks } from '@/api/fetchStocks'
import type { Stock } from '@/types/Stock'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

const stocks = ref<Stock[]>([])
const loading = ref(false)
const page = ref(1)
const limit = 20
const totalPages = ref(1)

const apiKey = import.meta.env.VITE_API_KEY

const loadData = async () => {
  loading.value = true
  try {
    const result = await fetchStocks(apiKey, page.value, limit)
    console.log('Пример stock:', result.data[0])
    stocks.value = result.data
    totalPages.value = result.meta.last_page ?? 1
  } catch (error) {
    console.error('Ошибка загрузки остатков:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch(page, loadData)

const chartData = computed(() => {
  const grouped = stocks.value.reduce<Record<string, number>>((acc, item) => {
    const warehouse = item.warehouse_name
    const qty = Number(item.quantity)
    acc[warehouse] = (acc[warehouse] || 0) + (isNaN(qty) ? 0 : qty)
    return acc
  }, {})

  return {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: 'Остатки по складам',
        data: Object.values(grouped),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    }
  }
}
</script>
