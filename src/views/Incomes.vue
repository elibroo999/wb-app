<template>
  <v-container>
    <h2>Доходы</h2>

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
      v-if="!loading && incomes.length"
      :chart-data="chartData"
      :chart-options="chartOptions"
      class="mb-6"
    />

    <v-table v-if="!loading && incomes.length">
      <thead>
        <tr>
          <th>#</th>
          <th>Дата</th>
          <th>Артикул</th>
          <th>Склад</th>
          <th>Кол-во</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in incomes" :key="item.income_id">
          <td>{{ index + 1 + (page - 1) * limit }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.supplier_article }}</td>
          <td>{{ item.warehouse_name }}</td>
          <td>{{ item.quantity }}</td>
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
import { fetchIncomes } from '@/api/fetchIncomes'
import type { Income } from '@/api/fetchIncomes'
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

const incomes = ref<Income[]>([])
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
    const result = await fetchIncomes(apiKey, page.value, limit, dateFrom.value, dateTo.value)
    incomes.value = result.data
    totalPages.value = result.meta.last_page ?? 1
  } catch (err) {
    console.error('Ошибка загрузки доходов:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch([page], loadData) // даты уже отслеживаются через @change

const chartData = computed(() => {
  const labels = incomes.value.map(item => item.date)
  const data = incomes.value.map(item => item.quantity)

  return {
    labels,
    datasets: [
      {
        label: 'Количество поступлений',
        data,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
