import supabase from "../utils/supabase";
import { H3Event } from "h3";
export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const { data, error } = await supabase
      .from("grouped_date")
      .select()
      .gte("created_at", body.from)
      .lte("created_at", body.to);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurs",
    };
  }
});
