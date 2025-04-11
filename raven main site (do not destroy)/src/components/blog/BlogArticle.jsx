import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogArticle.css';

// Import reusable components
import Image from '../Image/Image';
import SocialShare from './SocialShare';
import BlogCategories from './BlogCategories';
import RelatedArticles from './RelatedArticles';
import TemplateSelector from './templates/TemplateSelector';

/**
 * BlogArticle component
 * Displays a single blog article based on the slug from URL parameters
 */
const BlogArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useTemplate, setUseTemplate] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual API call when backend is ready
        // For now, use a mock article based on the slug
        // This would normally be an API call like:
        // const response = await fetch(`/api/articles/${slug}`);
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if we should use templates (based on URL parameter or storage)
        const urlParams = new URLSearchParams(window.location.search);
        const templateParam = urlParams.get('template');
        
        // Set useTemplate based on URL parameter or localStorage setting
        if (templateParam !== null) {
          const useTemplateValue = templateParam === 'true' || templateParam === '1';
          setUseTemplate(useTemplateValue);
          localStorage.setItem('useArticleTemplates', useTemplateValue.toString());
        } else {
          // Check localStorage for saved preference
          const savedPreference = localStorage.getItem('useArticleTemplates');
          setUseTemplate(savedPreference === 'true');
        }
        
        // Mock article data
        const mockArticle = {
          id: slug === 'tether-ing-to-reality' 
            ? 'tether-ing-to-reality'
            : slug === 'hot-off-the-blockchain'
              ? 'hot-off-the-blockchain'
              : 'dfinity-destination',
          slug,
          title: slug === 'tether-ing-to-reality' 
            ? 'Tether-ing to Reality' 
            : slug === 'hot-off-the-blockchain' 
              ? 'Hot Off The Blockchain Press'
              : 'Our Dfinity Destination',
          featuredImage: slug === 'tether-ing-to-reality' 
            ? '/images/tether-article.webp' 
            : slug === 'hot-off-the-blockchain'
              ? '/images/doms-pizza.webp'
              : '/images/dfinity-article.webp',
          publishedDate: new Date().toLocaleDateString(),
          date: new Date().toISOString(),
          author: 'Raven',
          category: 'Crypto News',
          content: `
            <p>This is a mock article content for "${slug}". In the real implementation, this would be the full article content loaded from the API.</p>
            <p>The article discusses the latest developments in the crypto world, investigating the truth behind the scenes, and providing valuable insights to readers.</p>
            <h2>Investigative Journalism</h2>
            <p>Raven's mission is to uncover the truth in the crypto space, offering unbiased reports on projects, market trends, and emerging technologies.</p>
            <p>With a careful eye for detail and a commitment to fact-checking, Raven ensures that readers get the most accurate information possible.</p>
            <h2>Market Analysis</h2>
            <p>Beyond just reporting news, Raven dives deep into market analysis, examining the underlying factors that drive price movements and adoption.</p>
            <p>By combining technical analysis with fundamental research, Raven provides a comprehensive view of the crypto landscape.</p>
          `,
          categories: ['Blockchain', 'Investigation', 'Crypto'],
          tags: ['Internet Computer', 'Dfinity', 'Blockchain', 'Cryptocurrency'],
          excerpt: 'Exploring the truth behind the crypto market and uncovering insights that matter.',
          image: slug === 'tether-ing-to-reality' 
            ? '/images/tether-article.webp' 
            : slug === 'hot-off-the-blockchain'
              ? '/images/doms-pizza.webp'
              : '/images/dfinity-article.webp',
          readTime: 5,
          // Additional properties for template-based rendering
          template: slug === 'tether-ing-to-reality' 
            ? 'news'
            : slug === 'hot-off-the-blockchain'
              ? 'feature'
              : 'analysis',
          imageCaption: 'Image caption for the featured image',
          abstract: slug === 'our-dfinity-destination-' 
            ? 'A detailed analysis of the Dfinity ecosystem and its potential impact on the blockchain industry.' 
            : null,
          subtitle: slug === 'hot-off-the-blockchain' 
            ? 'The surprising story behind the viral DOMS token launch' 
            : null,
          references: slug === 'our-dfinity-destination-' 
            ? ['Dfinity Foundation. (2023). Internet Computer Protocol.', 
               'Smith, J. (2023). The Future of Blockchain Technology.'] 
            : null,
          leadIn: slug === 'hot-off-the-blockchain' 
            ? 'In the fast-paced world of cryptocurrency, few stories have captured the community\'s attention quite like the meteoric rise of DOMS token.' 
            : null
        };
        
        setArticle(mockArticle);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return <div className="article-loading">Loading article...</div>;
  }

  if (error) {
    return <div className="article-error">{error}</div>;
  }

  if (!article) {
    return <div className="article-not-found">Article not found</div>;
  }

  // Toggle template view
  const toggleTemplateView = () => {
    const newValue = !useTemplate;
    setUseTemplate(newValue);
    localStorage.setItem('useArticleTemplates', newValue.toString());
  };

  // If using templates, render with TemplateSelector
  if (useTemplate) {
    return (
      <div className="blog-article-container template-view">
        <div className="template-controls">
          <button className="toggle-template-btn" onClick={toggleTemplateView}>
            Switch to Classic View
          </button>
        </div>
        
        <TemplateSelector article={article} />
        
        <div className="article-navigation">
          <Link to="/blog" className="back-to-blog">
            ← Back to all articles
          </Link>
        </div>
        
        <RelatedArticles currentArticle={article} limit={3} />
      </div>
    );
  }

  // Classic view (original implementation)
  return (
    <div className="blog-article-container">
      <div className="template-controls">
        <button className="toggle-template-btn" onClick={toggleTemplateView}>
          Switch to Template View
        </button>
      </div>
      
      <div className="blog-article">
        <div className="article-header">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span className="article-date">{article.publishedDate}</span>
            <span className="article-author">By {article.author}</span>
          </div>
          
          <div className="article-categories">
            {article.categories.map(category => (
              <Link 
                key={category} 
                to={`/blog?category=${category.toLowerCase()}`} 
                className="article-category"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="article-featured-image">
          <Image
            src={article.featuredImage}
            alt={article.title}
            width={1200}
            height={675}
            className="featured-image"
          />
        </div>
        
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        {/* Social Share Component */}
        <SocialShare 
          url={window.location.href}
          title={article.title}
          description={article.excerpt}
          hashtags={article.tags}
        />
        
        <div className="article-tags">
          {article.tags.map(tag => (
            <Link 
              key={tag} 
              to={`/blog?tag=${tag.toLowerCase()}`} 
              className="article-tag"
            >
              #{tag}
            </Link>
          ))}
        </div>
        
        {/* Related Articles Component */}
        <RelatedArticles currentArticle={article} limit={3} />
        
        <div className="article-navigation">
          <Link to="/blog" className="back-to-blog">
            ← Back to all articles
          </Link>
        </div>
      </div>
      
      {/* Sidebar */}
      <aside className="blog-sidebar">
        <div className="sidebar-sticky">
          <BlogCategories 
            activeCategory={article.categories[0]?.toLowerCase()}
          />
          
          <div className="sidebar-author">
            <h3>About the Author</h3>
            <div className="author-info">
              <div className="author-image">
                <Image
                  src="/images/raven-banner.webp"
                  alt="Raven"
                  width={80}
                  height={80}
                />
              </div>
              <div className="author-details">
                <h4>Raven</h4>
                <p>Investigative journalist in the crypto world, uncovering secrets with mystical powers and sharp wit.</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default BlogArticle; 