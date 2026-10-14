import api from './api';

/**
 * Good Life Fitness AI - Centralized Entitlement Service
 * Manages user feature gates based on authoritative backend verification.
 */
class EntitlementService {
  /**
   * Check if a user has active premium access.
   * Client-side values are display hints only; backend strictly enforces access.
   */
  hasPremiumAccess(user) {
    if (!user || !user.subscription) return false;
    
    // Check authoritative flag from backend if present
    if (user.subscription.hasPremiumAccess !== undefined) {
      return Boolean(user.subscription.hasPremiumAccess);
    }

    const plan = user.subscription.plan || (user.subscription.tier !== 'free' ? 'PREMIUM' : 'FREE');
    if (plan !== 'PREMIUM') return false;

    const status = (user.subscription.status || 'ACTIVE').toUpperCase();
    const now = new Date();
    const endDate = user.subscription.endDate ? new Date(user.subscription.endDate) : null;

    if (status === 'ACTIVE' || status === 'TRIALING') {
      if (endDate && now > endDate) return false;
      return true;
    }

    // CANCELLED status retains access until billing cycle concludes
    if (status === 'CANCELLED') {
      if (endDate && now <= endDate) return true;
      return false;
    }

    return false;
  }

  /**
   * Feature Access Map
   */
  getFeatures(user) {
    const isPremium = this.hasPremiumAccess(user);

    return {
      // Free Features
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

      // Premium Features
      aiCameraCoach: isPremium,
      realtimePoseTracking: isPremium,
      biomechanicalRepCounting: isPremium,
      validatedFormFeedback: isPremium,
      advancedPersonalizedWorkouts: isPremium,
      advancedAiDietPlanning: isPremium,
      advancedWorkoutAnalytics: isPremium,
      detailedProgressReports: isPremium,
      weeklyMealSchedule: isPremium,
      groceryShoppingList: isPremium,
    };
  }

  /**
   * Fetch authoritative subscription status from backend
   */
  async fetchAuthoritativeStatus() {
    try {
      const res = await api.get('/auth/subscription/status');
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch (err) {
      console.warn('[EntitlementService] Could not reach backend subscription check:', err.message);
      return null;
    }
  }

  /**
   * Upgrade user to premium
   */
  async upgradeToPremium() {
    const res = await api.post('/auth/subscription/upgrade', {});
    return res;
  }

  /**
   * Cancel subscription (retains access until billing period concludes)
   */
  async cancelSubscription() {
    const res = await api.post('/auth/subscription/cancel', {});
    return res;
  }
}

export default new EntitlementService();
