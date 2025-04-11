import React from 'react';
import PropTypes from 'prop-types';
import Image from '../../Image/Image';
import './ArticleTemplates.css';

/**
 * FeatureTemplate component
 * A template for long-form feature articles with storytelling elements
 * Includes space for multiple images, pull quotes, and a more narrative structure
 */
const FeatureTemplate = ({ article }) => {
  if (!article) return null;

  // Parse content to find pull quotes (text between triple backticks)
  const contentWithoutPullQuotes = article.content.replace(/```(.*?)```/gs, '');
  const pullQuotesMatch = article.content.match(/```(.*?)```/gs);
  const pullQuotes = pullQuotesMatch 
    ? pullQuotesMatch.map(quote => quote.replace(/```/g, '').trim()) 
    : [];

  // Split content into paragraphs
  const paragraphs = contentWithoutPullQuotes.split('\n\n').filter(p => p.trim().length > 0);
  
  // For feature articles, preserve any paragraph starting with > as a note or highlight
  const contentElements = paragraphs.map((paragraph, index) => {
    if (paragraph.startsWith('>')) {
      return (
        <blockquote key={index} className="feature-highlight">
          {paragraph.substring(1).trim()}
        </blockquote>
      );
    } else if (paragraph.startsWith('#')) {
      // Handle headings
      const level = paragraph.match(/^#+/)[0].length;
      const text = paragraph.replace(/^#+\s*/, '');
      
      switch(level) {
        case 1:
          return <h1 key={index} className="feature-heading">{text}</h1>;
        case 2:
          return <h2 key={index} className="feature-heading">{text}</h2>;
        case 3:
          return <h3 key={index} className="feature-heading">{text}</h3>;
        default:
          return <h4 key={index} className="feature-heading">{text}</h4>;
      }
    } else {
      return <p key={index}>{paragraph}</p>;
    }
  });

  // Insert pull quotes at reasonable intervals
  if (pullQuotes.length > 0) {
    const interval = Math.floor(contentElements.length / (pullQuotes.length + 1));
    
    pullQuotes.forEach((quote, index) => {
      const position = interval * (index + 1);
      if (position < contentElements.length) {
        contentElements.splice(position, 0, (
          <div key={`pull-quote-${index}`} className="pull-quote">
            <blockquote>
              {quote}
            </blockquote>
          </div>
        ));
      }
    });
  }

  return (
    <article className="article-template feature-template">
      <div className="template-header feature-header">
        <div className="template-meta">
          <span className="template-category">{article.category}</span>
          <span className="template-date">
            {new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        
        <h1 className="template-title feature-title">{article.title}</h1>
        
        {article.subtitle && (
          <h2 className="feature-subtitle">{article.subtitle}</h2>
        )}
        
        <div className="template-author feature-author">
          <span>By {article.author}</span>
          <span className="read-time">{article.readTime} min read</span>
        </div>
      </div>
      
      <div className="template-featured-image feature-hero-image">
        <Image
          src={article.image}
          alt={article.title}
          width={1200}
          height={675}
          className="featured-image"
        />
        {article.imageCaption && (
          <figcaption className="image-caption">{article.imageCaption}</figcaption>
        )}
      </div>
      
      {article.leadIn && (
        <div className="feature-lead-in">
          <p>{article.leadIn}</p>
        </div>
      )}
      
      <div className="template-content feature-content">
        {contentElements}
      </div>
      
      {article.additionalImages && article.additionalImages.length > 0 && (
        <div className="feature-gallery">
          <h3>Gallery</h3>
          <div className="gallery-grid">
            {article.additionalImages.map((img, index) => (
              <figure key={index} className="gallery-item">
                <Image
                  src={img.src}
                  alt={img.alt || `Image ${index + 1}`}
                  width={400}
                  height={300}
                />
                {img.caption && (
                  <figcaption>{img.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
      
      {article.relatedContent && (
        <div className="feature-related-content">
          <h3>Related</h3>
          <div className="related-content">
            {article.relatedContent}
          </div>
        </div>
      )}
      
      <div className="feature-author-bio">
        <h3>About the Author</h3>
        <div className="author-bio-content">
          <div className="author-image">
            <Image
              src={article.authorImage || '/images/raven-banner.webp'}
              alt={article.author}
              width={100}
              height={100}
            />
          </div>
          <div className="author-bio">
            <h4>{article.author}</h4>
            <p>{article.authorBio || 'Investigative journalist in the crypto world, uncovering secrets with mystical powers and sharp wit.'}</p>
          </div>
        </div>
      </div>
      
      <div className="template-tags feature-tags">
        {article.tags.map(tag => (
          <span key={tag} className="template-tag">#{tag}</span>
        ))}
      </div>
    </article>
  );
};

FeatureTemplate.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    content: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageCaption: PropTypes.string,
    date: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    authorImage: PropTypes.string,
    authorBio: PropTypes.string,
    readTime: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    leadIn: PropTypes.string,
    additionalImages: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string,
        caption: PropTypes.string
      })
    ),
    relatedContent: PropTypes.node
  }).isRequired
};

export default FeatureTemplate; 