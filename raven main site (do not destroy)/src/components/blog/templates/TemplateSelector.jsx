import React from 'react';
import PropTypes from 'prop-types';
import NewsTemplate from './NewsTemplate';
import AnalysisTemplate from './AnalysisTemplate';
import FeatureTemplate from './FeatureTemplate';

/**
 * TemplateSelector component
 * Selects the appropriate template based on article category, tags, or explicit template setting
 */
const TemplateSelector = ({ article }) => {
  if (!article) return null;

  // If the article explicitly specifies a template, use that
  if (article.template) {
    switch (article.template.toLowerCase()) {
      case 'news':
        return <NewsTemplate article={article} />;
      case 'analysis':
        return <AnalysisTemplate article={article} />;
      case 'feature':
        return <FeatureTemplate article={article} />;
      default:
        console.warn(`Unknown template type: ${article.template}. Falling back to appropriate template.`);
        // Fall through to automatic selection
    }
  }

  // Automatic template selection based on article properties
  
  // Check if it's a news article (breaking news, announcements, quick updates)
  const isNewsArticle = 
    article.category?.toLowerCase()?.includes('news') ||
    article.tags?.some(tag => 
      ['breaking', 'news', 'announcement', 'update'].includes(tag.toLowerCase())
    ) ||
    (article.readTime && article.readTime <= 3); // Short articles are likely news
  
  // Check if it's an analysis article (deep dives, research, technical)
  const isAnalysisArticle = 
    article.category?.toLowerCase()?.includes('analysis') ||
    article.category?.toLowerCase()?.includes('research') ||
    article.tags?.some(tag => 
      ['analysis', 'research', 'deep dive', 'technical', 'study', 'report'].includes(tag.toLowerCase())
    ) ||
    (article.references && article.references.length > 0) || // Articles with references are likely analysis
    article.abstract; // Articles with abstracts are likely analysis
  
  // Check if it's a feature article (long-form, storytelling, interviews)
  const isFeatureArticle = 
    article.category?.toLowerCase()?.includes('feature') ||
    article.tags?.some(tag => 
      ['feature', 'interview', 'profile', 'story', 'spotlight'].includes(tag.toLowerCase())
    ) ||
    article.subtitle || // Articles with subtitles are often features
    (article.readTime && article.readTime >= 10) || // Long articles are likely features
    article.additionalImages?.length > 1; // Articles with multiple images are likely features
  
  // Choose the most appropriate template based on checks above
  if (isFeatureArticle) {
    return <FeatureTemplate article={article} />;
  } else if (isAnalysisArticle) {
    return <AnalysisTemplate article={article} />;
  } else {
    // Default to NewsTemplate if no other matches or if explicitly a news article
    return <NewsTemplate article={article} />;
  }
};

TemplateSelector.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    content: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    readTime: PropTypes.number.isRequired,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    template: PropTypes.string, // Optional explicit template setting
    abstract: PropTypes.string,
    references: PropTypes.arrayOf(PropTypes.string),
    additionalImages: PropTypes.array
  }).isRequired
};

export default TemplateSelector; 