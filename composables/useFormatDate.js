export const useFormatDate = (date) => {
  console.log(date);

  const dateFormated = computed(() =>
    new Date(isRef(date) ? date.value : date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  );
  return {
    date: dateFormated,
  };
};
