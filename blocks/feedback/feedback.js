export default function decorate(block) {
  // Get the endpoint URL from the block content
  const endpoint = block.textContent.trim();

  // Clear the block
  block.textContent = '';

  // Create the feedback container
  const container = document.createElement('div');
  container.classList.add('feedback-container');

  // Create the question text
  const question = document.createElement('span');
  question.classList.add('feedback-question');
  question.textContent = 'Was this information helpful?';

  // Create buttons container
  const buttons = document.createElement('div');
  buttons.classList.add('feedback-buttons');

  // Create Yes button
  const yesBtn = document.createElement('button');
  yesBtn.classList.add('feedback-btn', 'feedback-yes');
  yesBtn.textContent = 'Yes';
  yesBtn.type = 'button';

  // Create No button
  const noBtn = document.createElement('button');
  noBtn.classList.add('feedback-btn', 'feedback-no');
  noBtn.textContent = 'No';
  noBtn.type = 'button';

  // Create thank you message (hidden initially)
  const thankYou = document.createElement('div');
  thankYou.classList.add('feedback-thankyou');
  thankYou.textContent = 'Thank you for your feedback!';
  thankYou.style.display = 'none';

  // Add click handlers
  const handleFeedback = async (response) => {
    try {
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            helpful: response,
            page: window.location.pathname,
          }),
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Feedback submission failed:', e);
    }

    // Show thank you message
    container.style.display = 'none';
    thankYou.style.display = 'block';
  };

  yesBtn.addEventListener('click', () => handleFeedback('yes'));
  noBtn.addEventListener('click', () => handleFeedback('no'));

  // Assemble the component
  buttons.appendChild(yesBtn);
  buttons.appendChild(noBtn);
  container.appendChild(question);
  container.appendChild(buttons);
  block.appendChild(container);
  block.appendChild(thankYou);
}
