const BASE_URL = 'http://localhost:5000/api/v1';

async function runDietAndSubscriptionSuite() {
  console.log('=== STARTING DIET & SUBSCRIPTION ENTITLEMENT TEST SUITE ===\n');

  // 1. Test Free Diet Generation (Public, Indian Veg & Jain)
  console.log('--- TEST 1: Free Diet Generation with Indian & Dietary Customization ---');
  const freeDietRes = await fetch(`${BASE_URL}/diet/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fitnessGoal: 'muscle_building',
      dietaryPreference: 'jain',
      allergies: ['dairy'],
      cuisine: 'Indian',
    }),
  });
  const freeDietData = await freeDietRes.json();
  const hasMeals = freeDietData.data?.meals?.breakfast && freeDietData.data?.meals?.lunch;
  const hasMacros = freeDietData.data?.meta?.macronutrients?.totalProteinGrams > 0;
  console.log('Test 1 (Free Indian diet generated with macros):', hasMeals && hasMacros ? 'PASSED ✅' : 'FAILED ❌', {
    breakfast: freeDietData.data?.meals?.breakfast?.title,
    protein: freeDietData.data?.meta?.macronutrients?.totalProteinGrams,
  });

  // 2. Register a new user for Entitlement Tests
  console.log('\n--- TEST 2: Free User Guard on Premium Diet Endpoints ---');
  const userEmail = `entitlement_diet_${Date.now()}@test.com`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Diet Entitlement Tester',
      email: userEmail,
      password: 'password123',
    }),
  });
  const regData = await regRes.json();
  const token = regData.token;

  // Attempt premium diet as Free user
  const freePremRes = await fetch(`${BASE_URL}/diet/premium-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fitnessGoal: 'fat_loss' }),
  });
  const freePremData = await freePremRes.json();
  const test2Passed = freePremRes.status === 403 && freePremData.code === 'PREMIUM_REQUIRED';
  console.log('Test 2 (Free user blocked from premium diet plan by backend guard):', test2Passed ? 'PASSED ✅' : 'FAILED ❌', freePremData.message);

  // 3. Upgrade user to Premium via authoritative endpoint
  console.log('\n--- TEST 3: Authoritative Upgrade & Premium Access ---');
  const upgradeRes = await fetch(`${BASE_URL}/auth/subscription/upgrade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const upgradeData = await upgradeRes.json();
  console.log('Upgrade status:', upgradeData.success ? 'PASSED ✅' : 'FAILED ❌', upgradeData.subscription?.plan);

  // Now call premium diet endpoint again
  const authPremRes = await fetch(`${BASE_URL}/diet/premium-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fitnessGoal: 'fat_loss' }),
  });
  const authPremData = await authPremRes.json();
  const test3Passed = authPremRes.status === 200 && authPremData.data?.weeklySchedule?.length === 7;
  console.log('Test 3 (Authorized premium weekly schedule & grocery list accessed):', test3Passed ? 'PASSED ✅' : 'FAILED ❌', {
    daysCount: authPremData.data?.weeklySchedule?.length,
    shoppingCategories: authPremData.data?.groceryShoppingList?.length,
  });

  // 4. Test Subscription Cancellation Access Retention Rule
  console.log('\n--- TEST 4: Subscription Cancellation Access Retention ---');
  const cancelRes = await fetch(`${BASE_URL}/auth/subscription/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const cancelData = await cancelRes.json();
  console.log('Cancellation response status:', cancelData.subscription?.status);

  // After cancellation, since endDate is still 30 days in future, CANCELLED user STILL has access!
  const statusRes = await fetch(`${BASE_URL}/auth/subscription/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const statusData = await statusRes.json();
  const stillHasAccess = statusData.data?.hasPremiumAccess === true;
  console.log('Test 4 (Cancelled user retains access until billing cycle endDate):', stillHasAccess ? 'PASSED ✅' : 'FAILED ❌');

  console.log('\n=== ALL DIET & SUBSCRIPTION TESTS COMPLETED ===');
}

runDietAndSubscriptionSuite();
