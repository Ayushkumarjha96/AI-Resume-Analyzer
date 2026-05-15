
const fs = require("fs");
const pdfParse = require("pdf-parse");

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

/* STORAGE CONFIGURATION */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

/* SKILLS LIST */

const skillsList = [
    "react",
    "nodejs",
    "mongodb",
    "express",
    "javascript",
    "python",
    "java",
    "c++",
    "machine learning",
    "html",
    "css",
    "mysql"
];

/* REQUIRED SKILLS FOR ATS */

const requiredSkills = [
    "react",
    "nodejs",
    "mongodb",
    "javascript",
    "python"
];

/* HOME ROUTE */

app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

/* UPLOAD + ANALYZE ROUTE */

app.post("/upload", upload.single("resume"), async (req, res) => {

    try {

        const filePath = req.file.path;

        const dataBuffer = fs.readFileSync(filePath);

        const pdfData = await pdfParse(dataBuffer);

        const resumeText = pdfData.text.toLowerCase();

        /* SKILL DETECTION */

        const detectedSkills = [];

        skillsList.forEach((skill) => {

            if (resumeText.includes(skill)) {
                detectedSkills.push(skill);
            }

        });

        /* ATS SCORE */

        let matchedSkills = 0;

        requiredSkills.forEach((skill) => {

            if (detectedSkills.includes(skill)) {
                matchedSkills++;
            }

        });

        const atsScore = Math.round(
            (matchedSkills / requiredSkills.length) * 100
        );

        /* IMPROVEMENT SUGGESTIONS */

        const suggestions = [];

        requiredSkills.forEach((skill) => {

            if (!detectedSkills.includes(skill)) {
                suggestions.push(`Add ${skill} skill to improve ATS score`);
            }

        });

        if (atsScore < 70) {
            suggestions.push("Add more technical projects");
            suggestions.push("Improve your resume summary section");
        }

        console.log("Detected Skills:", detectedSkills);
        console.log("ATS Score:", atsScore);

        res.json({
            message: "Resume analyzed successfully",
            extractedText: pdfData.text,
            skills: detectedSkills,
            atsScore: atsScore,
            suggestions: suggestions
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error extracting PDF text"
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
