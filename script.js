import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    doc,
    setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDRlfA-pkyXdtOXxzH6w2HEVZHIcwEs-cg",
    authDomain: "examform-bb0f4.firebaseapp.com",
    projectId: "examform-bb0f4",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const studentsByClass = {
    "26_1": [
        "Рабия",
        "Ислам",
        "Ерасыл",
        "Нұрасыл",
        "Файзулла",
        "Дарын",
        "Алуа",
        "Ермек",
        "Жантөре",
        "Рамазан",
        "Ақжайық",
    ],
    "26_4": [
        "Жанарыс",
        "Мадияр",
        "Аружан",
        "Адил",
        "Абдкрахман",
        "Мирас",
        "Асыл",
        "Әдемі",
        "Бақтұрсын",
        "Елдос",
        "Әділ",
        "Жақсымұрат",
    ],
};

const classSelect = document.getElementById("classSelect");
const nameSelect = document.getElementById("nameSelect");
classSelect.addEventListener("change", () => {
    const cls = classSelect.value;
    nameSelect.innerHTML = '<option value="">Select student</option>';
    if (studentsByClass[cls]) {
        studentsByClass[cls].forEach((name) => {
            const opt = document.createElement("option");
            opt.value = name;
            opt.textContent = name;
            nameSelect.append(opt);
        });
    }
});

const editors = {};
const codeTasksContainer = document.getElementById("code-tasks");
for (let i = 1; i <= 5; i++) {
    const label = document.createElement("label");
    label.textContent = `Task ${i}`;
    const div = document.createElement("div");
    div.id = "code" + i;
    div.className = "editor";
    codeTasksContainer.append(label);
    codeTasksContainer.append(div);

    const editor = ace.edit(div.id);
    editors["code" + i] = editor;
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
    editor.setOptions({ fontSize: "14pt", tabSize: 2, useSoftTabs: true });

    editor.on("paste", function (text) {
        setTimeout(() => {
            const value = editor.getValue();
            editor.setValue(value.replace(/\r\n|\n|\r/g, ""), -1);
            alert("Pasting is disabled!");
        }, 0);
    });

    editor.container.addEventListener("copy", function (e) {
        e.preventDefault();
        alert("Copying is disabled!");
    });

    editor.commands.addCommand({
        name: "blockPaste",
        bindKey: { win: "Ctrl-V", mac: "Command-V" },
        exec: function () {
            alert("Pasting is disabled!");
        },
        readOnly: false,
    });
    editor.commands.addCommand({
        name: "blockCopy",
        bindKey: { win: "Ctrl-C", mac: "Command-C" },
        exec: function () {
            alert("Copying is disabled!");
        },
        readOnly: false,
    });
}

document.getElementById("submitButton").addEventListener("click", async () => {
    const testAnswers = [];
    for (let i = 1; i <= 10; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        testAnswers.push(selected ? selected.value : null);
    }

    const codeAnswers = [];
    for (let i = 1; i <= 5; i++) {
        codeAnswers.push(editors["code" + i].getValue());
    }

    const docId = `${classSelect.value}_${nameSelect.value}`;
    try {
        await setDoc(doc(db, "answers", docId), {
            class: classSelect.value,
            name: nameSelect.value,
            testAnswers,
            codeAnswers,
            submittedAt: new Date(),
        });
        alert("Exam submitted successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to submit exam");
    }
});

//
const questions = [
    {
        text: "What does HTML stand for?",
        options: [
            "HyperText Markup Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language",
        ],
    },
    {
        text: "Which is a JavaScript framework?",
        options: ["React", "HTML", "CSS"],
    },
    {
        text: "Which keyword declares a variable?",
        options: ["let", "func", "dim"],
    },
    {
        text: "Which tag is for JavaScript?",
        options: ["<script>", "<js>", "<javascript>"],
    },
    {
        text: "What is CSS used for?",
        options: ["Styling web pages", "Storing data", "Running JavaScript"],
    },
    {
        text: "Which HTML element is used for the largest heading?",
        options: ["<h1>", "<h6>", "<header>"],
    },
    {
        text: "What does DOM stand for?",
        options: [
            "Document Object Model",
            "Data Object Management",
            "Digital Order Method",
        ],
    },
    {
        text: "Which method converts JSON to JavaScript object?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()"],
    },
    {
        text: "Which operator is used for strict equality?",
        options: ["===", "==", "!="],
    },
    {
        text: "Which property changes text color in CSS?",
        options: ["color", "background-color", "font-style"],
    },
];

const testsDiv = document.getElementById("tests");

questions.forEach((q, index) => {
    const label = document.createElement("label");
    label.textContent = `${index + 1}. ${q.text}`;
    testsDiv.appendChild(label);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    q.options.forEach((opt, i) => {
        const optionLabel = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `q${index + 1}`;
        radio.value = opt;
        optionLabel.append(radio);
        optionLabel.append(" " + opt);
        optionsDiv.append(optionLabel);
    });

    testsDiv.append(optionsDiv);
});
