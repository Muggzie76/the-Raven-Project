import React from 'react';
import PropTypes from 'prop-types';
import Image from '../../Image/Image';
import './ArticleTemplates.css';

/**
 * NewsTemplate component
 * A template for breaking news articles
 * Features a prominent featured image, highlighted key points,
 * and a structured layout optimized for news consumption
 */
const NewsTemplate = ({ article }) => {
  if (!article) return null;

  // Extract headline and summary from content if they exist
  const contentParagraphs = article.content.split('\n\n');
  const headline = contentParagraphs.length > 0 ? contentParagraphs[0] : '';
  const keyPoints = [];
  
  // Extract key points from content (paragraphs starting with • or * or "Key Point:")
  contentParagraphs.forEach(paragraph => {
    if (paragraph.startsWith('•') || 
        paragraph.startsWith('*') || 
        paragraph.toLowerCase().includes('key point:')) {
      keyPoints.push(paragraph.replace(/^[•*]\s*|^Key Point:\s*/i, ''));
    }
  });

  return (
    <article className="article-template news-template">
      <div className="template-header">
        <div className="template-meta">
          <span className="template-category">{article.category}</span>
          <span className="template-date">
            {new Date(article.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        
        <h1 className="template-title">{article.title}</h1>
        
        <div className="template-author">
          <span>By {article.author}</span>
          <span className="read-time">{article.readTime} min read</span>
        </div>
      </div>
      
      <div className="template-featured-image">
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
      
      {headline && (
        <div className="template-headline">
          <p>{headline}</p>
        </div>
      )}
      
      {keyPoints.length > 0 && (
        <div className="template-key-points">
          <h2>Key Points</h2>
          <ul>
            {keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="template-content">
        {contentParagraphs
          .filter(para => 
            para !== headline && 
            !keyPoints.includes(para.replace(/^[•*]\s*|^Key Point:\s*/i, '')))
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </div>
      
      <div className="template-tags">
        {article.tags.map(tag => (
          <span key={tag} className="template-tag">#{tag}</span>
        ))}
      </div>
      
      <div className="template-source">
        {article.source && (
          <div className="source-info">
            <span>Source: {article.source}</span>
          </div>
        )}
      </div>
    </article>
  );
};

NewsTemplate.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageCaption: PropTypes.string,
    date: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    readTime: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    source: PropTypes.string
  }).isRequired
};

export default NewsTemplate; 