async function submitExam() {
    const data = {
        name: document.getElementById("name").value,
        class: document.getElementById("class").value,
        testAnswers: [],
        codeAnswers: [],
    };

    for (let i = 1; i <= 5; i++) {
        const answer = document.querySelector(`input[name="q${i}"]:checked`);
        data.testAnswers.push(answer ? answer.value : null);
    }

    for (let i = 1; i <= 5; i++) {
        data.codeAnswers.push(document.getElementById(`code${i}`).value);
    }

    const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.message);
}

let button = document.querySelector("#submitButton");

button.addEventListener("click", () => {
    submitExam();
});
