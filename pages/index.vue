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
        <Trend color="green" amount="4000" last-amount="5000" :loading="false" title="Income" />
        <Trend color="red" amount="4000" last-amount="3500" :loading="false" title="Outcome" />
        <Trend color="green" amount="4000" last-amount="7000" :loading="false" title="Invest" />
        <Trend color="red" amount="4000" last-amount="2045" :loading="false" title="Saving" />
    </section>
    <section>
        <Transaction />
        <Transaction />
        <Transaction />
        <Transaction />
    </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constant';
const selectedView = ref(transactionViewOptions[1])
</script>