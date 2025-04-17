import mongoose from "mongoose";
import Sentiment from "sentiment";
import fs from "fs";
import path from "path";
import Feedback from "./models/Feedback.js";
import User from "./models/User.js";

const MONGO_URI =
  "mongodb+srv://therajat14:therajat14@therajat14.yma6r.mongodb.net/FeedbackProject";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const sentiment = new Sentiment();

// File paths
const feedbackFilePath = path.resolve("./feedback.json");
const userFilePath = path.resolve("./user.json");

// Load data
const feedbacks = JSON.parse(fs.readFileSync(feedbackFilePath));
const users = JSON.parse(fs.readFileSync(userFilePath));

// Insert users with provided _id
const processUsers = async () => {
  console.log("🔄 Inserting users...");
  for (const user of users) {
    const { _id, name, email, isAdmin, createdAt } = user;
    try {
      const password = "ksdfkawlefnaweifnawi324235";
      const exists = await User.findById(_id);
      if (!exists) {
        const newUser = new User({
          _id,
          name,
          email,
          password,
          isAdmin,
          createdAt: new Date(createdAt),
        });
        await newUser.save();
        console.log(`👤 Inserted: ${email}`);
      } else {
        console.log(`⚠️  Skipped (already exists): ${email}`);
      }
    } catch (err) {
      console.error(`❌ Error inserting user (${email}):`, err.message);
    }
  }
};

// Insert feedbacks with sentiment analysis
const processFeedbacks = async () => {
  console.log("\n🔄 Inserting feedbacks...");
  for (const fb of feedbacks) {
    const { _id, userId, message, createdAt } = fb;

    const result = sentiment.analyze(message);
    let sentimentLabel = "Neutral";
    if (result.score > 0) sentimentLabel = "Positive";
    else if (result.score < 0) sentimentLabel = "Negative";

    try {
      const exists = await Feedback.findById(_id);
      if (!exists) {
        const newFeedback = new Feedback({
          _id,
          userId,
          message,
          sentimentScore: result.score,
          sentimentLabel,
          createdAt: new Date(createdAt),
        });

        await newFeedback.save();
        console.log(
          `💬 Inserted: "${message.slice(
            0,
            40
          )}..." [${sentimentLabel}] on ${createdAt}`
        );
      } else {
        console.log(`⚠️  Skipped (already exists): ${_id}`);
      }
    } catch (err) {
      console.error(`❌ Error inserting feedback (${_id}):`, err.message);
    }
  }
};

// Run both imports
const run = async () => {
  await processUsers();
  await processFeedbacks();
  console.log("\n✅ Import complete.");
  mongoose.disconnect();
};

run();
