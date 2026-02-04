import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDRlfA-pkyXdtOXxzH6w2HEVZHIcwEs-cg",
    authDomain: "examform-bb0f4.firebaseapp.com",
    projectId: "examform-bb0f4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("examForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const testAnswers = [];
    for (let i = 1; i <= 5; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        testAnswers.push(selected ? selected.value : null);
    }

    const codeAnswers = [];
    for (let i = 1; i <= 5; i++) {
        codeAnswers.push(form[`code${i}`].value || "");
    }

    const data = {
        name: form.name.value,
        class: form.class.value,
        testAnswers,
        codeAnswers,
        submittedAt: new Date(),
    };

    try {
        await addDoc(collection(db, "answers"), data);
        alert("Exam submitted successfully");
        form.reset();
    } catch (error) {
        console.error(error);
        alert("Failed to submit exam");
    }
});
