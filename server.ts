import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./router.ts";

const PORT = Deno.env.get("PORT") || 8000;

const app = new Application();

app.use(router.routes());

app.use(router.allowedMethods());

console.log(`server running on ${PORT}`);

app.listen({ port: +PORT });
