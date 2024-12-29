<template>
    <UForm :schema="schema" ref="form" :state="state" @submit.prevent="updateInfo">
        <UFormGroup class="mb-4" label="Nick Name" name="nickname" required>
            <UInput type="text" v-model="state.nickname" placeholder="Your Display Name" />
        </UFormGroup>
        <UButton label="Save" type="submit" variant="solid" color="black" />
    </UForm>
</template>
<script setup>
import { z } from 'zod'
const supabase = useSupabaseClient()
const form = ref()
const schema = z.object({
    nickname: z.string().min(2)
})
const state = ref({
    nickname: ''
})
const updateInfo = async () => {
    if (form.value.errors.length > 0) return
    try {
        console.log(state.nickname);

        const { data, error } = await supabase.auth.updateUser({
            data: { displayName: state.value.nickname }
        })
        if (error) throw error
    } catch (error) {
        useToastError('Update Error!', error.message)
    } finally {
        useToastSucess('Update Sucess!', 'Your NickName Has Been Updated!')
        form.value.clear()
        state.value = {
            nickname: ''
        }
    }
}

</script>