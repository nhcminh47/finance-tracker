<template>
    <UCard>
        <template #header>
            Sign-in to Finance Tracker
        </template>
        <UForm :state="state" ref="form" @submit.prevent="login">
            <UFormGroup label="Email" name="email" class="mb-4" :required="true" help="Please enter your email">
                <UInput type="email" placeholder="Email" required v-model="state.email" />
            </UFormGroup>
            <UFormGroup label="Password" name="password" class="mb-4" :required="true"
                help="Please enter your password">
                <UInput type="password" placeholder="Password" required v-model="state.password" />
            </UFormGroup>
            <UButton type="submit" variant="solid" color="white" label="Sign-in" :loading="isLoading" />
            <UButton type="button" variant="solid" color="white" label="Reset" @click="resetForm" />
        </UForm>
        <UAlert title="Sign in sucessfully" icon="i-heroicons-check-circle" class="mt-4" color="green" v-if="sucess" />
    </UCard>

</template>
<script setup>

const toast = useToast()
const form = ref()
const isLoading = ref(false)
const sucess = ref(false)
const initialState = {
    email: undefined,
    password: undefined
}
const state = ref({ ...initialState })
const resetForm = () => {
    Object.assign(state.value, initialState)
    form.value.clear()
}

const login = async () => {

    if (form.value.errors.length > 0) return
    try {
        isLoading.value = true
        const { data, error } = await useSupabaseClient().auth.signInWithPassword({
            email: state.value.email,
            password: state.value.password,
        })
        if (error) throw error
        sucess.value = true
        nextTick(() => {
            setTimeout(() => {
                navigateTo('/')
            }, 1000)
        })
    } catch (error) {
        toast.add({
            title: "Login Failed",
            description: error.message,
            color: 'red',
            icon: "i-heroicons-x-circle",
        })
        isLoading.value = false
    } finally {
        isLoading.value = false
    }

}
</script>