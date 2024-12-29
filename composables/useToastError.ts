export const useToastError = (title: string, description: string) => {
  const toast = useToast();
  return toast.add({
    title: title,
    description: description,
    icon: "i-heroicons-x-circle",
    color: "red",
  });
};
