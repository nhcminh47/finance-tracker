export default defineNuxtRouteMiddleware((to, from) => {
  // isAuthenticated() is an example method verifying if a user is authenticated
  console.log(useSupabaseUser().value);

  if (!useSupabaseUser().value) {
    return navigateTo("/login");
  } else {
    return navigateTo("/");
  }
});
