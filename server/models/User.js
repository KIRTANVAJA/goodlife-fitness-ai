import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profile: {
      age: { type: Number, min: 12, max: 120, default: 26 },
      gender: {
        type: String,
        enum: ['male', 'female', 'non-binary', 'other', 'unspecified'],
        default: 'unspecified',
      },
      heightCm: { type: Number, min: 90, max: 250, default: 175 },
      weightKg: { type: Number, min: 30, max: 300, default: 72 },
      fitnessLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
      },
      primaryGoal: {
        type: String,
        enum: ['general_fitness', 'fat_loss', 'muscle_building', 'endurance', 'flexibility'],
        default: 'general_fitness',
      },
      experienceLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'none', '1-2_years', '3+_years'],
        default: 'beginner',
      },
      availableEquipment: {
        type: [String],
        default: ['bodyweight'],
      },
      targetWorkoutsPerWeek: {
        type: Number,
        min: 1,
        max: 7,
        default: 3,
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['FREE', 'PREMIUM'],
        default: 'FREE',
      },
      // Backward-compatibility alias
      tier: {
        type: String,
        enum: ['free', 'gold', 'elite', 'vip', 'premium'],
        default: 'free',
      },
      status: {
        type: String,
        enum: [
          'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELLED', 'EXPIRED',
          'active', 'trialing', 'past_due', 'cancelled', 'expired',
        ],
        default: 'ACTIVE',
        set: (v) => (v ? v.toUpperCase() : 'ACTIVE'),
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
      },
      provider: {
        type: String,
        default: 'internal',
      },
      providerSubscriptionId: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Method to determine authoritative premium access
userSchema.methods.hasPremiumAccess = function () {
  const plan = this.subscription?.plan || (this.subscription?.tier !== 'free' ? 'PREMIUM' : 'FREE');
  if (plan !== 'PREMIUM') {
    return false;
  }

  const status = this.subscription?.status || 'ACTIVE';
  const now = new Date();

  // Active or trialing access
  if (status === 'ACTIVE' || status === 'TRIALING') {
    if (this.subscription?.endDate && now > new Date(this.subscription.endDate)) {
      return false;
    }
    return true;
  }

  // CANCELLED status: access remains valid until end of billing period
  if (status === 'CANCELLED') {
    if (this.subscription?.endDate && now <= new Date(this.subscription.endDate)) {
      return true;
    }
    return false;
  }

  // PAST_DUE, EXPIRED have no access
  return false;
};

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
