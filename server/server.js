const express = require("express");
const dotenv = require("dotenv");
const connectionDB = require("./config/dbConnection");
const userRoute = require("./routes/userRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const dashBoardRoute = require("./routes/dashBoardRoute");
const app = express();

app.use(express.json());

dotenv.config({path: "./server/config.env"}); 
const PORT = process.env.PORT || 8000;

connectionDB();

app.use("/api/users", userRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/dashBoard", dashBoardRoute);

// Deployment Code (Important)
const path = require("path");
__dirname = path.resolve();
if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})