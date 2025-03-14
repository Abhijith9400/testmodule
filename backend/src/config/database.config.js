import mongoose, { connect, set } from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { FoodModel } from '../models/food.model.js';
import { sample_users, sample_foods } from '../data.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';



dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PASSWORD_HASH_SALT_ROUNDS = 10;
set('strictQuery', true);

export const dbconnect = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('MONGO_URI:', uri);  

    if (!uri) {
      throw new Error("❌ MongoDB URI not provided in environment variables.");
    }

    await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, 
    });

    console.log('✅ Connected to MongoDB successfully.');

    await seedUsers();
    await seedFoods();
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

async function seedUsers() {
  try {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      console.log('✅ Users seeding already done!');
      return;
    }

    for (let user of sample_users) {
      user._id = new mongoose.Types.ObjectId();
      user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
      await UserModel.create(user);
    }

    console.log('✅ Users seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}

async function seedFoods() {
  try {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      console.log('✅ Foods seeding already done!');
      return;
    }

    for (const food of sample_foods) {
      const newFood = new FoodModel({
        ...food,
        _id: new mongoose.Types.ObjectId(), // Generate a valid ObjectId for each food item
        imageUrl: `/foods/${food.imageUrl}`
      });
      await newFood.save();
    }

    console.log('✅ Foods seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error seeding foods:', error);
  }
}