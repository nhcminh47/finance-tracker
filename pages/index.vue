<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">
            Summary
        </h1>
        <div>
            <USelectMenu :options="transactionViewOptions" v-model="selectedView"></USelectMenu>
        </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend color="green" :amount="incomeTotal" last-amount="5000" :loading="isLoading" title="Income" />
        <Trend color="red" :amount="expenseTotal" last-amount="3500" :loading="isLoading" title="Outcome" />
        <Trend color="green" amount="4000" last-amount="7000" :loading="isLoading" title="Invest" />
        <Trend color="red" amount="4000" last-amount="2045" :loading="isLoading" title="Saving" />
    </section>
    <section class="flex justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold">Transactions</h2>
            <div class="text-gray-500 dark:text-gray-400">
                You have {{ income.length }} incomes and {{ expense.length }} expenses this period
            </div>
        </div>
        <div>
            <TransactionModel v-model="isOpen" />
            <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="openModal()" />
        </div>
    </section>
    <section v-if="!isLoading">
        <div v-for="(transactionsOnDay, date) in transactionGroupByDate" :key="date" class="mb-10">
            <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
            <Transaction v-for="(transaction, index) in transactionsOnDay" :key="index" :transaction="transaction"
                @deleted="refreshTransactions()" />
        </div>
    </section>
    <section v-else>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constant';
const selectedView = ref(transactionViewOptions[1])
const transactions = ref([])
const isLoading = ref(false)
const isOpen = ref(false)
const supabase = useSupabaseClient()

const fetchTransactions = async () => {
    isLoading.value = true
    try {
        const { data } = await useAsyncData('transactions', async () => {
            const { data, error } = await supabase
                .from('grouped_date')
                .select('*')
            if (error) return []
            return data
        })
        console.log(data.value);

        return data.value
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}
const refreshTransactions = async () => transactions.value = await fetchTransactions()
await refreshTransactions()

const transactionGroupByDate = computed(
    () => {
        let groupData = {}
        for (const transaction of transactions.value) {
            const { date } = useFormatDate(transaction.created_at)
            if (!groupData[date.value]) {
                groupData[date.value] = []
            }
            groupData[date.value].push(transaction)
        }
        return groupData
    }
)

const income = computed(
    () => transactions.value.filter(trans => trans.type === 'Income')
)
const expense = computed(
    () => transactions.value.filter(trans => trans.type === 'Expense')
)
const incomeTotal = computed(
    () => income.value.reduce((a, b) => Number(a) + Number(b.amount), 0)
)
const expenseTotal = computed(
    () => expense.value.reduce((a, b) => Number(a) + Number(b.amount), 0)
)

const openModal = () => isOpen.value = true
</script>