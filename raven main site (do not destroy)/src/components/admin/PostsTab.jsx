import React, { useState, useEffect } from 'react';
import { authService } from '../../auth/authService';
import { format } from 'date-fns';
import Image from '../Image/Image';

const PostsTab = () => {
    const [posts, setPosts] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        imageUrl: '',
        scheduleDate: '',
        isScheduled: false
    });

    useEffect(() => {
        // TODO: Fetch actual posts from backend
        setPosts([
            {
                id: 1,
                title: 'Raven Updates',
                content: 'Latest updates about Raven...',
                imageUrl: '/images/raven-updates.jpg',
                date: '2024-03-15',
                status: 'published'
            },
            {
                id: 2,
                title: 'New Features',
                content: 'Check out our new features...',
                imageUrl: '/images/new-features.jpg',
                date: '2024-03-14',
                status: 'published'
            },
            {
                id: 3,
                title: 'Coming Soon',
                content: 'Exciting features coming soon...',
                imageUrl: '/images/coming-soon.jpg',
                date: '2024-05-20',
                status: 'scheduled'
            }
        ]);
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        // TODO: Implement post creation with backend
        const postToCreate = {
            ...newPost,
            status: newPost.isScheduled ? 'scheduled' : 'published',
            date: newPost.isScheduled ? newPost.scheduleDate : new Date().toISOString().split('T')[0]
        };
        console.log('Creating post:', postToCreate);
        
        // Add new post to the list (this would be replaced with API call)
        const newPostWithId = {
            ...postToCreate,
            id: posts.length + 1
        };
        setPosts([...posts, newPostWithId]);
        
        setIsCreating(false);
        setNewPost({ 
            title: '', 
            content: '', 
            imageUrl: '', 
            scheduleDate: '',
            isScheduled: false 
        });
    };

    const handleDeletePost = async (postId) => {
        // TODO: Implement post deletion with backend
        console.log('Deleting post:', postId);
        setPosts(posts.filter(post => post.id !== postId));
    };

    return (
        <div className="posts-tab">
            <div className="posts-header">
                <h2>Manage Posts</h2>
                <button 
                    className="create-button"
                    onClick={() => setIsCreating(true)}
                >
                    Create New Post
                </button>
            </div>

            {isCreating && (
                <div className="create-post-form">
                    <h3>Create New Post</h3>
                    <form onSubmit={handleCreatePost}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">Content</label>
                            <textarea
                                id="content"
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="imageUrl">Image URL</label>
                            <input
                                type="url"
                                id="imageUrl"
                                value={newPost.imageUrl}
                                onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                            />
                        </div>
                        <div className="form-group scheduling-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={newPost.isScheduled}
                                    onChange={(e) => setNewPost({ ...newPost, isScheduled: e.target.checked })}
                                />
                                Schedule for later
                            </label>
                            
                            {newPost.isScheduled && (
                                <div className="schedule-date-input">
                                    <label htmlFor="scheduleDate">Publish Date</label>
                                    <input
                                        type="date"
                                        id="scheduleDate"
                                        value={newPost.scheduleDate}
                                        onChange={(e) => setNewPost({ ...newPost, scheduleDate: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        required={newPost.isScheduled}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="submit-button">
                                {newPost.isScheduled ? 'Schedule Post' : 'Publish Post'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="posts-list">
                {posts.map(post => (
                    <div key={post.id} className="post-card">
                        <div className="post-image">
                            <div className="post-image-preview">
                                <Image src={post.imageUrl} alt={post.title} />
                            </div>
                        </div>
                        <div className="post-content">
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <div className="post-meta">
                                <div>
                                    <span className="post-date">{post.date}</span>
                                    <span className={`post-status ${post.status}`}>
                                        {post.status === 'published' ? 'Published' : 'Scheduled'}
                                    </span>
                                </div>
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDeletePost(post.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .posts-tab {
                    padding: 2rem;
                }
                .posts-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                h2 {
                    color: #9400D3;
                    margin: 0;
                }
                .create-button {
                    background: #9400D3;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .create-button:hover {
                    background: #7B00B8;
                }
                .create-post-form {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid rgba(148, 0, 211, 0.3);
                    margin-bottom: 2rem;
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                label {
                    display: block;
                    color: #fff;
                    margin-bottom: 0.5rem;
                }
                input, textarea {
                    width: 100%;
                    padding: 0.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    color: #fff;
                }
                textarea {
                    min-height: 150px;
                    resize: vertical;
                }
                .scheduling-options {
                    margin-top: 1rem;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .checkbox-label input {
                    width: auto;
                }
                .schedule-date-input {
                    margin-top: 0.5rem;
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .submit-button, .cancel-button {
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .submit-button {
                    background: #9400D3;
                    color: white;
                    border: none;
                }
                .submit-button:hover {
                    background: #7B00B8;
                }
                .cancel-button {
                    background: transparent;
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .cancel-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .posts-list {
                    display: grid;
                    gap: 1.5rem;
                }
                .post-card {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 8px;
                    border: 1px solid rgba(148, 0, 211, 0.3);
                    overflow: hidden;
                }
                .post-image {
                    height: 200px;
                    overflow: hidden;
                }
                .post-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .post-content {
                    padding: 1.5rem;
                }
                .post-content h3 {
                    color: #fff;
                    margin: 0 0 1rem 0;
                }
                .post-content p {
                    color: rgba(255, 255, 255, 0.8);
                    margin: 0 0 1rem 0;
                }
                .post-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .post-date {
                    color: rgba(255, 255, 255, 0.6);
                    margin-right: 0.5rem;
                }
                .post-status {
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                }
                .post-status.published {
                    background-color: rgba(0, 200, 0, 0.2);
                    color: #00c800;
                }
                .post-status.scheduled {
                    background-color: rgba(255, 180, 0, 0.2);
                    color: #ffb400;
                }
                .delete-button {
                    background: transparent;
                    color: #ff4444;
                    border: 1px solid #ff4444;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .delete-button:hover {
                    background: rgba(255, 68, 68, 0.1);
                }
            `}</style>
        </div>
    );
};

export default PostsTab; 