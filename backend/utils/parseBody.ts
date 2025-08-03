import { ObjectSchema } from "joi";

interface ParseBodyOptions<T> {
  event: any;
  schema?: ObjectSchema<T>;
}

export function parseBody<T = any>({
  event,
  schema,
}: ParseBodyOptions<T>): { value: T | null; error?: string } {
  if (!event || !event.body) {
    return { value: null, error: "Missing body" };
  }

  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;

    const parsed = JSON.parse(rawBody);

    if (schema) {
      const { error, value } = schema.validate(parsed, {
        abortEarly: false,
      });

      if (error) {
        return {
          value: null,
          error: error.details.map((d) => d.message).join(", "),
        };
      }
      return { value };
    }

    return { value: parsed };
  } catch (err) {
    console.error("Failed to parse body:", err);
    return { value: null, error: "Bad Request" };
  }
}
