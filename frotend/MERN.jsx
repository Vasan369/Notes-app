import React, { useState, useEffect } from 'react';
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { Input, Textarea } from '@material-tailwind/react';

function MERN() {
    const [view, setView] = useState('list');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        if (view === 'list') {
            const getPosts = async () => {
                try {
                    setLoading(true);
                    const response = await fetch("http://localhost:5000/api/posts");
                    const data = await response.json();
                    setPosts(data);
                } catch (err) {
                    console.log(err.message);
                } finally {
                    setLoading(false);
                }
            };
            getPosts();
        }
    }, [view]);

    const deletePost = async (id) => {
        const confirmation = window.confirm("Are you sure to delete?");
        if (!confirmation) return;
        try {
            const response = await fetch(`http://localhost:5000/api/deletepost/${id}`, { method: "DELETE" });
            if (response.ok) setPosts(posts => posts.filter(post => post._id !== id));
            else {
                const errResponse = await response.json();
                throw new Error(errResponse.message);
            }
        } catch (err) { }
    };

    const onSubmitHandler = async (e, title, description, id = null) => {
        e.preventDefault();
        if (!title) return alert("Please enter title");
        if (!description) return alert("Please enter description");
        const url = id ? `http://localhost:5000/api/updatepost/${id}` : "http://localhost:5000/api/createpost";
        const method = id ? "PUT" : "POST";
        try {
            setLoading(true);
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description })
            });
            if (response.ok) {
                setView('list');
            }
        } catch (err) { } finally {
            setLoading(false);
        }
    };

    if (view === 'list') {
        return (
            <div className='h-full overflow-scroll w-full flex flex-col gap-5'>
                <h1 className='text-2xl'>Notes App</h1>
                <button onClick={() => setView('create')} className='bg-gray-700  mb-2 mx-auto text-white px-3 py-2 rounded-full'>Create Note</button>
                {loading ? <h1 className='mt-20'>Loading...</h1> : posts.length > 0 ? posts.map((post) => (
                    <div key={post._id} className='border-2 border-gray-400 rounded-xl py-1 px-2 break-all'>
                        <div className='text-start text-xl border-b-2 border-gray-300'>{post.title}</div>
                        <div className='text-start text-gray-700 mb-5'>{post.description}</div>
                        <div className='ms-3 flex gap-4 mb-1'>
                            <button className='text-xl p-1 rounded-full shadow-xl' onClick={() => { setCurrentPost(post); setView('update'); }}><FiEdit /></button>
                            <button className='text-xl text-red-500 p-1 rounded-full shadow-xl' onClick={() => deletePost(post._id)}><MdDelete /></button>
                        </div>
                    </div>
                )) : <h1 className='mt-20'>Add notes</h1>}
            </div>
        );
    }

    if (view === 'create') {
        return (
            <div className='flex flex-col w-full'>
                <h1>Create Notes</h1>
                <PostForm onSubmitHandler={(e, title, description) => onSubmitHandler(e, title, description)} />
                <button onClick={() => setView('list')} className='px-4 py-2 bg-red-500 text-white mx-auto rounded-full'>Cancel</button>
            </div>
        );
    }

    if (view === 'update' && currentPost) {
        return (
            <div>
                <h1>Update Notes</h1>
                <PostForm
                    title={currentPost.title}
                    description={currentPost.description}
                    onSubmitHandler={(e, title, description) => onSubmitHandler(e, title, description, currentPost._id)}
                />
                <button onClick={() => setView('list')} className='px-4 py-2 bg-red-500 text-white mx-auto rounded-full'>Cancel</button>
            </div>
        );
    }

    return <div>NotFound</div>;
}

function PostForm({ title = "", description = "", onSubmitHandler }) {
    const [postTitle, setPostTitle] = useState(title);
    const [postDescription, setPostDescription] = useState(description);
    const [loading, setLoading] = useState(false);

    return (
        <form onSubmit={(e) => { setLoading(true); onSubmitHandler(e, postTitle, postDescription); setLoading(false); }} className="flex flex-col items-start gap-9 mt-5">
            <Input label='Title' size='lg' type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
            <Textarea label="Description" value={postDescription} onChange={(e) => setPostDescription(e.target.value)}></Textarea>
            <div className='mx-auto mb-6'>
                {loading ? <h1 className='mt-20'>Loading....</h1> : <button type='submit' className='px-4 py-2 bg-blue-gray-500 text-white rounded-full'>Submit</button>}
            </div>
        </form>
    );
}

export default MERN;
