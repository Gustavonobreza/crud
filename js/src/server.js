const app = require("./app");

const PORT = parseInt(process.env.PORT) || 3000;

app.listen(3000, () => console.log(`🔥 Server running in http://localhost:${PORT} 🔥`));
