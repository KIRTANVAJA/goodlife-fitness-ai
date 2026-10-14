import api from './api';

/**
 * Good Life Fitness AI - Centralized Entitlement Service
 * 
 * Free AI Coach Access Architecture:
 * All computer vision optical tracking, repetition counting, form analysis,
 * workout history telemetry, and pure diet planning are completely free for all athletes.
 */
class EntitlementService {
  /**
   * Check if user has active AI coach access.
   * Always returns true because AI Coach and pose tracking are 100% free!
   */
  hasPremiumAccess(user) {
    return true;
  }

  /**
   * Feature Access Map — All AI and Tracking features unlocked for free
   */
  getFeatures(user) {
    return {
      // 100% Free Core Features
      publicBmiCalculator: true,
      basicBodyMetrics: true,
      basicUserProfile: true,
      manualWeightTracking: true,
      basicCalorieTracking: true,
      basicExerciseLibrary: true,
      exerciseDemonstrations: true,
      basicManualWorkoutPlans: true,
      basicWorkoutHistory: true,
      basicDietPlanner: true,
      basicProgressCharts: true,

      // Free AI Coach & Optical Tracking Suite
      aiCameraCoach: true,
      realtimePoseTracking: true,
      biomechanicalRepCounting: true,
      validatedFormFeedback: true,
      advancedPersonalizedWorkouts: true,
      advancedAiDietPlanning: true,
      advancedWorkoutAnalytics: true,
      detailedProgressReports: true,
      weeklyMealSchedule: true,
      groceryShoppingList: true,
    };
  }

  /**
   * Fetch authoritative subscription status
   */
  async fetchAuthoritativeStatus() {
    try {
      const res = await api.get('/auth/subscription/status');
      if (res.success && res.data) {
        return res.data;
      }
      return { plan: 'PREMIUM', hasPremiumAccess: true, status: 'ACTIVE', isFreeAiCoach: true };
    } catch (err) {
      return { plan: 'PREMIUM', hasPremiumAccess: true, status: 'ACTIVE', isFreeAiCoach: true };
    }
  }

  /**
   * Upgrade user to premium
   */
  async upgradeToPremium() {
    try {
      const res = await api.post('/auth/subscription/upgrade', {});
      return res;
    } catch (err) {
      return { success: true, message: 'Free AI Coach Activated' };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription() {
    try {
      const res = await api.post('/auth/subscription/cancel', {});
      return res;
    } catch (err) {
      return { success: true };
    }
  }
}

export default new EntitlementService();
