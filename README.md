
<body>

  <h1>EyeFrames.io</h1>
  <p>A dynamic marketplace for gently used eyeframes, allowing users to buy, sell, and explore frames while promoting sustainability and affordability.</p>

  <h2>🚀 Project Overview</h2>
  <p>EyeFrames.io is a platform designed to help users list, browse, and purchase quality used eyeframes at a more affordable price. This project aims to give eyewear a second life and provide people with a sustainable option for obtaining high-quality frames.</p>

  <h3>Key Features</h3>
  <ul>
    <li><strong>List Your Frames</strong>: Users can upload images, descriptions, and prices for their frames.</li>
    <li><strong>Browse Available Frames</strong>: Easily browse and search for frames, filtering by various criteria.</li>
    <li><strong>User Authentication</strong>: Secure Login and Signup options for user account creation.</li>
    <li><strong>Location Integration</strong>: Frames are tagged with their location, allowing for proximity-based browsing.</li>
    <li><strong>File Uploads</strong>: Upload images for each frame listing.</li>
    <li><strong>Review and Ratings</strong>: Users can leave reviews and rate frames.</li>
    <li><strong>Map Integration</strong>: Visual map display of frame locations, helping buyers locate nearby frames.</li>
    <li><strong>Price Comparison Feature</strong>: Future enhancement to compare listed frame prices with original costs for added transparency.</li>
  </ul>

  <h2>💻 Tech Stack</h2>
  <ul>
    <li><strong>Frontend</strong>: HTML, CSS, JavaScript, Bootstrap</li>
    <li><strong>Backend</strong>: Node.js, Express.js</li>
    <li><strong>Database</strong>: MongoDB</li>
    <li><strong>Additional Tools</strong>: Mapbox SDK for location mapping, Cloudinary for image storage, and Passport.js for user authentication.</li>
  </ul>

  <h2>📁 Project Structure</h2>

  <h3>Models</h3>
  <h4>Eyeframe Model</h4>
  <pre><code>
  const eyeframeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    material: { type: String, required: true },
    color: { type: String, required: true },
    image: {
      filename: { type: String },
      url: { type: String, default: "photos/spec1.jpg" },
    },
    location: { type: String, default: "Toronto, Canada" },
    review: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    geometry: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  });
  </code></pre>

  <h4>Review Model</h4>
  <pre><code>
  const reviewSchema = new Schema({
    comment: String,
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now() },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  });
  </code></pre>

  <h4>User Model</h4>
  <pre><code>
  const userSchema = new Schema({
    email: { type: String, required: true },
  });
  userSchema.plugin(passportLocalMongoose);
  </code></pre>

  <h3>Project Configuration</h3>
  <ul>
    <li><strong>Database</strong>: MongoDB is used to store user, eyeframe, and review data.</li>
    <li><strong>Environment Variables</strong>: Configure <code>.env</code> with necessary credentials (e.g., MongoDB URI, Cloudinary API keys, etc.).</li>
  </ul>

  <h2>🚀 Getting Started</h2>

  <h3>Prerequisites</h3>
  <ul>
    <li>Node.js (version 20.15.0 or higher)</li>
    <li>MongoDB (local or cloud instance)</li>
    <li>Cloudinary account (for image uploads)</li>
    <li>Mapbox account (for location services)</li>
  </ul>

  <h3>Usage</h3>
  <ol>
    <li>Sign up or log in to start browsing frames or list your own.</li>
    <li>Explore the marketplace, check frame details, and use the map feature to find frames nearby.</li>
    <li>Leave reviews and ratings for frames you've purchased.</li>
  </ol>

  <h2>📦 Dependencies</h2>
  <ul>
    <li><strong>@mapbox/mapbox-sdk</strong>: Map integration for displaying frame locations</li>
    <li><strong>Cloudinary</strong>: Storage and management of uploaded frame images</li>
    <li><strong>Express.js</strong>: Backend framework for handling routes and API requests</li>
    <li><strong>Mongoose</strong>: MongoDB object modeling for managing database schemas</li>
    <li><strong>Passport.js</strong>: Authentication management with local strategy for secure logins</li>
  </ul>

  <h2>🛠 Future Enhancements</h2>
  <ul>
    <li><strong>Price Comparison</strong>: Add a feature to display the savings by comparing used frame prices with the original cost.</li>
    <li><strong>Enhanced Search Filters</strong>: Improve search functionality with more refined filtering options.</li>
  </ul>

  <h2>🏆 License</h2>
  <p>This project is licensed under the MIT License.</p>

  <h2>🤝 Contributing</h2>
  <p>Contributions are welcome! Feel free to submit a pull request or open an issue.</p>

</body>

