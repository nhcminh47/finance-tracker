<template>
    <div>

        <UForm :state="state" :schema="schema" ref="form" @submit.prevent="saveData">
            <UFormGroup label="Transaction View" :required="true" name="transactionView" class="mb-4">
                <USelect placeholder="Default Transaction View" :options="transactionViewOptions"
                    v-model="state.transactionViewOptions" />
            </UFormGroup>
            <UTable :rows="settingCategories" />
            <UButton class="mt-2 mb-4" icon="i-heroicons-plus-circle" size="md" color="sky" label="Add New Category"
                square variant="soft" type="button" @click="openAddCategoryModel" />
            <!-- <UFormGroup label="Category" :required="true" name="category" class="mb-4">
                <USelect placeholder="Select Category" :options="settingCategories" v-model="state.category" />
            </UFormGroup> -->
            <div>
                <UButton label="Save" variant="solid" color="white" type="submit" />
            </div>
        </UForm>
        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <p>Add new category</p>
                </template>

                <UForm :state="state2" :schema="schema2" ref="form2" @submit.prevent="addNewCategory">
                    <div>
                        <UFormGroup label="New Category" name="category" required>
                            <UInput type="text" v-model="state2.category" />
                        </UFormGroup>
                    </div>

                    <div class="flex items-center justify-end mt-10">
                        <UButton class="mr-3 w-20 justify-center" label="Add" color="primary" variant="solid"
                            type="submit" />
                        <UButton class="w-20 justify-center" label="Close" color="white" variant="outline" @click="" />
                    </div>
                </UForm>
            </UCard>
        </UModal>
    </div>
</template>
<script setup>
import { z } from 'zod';
import { categories, transactionViewOptions } from '~/constant';
const supabase = useSupabaseClient()
const form = ref()
const settingCategories = ref(categories)
const schema = z.object({
    transactionViewOptions: z.enum(transactionViewOptions),
})
const state = ref({
    transactionViewOptions: useSupabaseUser().value.user_metadata.transactionViewOptions ?? transactionViewOptions[1],
    category: useSupabaseUser().value.user_metadata.category ?? settingCategories.value[0],
    categories: settingCategories.value
})
const isOpen = ref(false)
const form2 = ref()
const schema2 = z.object({
    category: z.string().min(2)
})
const state2 = ref({
    category: ''
})
const saveData = async () => {
    if (form.value.errors.length > 0) return
    try {
        const { data, error } = await supabase.auth.updateUser({
            data: { ...state.value }
        })
        if (error) throw error
    } catch (error) {
        useToastError('Update Error!', error.message)
    } finally {
        useToastSucess('Update Sucess!', 'Your Option View has been updated!')
        form.value.clear()
        state.value = {
            transactionViewOptions: useSupabaseUser().value.user_metadata.transactionViewOptions ?? transactionViewOptions[1],
            category: settingCategories.value[0],
            categories: settingCategories.value
        }
    }
}
const openAddCategoryModel = () => {
    isOpen.value = true
}
const addNewCategory = async () => {
    if (form.value.errors.length > 0) return
    try {
        const { data, error } = await supabase.auth.updateUser({
            data: { categories: settingCategories.value.push(state2.value.category) }
        })
        if (error) throw error
    } catch (error) {
        useToastError('Update Error!', error.message)
    } finally {
        useToastSucess('Update Sucess!', `Add new Category ${state2.value.category}`)
        isOpen.value = false
    }
}
watch(isOpen, () => {
    if (!isOpen) {
        form2.value.clear()
        state2.value.category = ''
    }
})
</script>