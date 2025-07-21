// Get references to the HTML elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Initialize an array to keep track of the conversation history
let messages = [
  { role: 'system', content: `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination.

  If a user's query is unrelated to budget travel, respond by stating that you do not know.`}
];

// REPLACE with your actual Cloudflare Worker URL
const workerUrl = 'https://wanderbot-worker.robertalamo.workers.dev';

// Add event listener to the form
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from submitting the traditional way
  responseContainer.textContent = 'Thinking...'; // Display a loading message

  // Add the user's message to the conversation history
  messages.push({ role: 'user', content: userInput.value });

  try {
    // Send a POST request to your Cloudflare Worker
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    // Check if the response is not ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response from the Cloudflare Worker
    const result = await response.json();

    // Get the reply from OpenAI's response structure
    const replyText = result.choices[0].message.content;

    // Add the Worker's response to the conversation history
    messages.push({ role: 'assistant', content: replyText });

    // Display the response on the page
    responseContainer.textContent = replyText;
  } catch (error) {
    console.error('Error:', error); // Log the error
    responseContainer.textContent = 'Sorry, something went wrong. Please try again later.'; // Show error message to the user
  }

  // Clear the input field
  userInput.value = '';
});