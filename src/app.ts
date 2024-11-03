import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";

const app = createApp();

configureOpenAPI(app);

app.route("/", (c) =>{
    return c.json({message:'Hello'})
});


export default app;