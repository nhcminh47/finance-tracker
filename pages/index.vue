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
        <Trend color="green" :amount="incomeTotal" :last-amount="previousIncomeTotal" :loading="pending"
            title="Income" />
        <Trend color="red" :amount="expenseTotal" :last-amount="previousExpenseTotal" :loading="pending"
            title="Outcome" />
        <Trend color="orange" :amount="4000" :last-amount="7000" :loading="pending" title="Invest" />
        <Trend color="blue" :amount="4000" :last-amount="2045" :loading="pending" title="Saving" />
    </section>
    <section class="flex justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold">Transactions</h2>
            <div class="text-gray-500 dark:text-gray-400">
                You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
            </div>
        </div>
        <div>
            <TransactionModel v-model="isOpen" @saved="refresh()" />
            <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="openModal()" />
        </div>
    </section>
    <section v-if="!pending">
        <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-10">
            <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
            <Transaction v-for="(transaction, index) in transactionsOnDay" :key="index" :transaction="transaction"
                @deleted="refresh()" />
        </div>
    </section>
    <section v-else>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constant';
const selectedView = ref(transactionViewOptions[1])
const { current, previous } = useSelectedTimePeriod(selectedView)
const isOpen = ref(false)
const [{ pending, refresh, transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: {
        byDate
    }
} }, { transactions: {
    incomeTotal: previousIncomeTotal,
    expenseTotal: previousExpenseTotal,
} }] = await Promise.all([useFetchTransactions(current), useFetchTransactions(previous)])

await refresh()

const openModal = () => isOpen.value = true
</script>