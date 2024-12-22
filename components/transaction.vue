<template>
    <div
        class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 font-bold">
        <div class="flex items-center justify-between col-span-2">
            <div class="flex items-center space-x-1">
                <UIcon :name="icon" :class="{ 'green': color, 'red': !color }" />
                <div>{{ transaction.description }}</div>
            </div>
            <div>
                <UBadge color="white" v-if="transaction.category">{{ transaction.category }}</UBadge>
            </div>
        </div>
        <div class="flex items-center justify-end space-x-2">
            <div>{{ currency }}</div>
            <div>
                <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
                    <UButton variant="ghost" color="white" trailing-icon="i-heroicons-ellipsis-horizontal"
                        :loading="isLoading" />
                </UDropdown>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    transaction: Object
})
const emit = defineEmits(['deleted'])
const supabase = useSupabaseClient()
const isIncome = computed(
    () => props.transaction.type === 'Income'
)
const icon = computed(
    () => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-right'
)
const color = computed(
    () => isIncome.value
)
const { currency } = useCurrency(props.transaction.amount)
const isLoading = ref(false)
const toast = useToast()
const deleteTransaction = async () => {
    isLoading.value = true
    try {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', props.transaction.id)
        if (error) throw error
        else {
            toast.add({
                title: 'Transaction deleted',
                icon: 'i-heroicons-check-circle',
                color: 'green'
            })
            emit('deleted')
        }
    }
    catch (e) {
        toast.add({
            title: 'Transaction deleted',
            icon: 'i-heroicons-exclaimation-circle',
            color: 'red'
        })
    } finally {
        isLoading.value = false
    }

}
const items = [
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => console.log('Edit')
    },
    {
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: deleteTransaction
    },]
]
</script>

<style scoped>
.red {
    @apply text-red-600
}

.green {
    @apply text-green-600
}
</style>