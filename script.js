// Mobile menu toggle
document.querySelector('.mobile-menu').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Bento item highlighting
document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('highlighted');
    });
});

// Load blog posts
async function loadBlogPosts() {
    try {
        const response = await fetch('articles/summary.json');
        const articles = await response.json();
        
        const blogGrid = document.querySelector('.blog-grid');
        
        articles.forEach(article => {
            const post = document.createElement('div');
            post.className = 'blog-post';
            
            // Create post content
            post.innerHTML = `
                <h3>${article.title}</h3>
                <div class="date">${article.date}</div>
                <div class="excerpt">${article.excerpt}</div>
                <a href="articles/${article.slug}/content.txt" class="read-more">Read More</a>
            `;
            
            blogGrid.appendChild(post);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
}); 