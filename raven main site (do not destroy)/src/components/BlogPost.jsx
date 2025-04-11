import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getBlogPost } from '../data/blogPosts';
import Image from './Image/Image';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const foundPost = getBlogPost(slug);
                if (!foundPost) {
                    throw new Error('Post not found');
                }
                setPost(foundPost);
            } catch (err) {
                setError('Failed to load blog post');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="blog-post loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="blog-post error">
                <div className="error-message">
                    <h2>Azarath Metrion Zinthos!</h2>
                    <p>Raven couldn't find this article.</p>
                    <a href="/blog" className="back-to-blog">Return to Blog</a>
                </div>
            </div>
        );
    }

    return (
        <article className="blog-post">
            <header className="post-header">
                <div className="post-category">{post.category}</div>
                <h1>{post.title}</h1>
                <div className="post-meta">
                    <span className="post-date">
                        {format(new Date(post.date), 'MMMM d, yyyy')}
                    </span>
                    <span className="post-read-time">{post.readTime} min read</span>
                    <span className="post-author">By {post.author}</span>
                </div>
            </header>

            {post.image && (
                <div className="post-image">
                    <Image src={post.image} alt={post.title} />
                </div>
            )}

            <div className="post-content">
                {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            <footer className="post-footer">
                <div className="post-tags">
                    {post.tags.map(tag => (
                        <span key={tag} className="post-tag">{tag}</span>
                    ))}
                </div>
                <div className="social-share">
                    <button className="share-button twitter">Share on Twitter</button>
                    <button className="share-button telegram">Share on Telegram</button>
                </div>
            </footer>
        </article>
    );
};

export default BlogPost; 