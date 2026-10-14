import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from '../models/Exercise.js';
import User from '../models/User.js';
import { initialExercises } from '../data/initialExercises.js';

dotenv.config();

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goodlife_fitness_ai';
    await mongoose.connect(uri);
    console.log('[Seed] Connected to MongoDB');

    // Seed exercises with upsert
    for (const ex of initialExercises) {
      await Exercise.findOneAndUpdate(
        { exerciseId: ex.exerciseId },
        ex,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`[Seed] Seeded exercise: ${ex.name}`);
    }

    // Seed a demo user if none exists
    const existingDemo = await User.findOne({ email: 'demo@goodlifefitness.com' });
    if (!existingDemo) {
      await User.create({
        name: 'Alex Mercer',
        email: 'demo@goodlifefitness.com',
        password: 'password123',
        profile: {
          age: 28,
          gender: 'male',
          heightCm: 180,
          weightKg: 75,
          fitnessLevel: 'intermediate',
          primaryGoal: 'muscle_building',
          experienceLevel: '1-2_years',
          availableEquipment: ['bodyweight', 'dumbbells'],
          targetWorkoutsPerWeek: 4,
        },
      });
      console.log('[Seed] Created default demo user: demo@goodlifefitness.com / password123');
    }

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding failed:', error);
    process.exit(1);
  }
};

seed();
