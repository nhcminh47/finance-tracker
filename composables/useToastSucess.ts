export const useToastSucess = (title: string, description: string) => {
  const toast = useToast();
  return toast.add({
    title: title,
    description: description,
    icon: "i-heroicons-check-circle",
    color: "green",
  });
};
