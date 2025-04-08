// Price chart configuration
let priceChart;
let priceHistory = [];
const MAX_HISTORY = 24; // Store last 24 data points (12 hours with 30-min updates)

// Authentication
let identity;
let principal;

// Blog functionality
let blogPosts = [];

function initializePriceChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Raven Token Price (ICP)',
                data: [],
                borderColor: '#9400D3',
                backgroundColor: 'rgba(148, 0, 211, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(26, 32, 44, 0.9)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#9400D3',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(148, 0, 211, 0.1)'
                    },
                    ticks: {
                        color: '#FFFFFF'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(148, 0, 211, 0.1)'
                    },
                    ticks: {
                        color: '#FFFFFF'
                    }
                }
            }
        }
    });
}

function updatePriceChart(priceData) {
    const timestamp = new Date(priceData.timestamp);
    const timeLabel = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add new data point
    priceHistory.push({
        time: timeLabel,
        price: priceData.price
    });
    
    // Keep only the last MAX_HISTORY points
    if (priceHistory.length > MAX_HISTORY) {
        priceHistory.shift();
    }
    
    // Update chart
    priceChart.data.labels = priceHistory.map(point => point.time);
    priceChart.data.datasets[0].data = priceHistory.map(point => point.price);
    priceChart.update();
    
    // Update price display
    document.querySelector('.current-price').textContent = `${priceData.price} ICP`;
    document.querySelector('.last-update').textContent = `Last updated: ${timeLabel}`;
}

async function initAuth() {
    try {
        identity = await window.identity.createIdentity();
        const authClient = await window.identity.createAuthClient();
        
        if (await authClient.isAuthenticated()) {
            principal = authClient.getIdentity().getPrincipal();
            updateAuthUI(true);
        }
    } catch (error) {
        console.error('Auth initialization failed:', error);
    }
}

function updateAuthUI(isAuthenticated) {
    const loginButton = document.getElementById('loginButton');
    const userPrincipal = document.getElementById('userPrincipal');
    const adminSection = document.getElementById('admin');
    
    if (isAuthenticated) {
        loginButton.classList.add('hidden');
        userPrincipal.classList.remove('hidden');
        userPrincipal.textContent = `Principal: ${principal.toText()}`;
        adminSection.classList.remove('hidden');
    } else {
        loginButton.classList.remove('hidden');
        userPrincipal.classList.add('hidden');
        adminSection.classList.add('hidden');
    }
}

document.getElementById('loginButton').addEventListener('click', async () => {
    try {
        const authClient = await window.identity.createAuthClient();
        await authClient.login({
            identityProvider: 'https://identity.ic0.app',
            onSuccess: () => {
                principal = authClient.getIdentity().getPrincipal();
                updateAuthUI(true);
            }
        });
    } catch (error) {
        console.error('Login failed:', error);
    }
});

async function loadBlogPosts() {
    try {
        const response = await fetch('/api/posts');
        blogPosts = await response.json();
        displayBlogPosts();
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

function displayBlogPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    blogGrid.innerHTML = '';
    
    blogPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-post';
        postElement.innerHTML = `
            <img src="${post.image || 'placeholder.jpg'}" alt="${post.title}">
            <h3>${post.title}</h3>
            <p>${post.content.substring(0, 150)}...</p>
            <div class="post-meta">
                <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                <a href="#" class="read-more">Read More</a>
            </div>
        `;
        blogGrid.appendChild(postElement);
    });
}

document.getElementById('createPostButton').addEventListener('click', () => {
    const postForm = document.getElementById('postForm');
    postForm.classList.toggle('hidden');
});

document.getElementById('submitPost').addEventListener('click', async () => {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const image = document.getElementById('postImage').value;
    
    if (!title || !content) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                content,
                image,
                date: new Date().toISOString(),
                author: principal.toText()
            })
        });
        
        if (response.ok) {
            document.getElementById('postForm').classList.add('hidden');
            document.getElementById('postTitle').value = '';
            document.getElementById('postContent').value = '';
            document.getElementById('postImage').value = '';
            await loadBlogPosts();
        } else {
            throw new Error('Failed to create post');
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
    }
});

// Initialize chart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializePriceChart();
    initAuth();
    fetchPriceData();
    loadBlogPosts();
    setInterval(fetchPriceData, 1800000); // 30 minutes
});

async function fetchPriceData() {
    try {
        const response = await fetch('token_price.json');
        const priceData = await response.json();
        updatePriceChart(priceData);
    } catch (error) {
        console.error('Error fetching price data:', error);
    }
} 