import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { loadBlogPosts, getBlogPosts } from '../data/blogPosts';
import Image from './Image/Image';

const BlogGrid = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                await loadBlogPosts();
                setPosts(getBlogPosts());
            } catch (err) {
                setError('Failed to load blog posts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="blog-grid loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-grid error">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="blog-grid">
            {posts.map((post, index) => (
                <article 
                    key={post.id} 
                    className={`bento-item ${getSizeClass(index)}`}
                >
                    {post.image && (
                        <div className="post-image">
                            <Image src={post.image} alt={post.title} />
                        </div>
                    )}
                    <div className="post-content">
                        <div className="post-category">{post.category}</div>
                        <h2>{post.title}</h2>
                        <p className="post-excerpt">{post.excerpt}</p>
                        <div className="post-meta">
                            <span className="post-date">
                                {format(new Date(post.date), 'MMMM d, yyyy')}
                            </span>
                            <span className="post-read-time">{post.readTime} min read</span>
                        </div>
                        <div className="post-tags">
                            {post.tags.map(tag => (
                                <span key={tag} className="post-tag">{tag}</span>
                            ))}
                        </div>
                        <Link to={`/blog/${post.slug}`} className="read-more">
                            Read More
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    );
};

const getSizeClass = (index) => {
    const sizes = ['small', 'medium', 'large', 'wide', 'tall'];
    return sizes[index % sizes.length];
};

export default BlogGrid; 