const apiKey = 'SYyAuF9MyNUj2lmar1zTjWZcwnpcntG5vaezApRv';
const cardsContainer = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');

// Function to create and append a card element
function createCard(title, imgUrl, description) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${imgUrl}" alt="${title}">
    <h3>${title}</h3>
    <p>${description}</p>
  `;
  // On click, show details (simple alert for demo)
  card.onclick = () => {
    alert(title + '\n\n' + description);
  };
  cardsContainer.appendChild(card);
}

// Fetch the Astronomy Picture of the Day on load
window.addEventListener('load', () => {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      // Display the APOD as the first card
      createCard(data.title, data.url, data.explanation);
    });

  // Also fetch a default search (e.g., "space") to show additional cards
  fetchNASAImages('space');
});

// Function to fetch NASA Image/Video Library data
function fetchNASAImages(query) {
  // NASA's Image/Video API returns JSON; each item has data[0] and links[0]:contentReference[oaicite:11]{index=11}.
  fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`)
    .then(res => res.json())
    .then(data => {
      cardsContainer.innerHTML = ''; // clear existing cards
      // Loop through results and create cards
      data.collection.items.forEach(item => {
        const info = item.data[0];
        const link = item.links ? item.links[0] : null;
        const title = info.title || 'No Title';
        const desc = info.description || '';
        const imgUrl = link ? link.href : '';
        createCard(title, imgUrl, desc);
      });
    })
    .catch(err => console.error(err));
}

// Perform search when the user presses Enter
searchInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    const q = searchInput.value.trim();
    if (q) fetchNASAImages(q);
  }
});

// Topic buttons trigger searches
document.querySelectorAll('.topic-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const topic = btn.textContent;
    searchInput.value = topic;
    fetchNASAImages(topic);
  });
});
