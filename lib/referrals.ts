import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function processReferralRewards(newUserId: string) {
  try {
    // 1. Find the new user who just activated/upgraded
    const newUser = await User.findById(newUserId);
    if (!newUser || !newUser.referredBy) {
      console.log("No referral code used. Skipping rewards.");
      return { success: false, message: 'No referrer' };
    }

    // Define the exact payouts for your 3 levels
    const PAYOUTS = {
      LEVEL_1: 1800, // Direct
      LEVEL_2: 200,  // 1st Indirect
      LEVEL_3: 70    // 2nd Indirect
    };

    // ==========================================
    // LEVEL 1: Direct Referral (The person who shared the link)
    // ==========================================
    const level1Upline = await User.findOne({ referralCode: newUser.referredBy });

    if (level1Upline) {
      // Credit Level 1
      level1Upline.referralBalance = (level1Upline.referralBalance || 0) + PAYOUTS.LEVEL_1;
      await level1Upline.save();

      // Log Transaction
      await Transaction.create({
        userId: level1Upline._id,
        type: 'Earning',
        wallet: 'Referral',
        method: `Direct Referral Bonus (${newUser.username})`,
        amount: PAYOUTS.LEVEL_1,
        status: 'Success'
      });

      // ==========================================
      // LEVEL 2: 1st Indirect Referral
      // ==========================================
      if (level1Upline.referredBy) {
        const level2Upline = await User.findOne({ referralCode: level1Upline.referredBy });

        if (level2Upline) {
          // Credit Level 2
          level2Upline.referralBalance = (level2Upline.referralBalance || 0) + PAYOUTS.LEVEL_2;
          await level2Upline.save();

          // Log Transaction
          await Transaction.create({
            userId: level2Upline._id,
            type: 'Earning',
            wallet: 'Referral',
            method: `Level 2 Indirect Bonus (${newUser.username})`,
            amount: PAYOUTS.LEVEL_2,
            status: 'Success'
          });

          // ==========================================
          // LEVEL 3: 2nd Indirect Referral
          // ==========================================
          if (level2Upline.referredBy) {
            const level3Upline = await User.findOne({ referralCode: level2Upline.referredBy });

            if (level3Upline) {
              // Credit Level 3
              level3Upline.referralBalance = (level3Upline.referralBalance || 0) + PAYOUTS.LEVEL_3;
              await level3Upline.save();

              // Log Transaction
              await Transaction.create({
                userId: level3Upline._id,
                type: 'Earning',
                wallet: 'Referral',
                method: `Level 3 Indirect Bonus (${newUser.username})`,
                amount: PAYOUTS.LEVEL_3,
                status: 'Success'
              });
            }
          }
        }
      }
    }

    return { success: true, message: 'Referral tree updated successfully' };

  } catch (error) {
    console.error("Critical Error in Referral Engine:", error);
    return { success: false, message: 'Referral engine failed' };
  }
}