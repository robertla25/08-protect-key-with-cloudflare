// Get references to the HTML elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Initialize an array to keep track of the conversation history
let messages = [
  { role: 'system', content: `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination.

  If a user's query is unrelated to budget travel, respond by stating that you do not know.`}
];

// Add event listener to the form
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from submitting the traditional way
  responseContainer.textContent = 'Thinking...'; // Display a loading message

  // Add the user's message to the conversation history
  messages.push({ role: 'user', content: userInput.value });

  try {
    // Send a POST request to the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', // We are POST-ing data to the API
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_completion_tokens: 800,
        temperature: 0.5,
        frequency_penalty: 0.8,
      })
    });

    // Check if the response is not ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse and store the response data
    const result = await response.json();

    // Add the AI's response to the conversation history
    messages.push({ role: 'assistant', content: result.choices[0].message.content });

    // Display the response on the page
    responseContainer.textContent = result.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error); // Log the error
    responseContainer.textContent = 'Sorry, something went wrong. Please try again later.'; // Show error message to the user
  }

  // Clear the input field
  userInput.value = '';
});