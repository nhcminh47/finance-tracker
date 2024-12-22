<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header>
                Add Transaction
            </template>
            <UForm :state="state" :schema="schema" ref="form" @submit.prevent="save">
                <UFormGroup label="Types" :required="true" name="type" class="mb-4">
                    <USelect placeholder="Select The Transaction Type" :options="types" v-model="state.type" />
                </UFormGroup>
                <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
                    <UInput type="number" placeholder="Amount" v-model="state.amount" />
                </UFormGroup>
                <UFormGroup label="Transaction Date" :required="true" name="created_at" class="mb-4">
                    <UInput type="Date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
                </UFormGroup>
                <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
                    <UInput type="text" placeholder="Description" v-model="state.description" />
                </UFormGroup>
                <UFormGroup label="Category" :required="true" name="category" class="mb-4">
                    <USelect placeholder="Select Category" :options="categories" v-model="state.category" />
                </UFormGroup>
                <UButton type="submit" variant="solid" color="white" label="Save" />
            </UForm>
        </UCard>
    </UModal>
</template>
<script setup>
import { categories, types } from '~/constant';
import { z } from 'zod'
const props = defineProps({
    modelValue: Boolean
})
const form = ref()
const emit = defineEmits(['update:modelValue'])
const initialState = {
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined
}
const state = ref({ ...initialState })
const defaultSchema = z.object({
    amount: z.number().positive('Amount should be positive'),
    created_at: z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
    }),
    description: z.string().optional(),
})
const typeSchema = z.object({
    type: z.literal(types)
})
const categoriesSchema = z.object({
    category: z.literal(categories)
})
const schema = z.intersection(
    z.discriminatedUnion('type', [typeSchema]), z.discriminatedUnion('category', [categoriesSchema])
).and(defaultSchema)
const isOpen = computed(
    {
        get: () => props.modelValue,
        set: (value) => {
            emit('update:modelValue', value)
            if (!value) {
                state.value = { ...initialState }
                form.value.clear()
            }
        }
    }
)

const save = async () => {
    form.value.validate()
}
</script>