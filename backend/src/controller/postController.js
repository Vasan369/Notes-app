import Post from "../model/postModel.js";

//GET post
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).select("-__v");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: message.err });
  }
};

//create post
const createPost = async (req, res) => {
  const { title, description } = req.body;
  console.log(title);
  console.log(description);
  try {
    const post = await Post.create({ title, description });
    res.status(201).json({ message: "Post created success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

//GET single post
const getSinglePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404);
      return res.status(404).json({ message: "post not found" });
    }
    res.status(200).json({ post });
  } catch (err) {
    if (err.name === "CastError" && err.kind === "ObjectId") {
      return res.status(404).json({ message: "Invaild post Id" });
    }
    res.status(500).json({ message: message.err });
  }
};

//Update post
const updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404);
      return res.status(404).json({ message: "post not found" });
    }
    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    const updatePost = await post.save();
    res.status(200).json({
      id: updatePost._id,
      title: updatePost.title,
      description: updatePost.description,
    });
  } catch (err) {
    if (err.name === "CastError" && err.kind === "ObjectId") {
      return res.status(404).json({ message: "Invaild post Id" });
    }
    res.status(500).json({ message: message.err });
  }
};

//Delete post
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    res.status(200).json({ message: "Post delete success" });
  } catch (err) {
    if (err.name === "CastError" && err.kind === "ObjectId") {
      return res.status(404).json({ message: "Invaild post Id" });
    }
    res.status(500).json({ message: message.err });
  }
};

export { getPosts, createPost, getSinglePost, updatePost, deletePost };
