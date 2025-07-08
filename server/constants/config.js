

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        process.env.CLIENT_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    origin: ["http://localhost:5173" , "http://localhost:4173" , process.env.CLIENT_URL],
    credentials: true,
};

const CHATIFY_TOKEN = "chatify-token";

export {
    corsOptions,
    CHATIFY_TOKEN
}