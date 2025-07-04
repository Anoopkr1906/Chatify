

const corsOptions = {
    origin: ["http://localhost:5173" , "http://localhost:4173" , process.env.CLIENT_URL],
    credentials: true,
};

const CHATIFY_TOKEN = "chatify-token";

export {
    corsOptions,
    CHATIFY_TOKEN
}