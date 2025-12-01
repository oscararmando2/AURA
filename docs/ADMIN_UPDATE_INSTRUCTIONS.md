# Admin Email Update Instructions

## Changes Made

The admin email has been updated from `admin@aura.com` to `7151596586` throughout the application.

### Files Updated:
1. **index.html** - 12 occurrences updated
   - 2 code changes (authentication checks)
   - 10 comment/documentation updates

2. **firestore.rules** - 2 occurrences updated
   - Admin access rules for reservas collection
   - Admin access rules for usuarios collection

## Firebase Configuration Required

After deploying these changes to your Firebase hosting, you **MUST** update the Firebase Authentication user:

### Option 1: Update Existing User (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your AURA project
3. Navigate to **Authentication** > **Users**
4. Find the user with email `admin@aura.com`
5. Click on the user to edit
6. Change the email to `7151596586`
7. Save the changes

### Option 2: Create New Admin User
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your AURA project
3. Navigate to **Authentication** > **Users**
4. Click **Add User**
5. Enter:
   - Email: `7151596586`
   - Password: (use the same password as before, or create a new secure password)
6. Click **Add User**
7. (Optional) Delete the old `admin@aura.com` user

## Firestore Rules Update

The Firestore security rules have also been updated. Deploy them using:

```bash
firebase deploy --only firestore:rules
```

Or manually update them in Firebase Console:
1. Go to **Firestore Database** > **Rules**
2. The rules have already been updated in `firestore.rules` file
3. Copy and paste if needed, or deploy via CLI

## Verification

After updating Firebase Authentication:
1. Open your AURA application
2. Try to log in to the admin panel using:
   - Email: `7151596586`
   - Password: (your admin password)
3. Verify that you can access the admin calendar and reservation management

## Important Notes

- The new admin identifier is `7151596586`
- All authentication checks now use this new email
- Firestore security rules now grant admin privileges only to `7151596586`
- Regular users are unaffected by this change

## Rollback Instructions

If you need to revert these changes:
1. Use `git revert` to undo the commit
2. Update Firebase Authentication user back to `admin@aura.com`
3. Redeploy the Firestore rules
