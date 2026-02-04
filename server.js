import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


const FILE = "./answers.json";

app.post("/submit", (req, res) => {
    const newAnswer = {
        ...req.body,
        submittedAt: new Date().getDate(),
    };

    let data = [];

    if (fs.existsSync(FILE)) {
        data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    }

    data.push(newAnswer);
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    res.json({ message: "Exam saved successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
