const express = require("express");
const path = require("path");
const fs = require('fs')
const app = express()

const mongoose = require('mongoose');

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(express.json()); // This should be at the top, before defining your routes


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// User Schema
const userSchema = new mongoose.Schema({
  followers: [{ type: String, ref: 'User' }],
  following: [{ type: String, ref: 'User' }],
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  likePost: [{ type: String, ref: 'Post' }],
  dislikePost: [{ type: String, ref: 'Post' }],
  favorite: [{ type: String, ref: 'Post' }],
  avatar: Buffer,
  introduction: String,
  background_image: Buffer,
  newNotification: Boolean,
  self_post: [{ type: String, ref: 'Post' }],
  // Add any additional fields as needed
});

const User = mongoose.model('User', userSchema);


const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  }
});


const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;

const createAttachmentFromFile = (filePath) => {
  const fileData = fs.readFileSync(filePath);
  return {
    filename: path.basename(filePath),
    contentType: 'image/jpeg', // Or use a library like 'mime-types' to get the correct MIME type from the file
    data: fileData
  };
};

// const attachment = createAttachmentFromFile("./hahaha.png");


const postSchema = new mongoose.Schema({
  postID: { type: String, required: true, unique: true },
  tag: Number, // If multiple, can be an array of strings
  content: { type: String, required: true },
  attachment: attachmentSchema,
  userID: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  visible: { type: Number, enum: [-1, 0, 1], default: 0 }
  // Additional fields and references to other schemas can be added as needed
  // Add automatic timestamp for post creation
}, { timestamps: { createdAt: 'post_time' } });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

const generateUniquePostID = async () => {

  const maxPostId = await Post.find().sort({ postID: -1 }).limit(1);
  if(maxPostId[0]===undefined)
  {
    const newPostId = 1;
    return newPostId;
  }
  else
  {
    const newPostId = parseInt(maxPostId[0].postID)+1;
    return newPostId;
  }
  };

  async function createPost(userID, content, attachment, visible) {
    try {
    // Generate a unique postID
    const postID_ = await generateUniquePostID(Post);
    // Create a new Post document
    const newPost = new Post({
    userID,
    postID: postID_,
    content,
    attachment: null,
    visible
    });
    // Save the new post to the database
    const savedPost = await newPost.save();
    console.log('Post created successfully:', savedPost);
    } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error creating post:', error);
    throw error; // Rethrow the error for further handling
    }
    }
    
  
  const commentSchema = new mongoose.Schema({
    postID: { type: mongoose.SchemaTypes.ObjectId, ref: 'Post', required: true },
    commentID: { type: String, required: true, unique: true },
    userID: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    // Timestamps can be automatically added by Mongoose
  }, { timestamps: { createdAt: 'created_at' } });
  
  const Comment = mongoose.model('Comment', commentSchema);
  
  const isAuthenticated = (req, res, next) => {
    if (!req.user) {
      return res.status(401).send('User not authenticated');
    }
    next();
  };
  
  app.post("/post", isAuthenticated, async (req, res) => {
    try {
      // Assuming req.user is populated with the user's data after authentication
      const { tag, content, attachment } = req.body;
      const userID = req.user._id; // The authenticated user's ID should be used
  
      // Create a unique postID, for example using MongoDB's ObjectId
      const postID = new mongoose.Types.ObjectId();
  
      const newPost = new Post({
        postID,
        tag,
        content,
        attachment,
        userID,
        // like, dislike, and visible have default values specified in the schema
      });
  
      const savedPost = await newPost.save();
  
      res.status(201).json(savedPost);
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).send("Internal server error");
    }
  });
  

// Function to create a new user
async function createUser(userID, password, username) {
  const user = new User({
    userID, // Assuming userID is something like an email or unique identifier
    password,
    username,
    // Initialize other fields as necessary, could be empty arrays or nulls if optional
    followers: [],
    following: [],
    likePost: [],
    dislikePost: [],
    favorite: [],
    avatar: null,
    introduction: null,
    background_image: null,
    newNotification: false,
    self_post: [],
  });

  try {
    const result = await user.save();
    console.log('User created successfully:', result);
  } catch (error) {
    console.error('Error creating the user:', error.message);
  }
}

async function admincreateUser(userID, username, password, introduction) {
  const user = new User({
    userID,
    password,
    username,
    followers: [],
    following: [],
    likePost:[],
    dislikePost: [],
    favorite: [],
    avatar: null,
    introduction,
    background_image: null,
    newNotification: false,
    self_post: [],

  });

  try {
    const result = await user.save();
    console.log('User created successfully:', result);
    return result; 
  } catch (error) {
    console.error('Error creating the user:', error.message);
    throw error; 
  }
}

// Sample data insertion
// Replace 'uniqueUserID', 'securePassword', and 'uniqueUsername' with actual values
createUser('123', 'securePassword', 'uniqueUsername');
createUser('8', '3100', 'winnie');
createUser('100', '123', 'test');
createUser('0', 'admin', 'admin');
createPost("66112a017e5156627ff9f471","Hi, this is michael",1);

//handle login authentication
app.post("/login", async (req, res) => {
  try {
    const { userID, password } = req.body; // Assuming you're receiving userID instead of username
    const userData = await User.findOne({
      userID, // This field name should match the field in your MongoDB collection
      password,
    });

    if (userData) {
      res.status(200).send(userData);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
  }
});


// Generate Unique UserID
const generateUniqueUserID = async () => {
	var userID;
	var isUnique = false;

	while (!isUnique) {
	userID = Math.floor(1000 + Math.random() * 9000).toString();
	const existingUser = await User.findOne({ userID });
		if (!existingUser) isUnique = true;
	}

	return userID;
};

// handle register: create new user
app.post('/register', async (req, res) => {
	try {
		const { user_name, user_password } = req.body;
		const userID = await generateUniqueUserID();

		createUser(userID, user_password, user_name);

		// Check if newUser actually has a userID property

		res.status(201).json({ message: "User registered successfully", userId: userID });
	} catch (error) {
		console.error('Error during registration:', error);
		res.status(500).json({ message: "An error occurred during registration" });
	}
});


// handle admin: list all users
app.get("/listuser", async (req, res) => {
  try {
    let userData = await User.find({}, 'userID username password').lean();

    for (let user of userData) {
      const followers = await User.find({ 'username': { $in: user.followers } }, 'username');
      const following = await User.find({ 'username': { $in: user.following } }, 'username');
      user.followers = followers;
      user.following = following;
    }

    console.log(`Fetched ${userData.length} users.`);
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
});




// handle admin: delete a user
app.delete('/deleteuser/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const deletedUser = await User.findOneAndDelete({ userID: userID })
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: `User ${userID} deleted successfully` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// handle admin: create a user
app.post('/createuser', async (req, res) => {

  try {
    const {userID, username, password, introduction} = req.body;
    admincreateUser(userID, password, username, introduction)

    res.status(201).json("good"); // Send the created user back
  } catch (error) {
    console.error('Error during creating user', error); // Log the full error
    res.status(400).json({ message: error.message });
  }


});



// handle admin: list all posts
app.get('/listpost', async (req, res) => {
  try {
    let postData = await Post.find({}, 'postID tag content visible like dislike').lean();

    console.log(`Fetched ${postData.length} posts.`);
    res.json(postData);
  } catch (error) {
    console.error("Error fetching post data:", error);
    res.status(500).send("Internal server error");
  }
});


// handle admin: delete a post
app.delete('/deletepost/:postID', async (req, res) => {
  try {
    const { postID } = req.params;
    const deletedPost = await Post.findOneAndDelete({ postID: postID })
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: `Post ${postID} deleted successfully` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




