chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'show_popup') {
    let selectedText = message.selectedText;
    if (selectedText.trim() === "") {
      document.getElementById("function-info").textContent = "Please select some code to analyze.";
      return;
    }

    // Show loading state
    document.getElementById("function-info").textContent = "Analyzing code...";

    // Call ChatGPT API to identify and explain the code
    analyzeCodeWithChatGPT(selectedText);
  }
});

function analyzeCodeWithChatGPT(selectedText) {
  const apiKey = 'YOUR_CHATGPT_API_KEY';  // Replace with your actual API key
  const apiEndpoint = 'https://api.openai.com/v1/completions';  // Use appropriate endpoint for your ChatGPT version

  const prompt = `
    Please analyze the following code snippet:
    1. Identify if it's valid code.
    2. Specify the programming language.
    3. Explain what the syntax is trying to accomplish.

    Code: 
    ${selectedText}
  `;

  fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',  // or gpt-3.5-turbo, depending on the model you're using
      prompt: prompt,
      max_tokens: 150,  // You can adjust the length based on the response you expect
      temperature: 0.7,  // Adjust temperature for creativity (higher = more creative)
    })
  })
  .then(response => response.json())
  .then(data => {
    const explanation = data.choices[0].text.trim();
    displayAnalysis(explanation);
  })
  .catch(error => {
    document.getElementById("function-info").textContent = "Error analyzing the code. Please try again.";
    console.error('Error calling ChatGPT API:', error);
  });
}

function displayAnalysis(explanation) {
  document.getElementById("function-info").textContent = explanation;
  
  // Add the start practice button with functionality
  const startPracticeButton = document.getElementById("start-practice");
  startPracticeButton.style.display = "block";  // Ensure the button is visible

  // When the user clicks the "Start Practice" button, show the practice logic
  startPracticeButton.onclick = () => {
    // You can add your practice functionality here, such as providing the user with questions
    promptUserForExercise();
  };
}

function promptUserForExercise() {
  // Example of how you can start a practice session with the user
  let userAnswer = prompt("What does this code do? Please describe its functionality.");
  
  // Call function to evaluate user response
  evaluateAnswer(userAnswer);
}

function evaluateAnswer(answer) {
  const correctAnswer = "This code defines a function that adds two numbers.";  // Example correct answer
  
  if (answer.toLowerCase().includes(correctAnswer.toLowerCase())) {
    alert("Great job! Your answer is correct.");
  } else {
    alert("Oops! That's not quite right. Try again.");
  }
}
