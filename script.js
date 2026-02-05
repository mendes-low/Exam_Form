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

const tasks = [
    "Екі функция жазу addBook(title, author, section, year) және removeBookByName(title)",
    "changeLibraryName(newName) және changeLibraryRating(newRating)",
    "3 функция жазу керек addSection(sectionName), removeSection(sectionName)",
    "section атын өзгертуге арналған функция жазу renameSection(oldName, newName)",
    "Ең ескі кітәпті қайтаратын функция жазу getOldestBook()",
];

const codeTasksContainer = document.getElementById("code-tasks");
for (let i = 0; i < tasks.length; i++) {
    const label = document.createElement("label");
    label.textContent = `Task ${i}: ${tasks[i]}`;
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
        const value = editor.getValue();
        editor.setValue(value.replace(/\r\n|\n|\r/g, ""), -1);
        alert("Қай жерден алдын ? АААААА");
    });

    editor.container.addEventListener("copy", function (e) {
        e.preventDefault();
        alert("Не істейсін оны копировать етіп? АААААА");
    });

    editor.commands.addCommand({
        name: "blockPaste",
        bindKey: { win: "Ctrl-V", mac: "Command-V" },
        exec: function () {
            alert("Қай жерден алдын ? ААААА");
        },
        readOnly: false,
    });

    editor.commands.addCommand({
        name: "blockCopy",
        bindKey: { win: "Ctrl-C", mac: "Command-C" },
        exec: function () {
            alert("Не істейсін оны копировать етіп? ААААААА");
        },
        readOnly: false,
    });
}

document.getElementById("submitButton").addEventListener("click", async () => {
    const testAnswers = [];
    for (let i = 1; i <= 6; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        testAnswers.push(selected ? selected.value : null);
    }

    const codeAnswers = [];
    for (let i = 0; i < tasks.length; i++) {
        if (editors["code" + i]) {
            codeAnswers.push(editors["code" + i].getValue());
        } else {
            codeAnswers.push("");
        }
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

const questions = [
    {
        text: "Decstructuring не үшін қажет ?",
        options: [
            "Массивті распаковка жасау үшін",
            "Объектті распаковка жасау үшін.",
            "Массив пен Объекттен элементтерін бөлек айнымалы ретінде алу",
            "Объект пен Массивты распаковка жасау үшін",
        ],
    },
    {
        text: "Осы код нені шығарады const [productName = 'iPhone', price = 1000] = ['MacBook', '500'] console.log(productName)",
        options: ["IPhone", "''", "Қате", "500", "MacBook", "IPhoneMAcBook"],
    },
    {
        text: "Функциянын қанша негізгі түрі бар ?",
        options: ["2", "1", "Функциянын түрлері жоқ", "3"],
    },
    {
        text: "Object та қандай типтер сақтауға болады?",
        options: [
            "Boolean, array, object, number, string",
            "null, function, array, number, boolean, string",
            "undefined, null, number, function, array, string, boolean, object",
            "function, string, number, boolean, array, object, null",
        ],
    },
    {
        text: "object қай форматта құралады ?",
        options: ["property value", "key value", "key property", "index value"],
    },
    {
        text: "JavaScript қанша данный типтері бар?",
        options: ["5", "7", "4", "6", "8"],
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
