function renderNewsPage() {
  const featured = document.getElementById('newsFeatured');
  const timeline = document.getElementById('newsTimeline');
  if (!featured || !timeline || !Array.isArray(newsItems) || newsItems.length === 0) return;

  const [latest, ...rest] = newsItems;
  featured.innerHTML = `
    <a class="news-feature-card" href="${latest.url}" target="_blank" rel="noopener">
      <div class="news-feature-image">
        <img src="${latest.image}" alt="${latest.title}" loading="lazy">
      </div>
      <div class="news-feature-body">
        <h2>${latest.title}</h2>
      </div>
    </a>
  `;

  timeline.innerHTML = rest.map((item) => `
    <a class="news-timeline-item fade-up" href="${item.url}" target="_blank" rel="noopener">
      <div class="news-node" aria-hidden="true"></div>
      <article class="news-card">
        <div class="news-thumb">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="news-card-body">
          <h3>${item.title}</h3>
          <span class="news-card-link">查看详情</span>
        </div>
      </article>
    </a>
  `).join('');
}
