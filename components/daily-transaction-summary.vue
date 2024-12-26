<template>
    <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
        <div class="flex items-center justify-between">
            {{ date }}
        </div>
        <div class="flex items-center justify-end space-x-2 mr-10">
            {{ formatCurrency(sum) }}
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    transactions: Array,
    date: String
})

const sum = computed(
    () => {
        let sum = 0
        for (const transaction of props.transactions) {
            if (transaction.type === 'Income') {
                sum += Number(transaction.amount)
            } else {
                sum -= Number(transaction.amount)
            }
        }
        return sum
    }
)
</script>

<style scoped></style>