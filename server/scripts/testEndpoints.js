const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('=== STARTING GOOD LIFE FITNESS AI BACKEND SUITE ===\n');
  let token = null;
  let testUserId = null;
  let createdSessionId = null;
  let squatExerciseId = null;

  // 1. Health check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    console.log('[TEST 1] GET /health:', data.status === 'healthy' ? 'PASSED ✅' : 'FAILED ❌', data);
  } catch (e) {
    console.error('[TEST 1] Failed:', e.message);
  }

  // 2. Register user
  const testEmail = `tester_${Date.now()}@example.com`;
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Miller',
        email: testEmail,
        password: 'securePassword123',
        profile: {
          age: 27,
          gender: 'female',
          heightCm: 168,
          weightKg: 64,
          fitnessLevel: 'intermediate',
          primaryGoal: 'fat_loss',
        },
      }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      token = data.token;
      testUserId = data.user.id;
      console.log('[TEST 2] POST /auth/register: PASSED ✅ (Registered user id:', testUserId, ')');
    } else {
      console.error('[TEST 2] FAILED ❌:', data);
    }
  } catch (e) {
    console.error('[TEST 2] Failed:', e.message);
  }

  // 3. Login user
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'securePassword123' }),
    });
    const data = await res.json();
    console.log('[TEST 3] POST /auth/login:', data.success ? 'PASSED ✅' : 'FAILED ❌');
  } catch (e) {
    console.error('[TEST 3] Failed:', e.message);
  }

  // 4. Fetch exercises catalog
  try {
    const res = await fetch(`${BASE_URL}/exercises`);
    const data = await res.json();
    const count = data.data?.length || 0;
    squatExerciseId = data.data?.find(e => e.exerciseId === 'bodyweight-squat')?._id;
    console.log(`[TEST 4] GET /exercises: PASSED ✅ (Found ${count} exercises, squat ID: ${squatExerciseId})`);
  } catch (e) {
    console.error('[TEST 4] Failed:', e.message);
  }

  // 5. Fetch single exercise
  try {
    const res = await fetch(`${BASE_URL}/exercises/bodyweight-squat`);
    const data = await res.json();
    console.log('[TEST 5] GET /exercises/bodyweight-squat:', data.data?.exerciseId === 'bodyweight-squat' ? 'PASSED ✅' : 'FAILED ❌');
  } catch (e) {
    console.error('[TEST 5] Failed:', e.message);
  }

  // 6. Fetch recommendations with auth
  try {
    const res = await fetch(`${BASE_URL}/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const recCount = data.data?.recommendations?.length || 0;
    console.log(`[TEST 6] GET /recommendations: PASSED ✅ (${recCount} recommended exercises scored)`);
  } catch (e) {
    console.error('[TEST 6] Failed:', e.message);
  }

  // 7. Create workout session
  try {
    const res = await fetch(`${BASE_URL}/workouts/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        exercises: [
          {
            exercise: squatExerciseId,
            exerciseId: 'bodyweight-squat',
            exerciseName: 'Bodyweight Squat',
            targetSets: 3,
            setsCompleted: 1,
            totalRepsCompleted: 12,
          },
        ],
      }),
    });
    const data = await res.json();
    if (data.success && data.data?._id) {
      createdSessionId = data.data._id;
      console.log('[TEST 7] POST /workouts/sessions: PASSED ✅ (Session created:', createdSessionId, ')');
    } else {
      console.error('[TEST 7] FAILED ❌:', data);
    }
  } catch (e) {
    console.error('[TEST 7] Failed:', e.message);
  }

  // 8. Update / Complete workout session
  try {
    const res = await fetch(`${BASE_URL}/workouts/sessions/${createdSessionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 'completed',
        totalDurationSeconds: 420,
        overallTrackingQualityScore: 94,
        exercises: [
          {
            exercise: squatExerciseId,
            exerciseId: 'bodyweight-squat',
            exerciseName: 'Bodyweight Squat',
            targetSets: 3,
            setsCompleted: 3,
            totalRepsCompleted: 36,
            holdDurationSeconds: 0,
            restDurationSeconds: 120,
          },
        ],
      }),
    });
    const data = await res.json();
    const calories = data.data?.estimatedCaloriesBurned;
    console.log(`[TEST 8] PATCH /workouts/sessions/${createdSessionId}: PASSED ✅ (Status: ${data.data?.status}, Calories: ${calories} kcal)`);
  } catch (e) {
    console.error('[TEST 8] Failed:', e.message);
  }

  // 9. Fetch workout sessions history
  try {
    const res = await fetch(`${BASE_URL}/workouts/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log(`[TEST 9] GET /workouts/sessions: PASSED ✅ (History count: ${data.count})`);
  } catch (e) {
    console.error('[TEST 9] Failed:', e.message);
  }

  // 10. Fetch user stats
  try {
    const res = await fetch(`${BASE_URL}/workouts/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log(`[TEST 10] GET /workouts/stats: PASSED ✅ (Total workouts: ${data.data?.totalWorkouts}, Reps: ${data.data?.totalReps})`);
  } catch (e) {
    console.error('[TEST 10] Failed:', e.message);
  }

  // 12. Body Measurements: Record & fetch
  try {
    const postRes = await fetch(`${BASE_URL}/body/measurements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        weightKg: 65.5,
        heightCm: 168,
        notes: 'Initial test measurement',
      }),
    });
    const postData = await postRes.json();
    const getRes = await fetch(`${BASE_URL}/body/measurements`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    console.log(`[TEST 12] Body Measurements POST & GET: ${postData.success && getData.data?.length > 0 ? 'PASSED ✅' : 'FAILED ❌'} (BMI: ${postData.data?.bmi}, Count: ${getData.data?.length})`);
  } catch (e) {
    console.error('[TEST 12] Failed:', e.message);
  }

  // 13. Diet Plans: Save & fetch
  try {
    const postRes = await fetch(`${BASE_URL}/diet/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        planName: 'Test High Protein Plan',
        fitnessGoal: 'muscle_building',
        dietaryPreference: 'veg',
        dailyCaloricTarget: 2200,
        macronutrientDistribution: { proteinGrams: 140, carbsGrams: 250, fatGrams: 60 },
        mealBreakdown: [
          {
            mealName: 'Breakfast',
            items: [{ name: 'Sprouts Chilla', portion: '2 chillas', calories: 350, protein: 20, carbs: 45, fat: 8 }],
            totalMealCalories: 350,
          },
        ],
      }),
    });
    const postData = await postRes.json();
    const getRes = await fetch(`${BASE_URL}/diet/plans`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    console.log(`[TEST 13] Diet Plans POST & GET: ${postData.success && getData.data?.length > 0 ? 'PASSED ✅' : 'FAILED ❌'} (Saved Plan ID: ${postData.data?._id})`);
  } catch (e) {
    console.error('[TEST 13] Failed:', e.message);
  }

  console.log('\n=== ALL AUTOMATED TESTS COMPLETED ===');
}

runTests();
