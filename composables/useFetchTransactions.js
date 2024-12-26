export const useFetchTransactions = (period) => {
  const transactions = ref([]);
  const pending = ref(false);
  const income = computed(() =>
    transactions.value.filter((trans) => trans.type === "Income")
  );
  const expense = computed(() =>
    transactions.value.filter((trans) => trans.type === "Expense")
  );
  const incomeTotal = computed(() =>
    income.value.reduce((a, b) => Number(a) + Number(b.amount), 0)
  );
  const expenseTotal = computed(() =>
    expense.value.reduce((a, b) => Number(a) + Number(b.amount), 0)
  );
  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => income.value.length);
  const fetchTransactions = async () => {
    pending.value = true;
    try {
      const { data } = await $fetch("/api/transactions", {
        method: "POST",
        body: isRef(period) ? period.value : period,
      });
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      pending.value = false;
    }
  };
  const transactionGroupByDate = computed(() => {
    let groupData = {};
    for (const transaction of transactions.value) {
      const { date } = useFormatDate(transaction.created_at);
      if (!groupData[date.value]) {
        groupData[date.value] = [];
      }
      groupData[date.value].push(transaction);
    }
    return groupData;
  });
  const refresh = async () => (transactions.value = await fetchTransactions());
  watch(period, async () => await refresh());
  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionGroupByDate,
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount,
    },
    refresh,
    pending,
  };
};
