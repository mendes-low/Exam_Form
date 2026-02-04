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

    const res = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message);
}
