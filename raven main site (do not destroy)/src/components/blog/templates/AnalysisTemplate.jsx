import React from 'react';
import PropTypes from 'prop-types';
import Image from '../../Image/Image';
import './ArticleTemplates.css';

/**
 * AnalysisTemplate component
 * A template for in-depth analytical articles with a focus on 
 * structured sections, key insights, and a more academic presentation
 */
const AnalysisTemplate = ({ article }) => {
  if (!article) return null;

  // Parse content to extract structured sections
  const contentParagraphs = article.content.split('\n\n');
  
  // Create a structure for sections and their content
  const sections = [];
  let currentSection = { title: 'Introduction', content: [] };
  
  contentParagraphs.forEach(paragraph => {
    // Check if paragraph is a heading (starts with ## or contains a colon at the end)
    const isHeading = paragraph.startsWith('##') || 
                       /^[A-Z][^.!?]*[:]$/.test(paragraph) ||
                       (paragraph.length < 60 && paragraph.match(/^[A-Z][^.!?]*$/));
    
    if (isHeading) {
      // If we already have content in current section, push it to sections array
      if (currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      
      // Clean up heading format
      const title = paragraph.replace(/^##\s*/, '').replace(/:$/, '');
      currentSection = { title, content: [] };
    } else {
      // Add paragraph to current section
      currentSection.content.push(paragraph);
    }
  });
  
  // Add the last section
  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  // Extract key insights if they exist
  const keyInsightsSection = sections.find(section => 
    section.title.toLowerCase().includes('key insight') || 
    section.title.toLowerCase().includes('summary') ||
    section.title.toLowerCase().includes('conclusion')
  );
  
  const keyInsights = keyInsightsSection ? keyInsightsSection.content : [];

  return (
    <article className="article-template analysis-template">
      <div className="template-header">
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
        
        <h1 className="template-title">{article.title}</h1>
        
        <div className="template-author">
          <span>By {article.author}</span>
          <span className="read-time">{article.readTime} min read</span>
        </div>
        
        {article.abstract && (
          <div className="template-abstract">
            <h2>Abstract</h2>
            <p>{article.abstract}</p>
          </div>
        )}
      </div>
      
      <div className="template-table-of-contents">
        <h2>Contents</h2>
        <ul>
          {sections.map((section, index) => (
            <li key={index}>
              <a href={`#section-${index}`}>{section.title}</a>
            </li>
          ))}
        </ul>
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
      
      <div className="template-content">
        {sections.map((section, sectionIndex) => (
          <section key={sectionIndex} id={`section-${sectionIndex}`} className="template-section">
            <h2 className="section-title">{section.title}</h2>
            {section.content.map((paragraph, paraIndex) => (
              <p key={paraIndex}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
      
      {keyInsights.length > 0 && (
        <div className="template-key-insights">
          <h2>Key Insights</h2>
          <div className="insights-content">
            {keyInsights.map((insight, index) => (
              <p key={index}>{insight}</p>
            ))}
          </div>
        </div>
      )}
      
      {article.references && article.references.length > 0 && (
        <div className="template-references">
          <h2>References</h2>
          <ul className="references-list">
            {article.references.map((reference, index) => (
              <li key={index}>{reference}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="template-tags">
        {article.tags.map(tag => (
          <span key={tag} className="template-tag">#{tag}</span>
        ))}
      </div>
    </article>
  );
};

AnalysisTemplate.propTypes = {
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
    abstract: PropTypes.string,
    references: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default AnalysisTemplate; 