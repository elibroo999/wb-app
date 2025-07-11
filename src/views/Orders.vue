<template>
  <v-container>
    <h2>Заказы</h2>

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
      v-if="!loading && orders.length"
      :chart-data="chartData"
      :chart-options="chartOptions"
      class="mb-6"
    />

    <v-table v-if="!loading && orders.length">
      <thead>
        <tr>
          <th>#</th>
          <th>Номер</th>
          <th>Дата</th>
          <th>Артикул</th>
          <th>Склад</th>
          <th>Кол-во</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in orders" :key="index">
          <td>{{ index + 1 + (page - 1) * limit }}</td>
          <td>{{ item.g_number }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.supplier_article }}</td>
          <td>{{ item.warehouse_name }}</td>
          <td>{{ articleCounts[item.supplier_article] || 1 }}</td>
          <td>{{ formatAmount(item.total_price) }}</td>
        </tr>
      </tbody>
    </v-table>

    <v-alert v-else-if="!loading" type="info">Нет данных за выбранный период</v-alert>

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
import { fetchOrders } from '@/api/fetchOrders'
import type { Order } from '@/types/Order'
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

const orders = ref<Order[]>([])
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
    const result = await fetchOrders(apiKey, page.value, limit, dateFrom.value, dateTo.value)
    orders.value = result.data
    totalPages.value = result.meta?.last_page ?? 1
  } catch (err) {
    console.error('Ошибка загрузки заказов:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch([page], loadData) // Даты обновляются вручную через @change

const chartData = computed(() => {
  const grouped = orders.value.reduce((acc, item) => {
    const dateOnly = item.date.split(' ')[0]
    acc[dateOnly] = (acc[dateOnly] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const labels = Object.keys(grouped)
  const data = Object.values(grouped)

  return {
    labels,
    datasets: [
      {
        label: 'Количество заказов',
        data,
        borderColor: 'rgba(138, 43, 226, 1)',
        backgroundColor: 'rgba(138, 43, 226, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  }
})

const articleCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const order of orders.value) {
    const key = order.supplier_article
    counts[key] = (counts[key] || 0) + 1
  }
  return counts
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    }
  }
}

const formatAmount = (amount: string | number | null) => {
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
