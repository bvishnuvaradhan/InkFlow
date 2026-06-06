const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inkflow';

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected. Clearing existing collections...');
    
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log('Creating sample users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.create([
      {
        name: 'Alex Rivera',
        email: 'alex@inkflow.com',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
        role: 'user'
      },
      {
        name: 'Sophia Chen',
        email: 'sophia@inkflow.com',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia',
        role: 'user'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@inkflow.com',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus',
        role: 'admin'
      }
    ]);

    console.log('Users created. Generating blog posts...');

    const posts = await Post.create([
      {
        title: 'A Deep Dive into Tailwind CSS v4: The CSS-First Framework',
        content: `Tailwind CSS v4 introduces a revolutionary CSS-first configuration model. Unlike previous versions that relied on a JavaScript config file (tailwind.config.js), v4 allows you to configure themes, variables, and custom variants directly inside your stylesheet using CSS directives.

This change greatly improves compilation speeds and keeps customization aligned with standard CSS conventions. The new compiler, Lightning CSS, is written in Rust and operates up to 10x faster.

For developer setups, you simply install the tailwindcss package along with its Vite integration and import tailwindcss inside your entry index.css. Any customizations, like custom theme colors, are defined inside standard @theme blocks. This clean alignment makes it incredibly satisfying to build modern, performant React applications.`,
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
        tags: ['TailwindCSS', 'CSS', 'Frontend', 'React'],
        category: 'Web Development',
        author: users[0]._id, // Alex
        likes: [users[1]._id, users[2]._id], // 2 likes (Popular!)
        status: 'published',
        createdAt: new Date(Date.now() - 3600000 * 24 * 3) // 3 days ago
      },
      {
        title: 'The Rise of Agentic AI: Beyond Simple Prompting',
        content: `Artificial Intelligence is undergoing a massive shift from passive chat interfaces to autonomous agentic systems. While traditional LLM usage involves a single prompt and a single response, Agentic AI refers to systems capable of planning, goal breakdown, tool usage, and collaborative execution.

Agentic systems can autonomously search the web, execute code in sandboxes, read files, and write comprehensive implementation blueprints. Furthermore, they are capable of self-correcting by analyzing error logs and retrying failed commands.

As we move forward, developers will spend less time writing boilerplate queries and more time designing the architectures and boundaries for agent teams. The future of software engineering lies in this collaborative model, where human creativity directs the reasoning power of specialized autonomous systems.`,
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60',
        tags: ['AI', 'Agentic', 'LLMs', 'Future'],
        category: 'AI',
        author: users[1]._id, // Sophia
        likes: [users[0]._id, users[2]._id], // 2 likes
        status: 'published',
        createdAt: new Date(Date.now() - 3600000 * 12) // 12 hours ago
      },
      {
        title: 'Mastering the Tech Interview: From DSA to System Design',
        content: `Landing a role at a top-tier tech company requires preparing across multiple dimensions. Data Structures & Algorithms (DSA) form the entry gate, but System Design and architectural thinking set the senior engineers apart.

When preparing for DSA, focus on understanding deep patterns rather than memorizing individual questions. Master patterns like Two Pointers, Sliding Window, Graph traversals, and dynamic programming. When solving problems, think aloud to demonstrate your problem-solving flow to the interviewer.

For System Design, focus on real-world scalability. Understand when to use relational vs. non-relational databases, how to implement database replication and sharding, the use of load balancers, and caching mechanisms like Redis. By developing a structured approach, you'll be able to design premium systems that handle millions of requests with ease.`,
        coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=60',
        tags: ['Interview', 'DSA', 'Career', 'SoftwareEngineer'],
        category: 'Career',
        author: users[2]._id, // Marcus
        likes: [users[0]._id], // 1 like
        status: 'published',
        createdAt: new Date(Date.now() - 3600000 * 2) // 2 hours ago (Latest!)
      },
      {
        title: 'Drafting the Next Big Thing: Product Strategy for Devs',
        content: `This is a draft article written by Alex. Developers often build cool features but lack a clear product market fit strategy. In this article, we'll explore why developer-founders should focus on the 'problem first' and outline practical advice on prototyping and gathering early feedback...`,
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
        tags: ['Startup', 'Product', 'Career'],
        category: 'Career',
        author: users[0]._id, // Alex
        likes: [],
        status: 'draft',
        createdAt: new Date()
      }
    ]);

    console.log('Articles generated. Posting initial comments...');

    await Comment.create([
      {
        postId: posts[0]._id, // Tailwind post
        userId: users[1]._id, // Sophia
        content: 'Awesome overview of Tailwind v4! The Lightning CSS integration is a game-changer. Looking forward to using it on my next project.',
        createdAt: new Date(posts[0].createdAt.getTime() + 3600000 * 2)
      },
      {
        postId: posts[0]._id,
        userId: users[2]._id, // Marcus
        content: 'Thanks for this, Alex! The CSS-first theme config is much cleaner than the old tailwind.config.js file.',
        createdAt: new Date(posts[0].createdAt.getTime() + 3600000 * 4)
      },
      {
        postId: posts[1]._id, // Agentic AI
        userId: users[0]._id, // Alex
        content: 'Spot on, Sophia. The shift from conversational to task-oriented agents is happening extremely fast. Exciting times!',
        createdAt: new Date(posts[1].createdAt.getTime() + 3600000)
      }
    ]);

    console.log('Database Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err.message);
    process.exit(1);
  }
};

seedData();
