<template>
  <v-container>
    <h2>Продажи</h2>

    <v-row>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="dateFrom"
          label="Дата от"
          type="date"
          @change="loadData"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="dateTo"
          label="Дата до"
          type="date"
          @change="loadData"
        />
      </v-col>
    </v-row>

    <v-progress-circular v-if="loading" indeterminate color="primary" />

    <Line
      v-if="!loading && sales.length"
      :chart-data="chartData"
      :chart-options="chartOptions"
      class="mb-6"
    />

    <v-table v-if="!loading && sales.length">
      <thead>
        <tr>
          <th>#</th>
          <th>Дата</th>
          <th>Артикул</th>
          <th>Склад</th>
          <th>Сумма</th>
          <th>Скидка %</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sales" :key="index">
          <td>{{ index + 1 + (page - 1) * limit }}</td>
          <td>{{ item.date.split(' ')[0] }}</td>
          <td>{{ item.supplier_article }}</td>
          <td>{{ item.warehouse_name }}</td>
          <td>{{ formatAmount(item.total_price) }}</td>
          <td>{{ item.discount_percent }}%</td>
        </tr>
      </tbody>
    </v-table>

    <v-alert v-else-if="!loading" type="info">
      Нет данных за выбранный период
    </v-alert>

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
import { fetchSales } from '@/api/fetchSales'
import type { Sale } from '@/types/Sale'
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

const sales = ref<Sale[]>([])
const loading = ref(false)
const page = ref(1)
const limit = 20
const totalPages = ref(1)

const dateFrom = ref('2024-01-01')
const dateTo = ref('2024-12-31')

const apiKey = import.meta.env.VITE_API_KEY

const loadData = async () => {
  loading.value = true
  try {
    const result = await fetchSales(apiKey, page.value, limit, dateFrom.value, dateTo.value)
    sales.value = result.data
    totalPages.value = result.meta?.last_page ?? 1

    console.log('Sales from API:', sales.value)
  } catch (err) {
    console.error('Ошибка загрузки продаж:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch([page], loadData) // Даты обновляются вручную по @change

const chartData = computed(() => {
  const grouped = sales.value.reduce<Record<string, number>>((acc, item) => {
    const date = item.date.split(' ')[0]
    const price = Number(item.total_price)
    acc[date] = (acc[date] || 0) + (isNaN(price) ? 0 : price)
    return acc
  }, {})

  const labels = Object.keys(grouped)
  const data = Object.values(grouped)

  return {
    labels,
    datasets: [
      {
        label: 'Сумма продаж',
        data,
        borderColor: 'rgba(220, 20, 60, 1)', // алый
        backgroundColor: 'rgba(220, 20, 60, 0.2)',
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

const formatAmount = (amount: number | string | null) => {
  const num = Number(amount)
  return isNaN(num)
    ? '—'
    : num.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
}
</script>
