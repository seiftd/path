import { auth, currentUser } from '@clerk/nextjs/server';
import { createUser, getUserById } from './db';

export const getCurrentUser = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;

    // Check if user exists in our database
    let dbUser = await getUserById(user.id);
    
    if (!dbUser) {
      // Create user in our database
      dbUser = await createUser({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        language: 'en'
      });
    }

    return {
      ...user,
      dbUser
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const requireAuth = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Authentication required');
  }
  return userId;
};

export const isAdmin = async () => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  // Check if user has admin role in Clerk
  const isAdminUser = user.publicMetadata?.role === 'admin' || 
                     user.publicMetadata?.isAdmin === true;
  
  return isAdminUser;
};

export const getUserLanguage = async () => {
  const user = await getCurrentUser();
  return user?.dbUser?.language || 'en';
};

export const updateUserLanguage = async (language: string) => {
  const user = await getCurrentUser();
  if (!user) return false;

  // Update user language in database
  const connection = await import('./db').then(m => m.default);
  try {
    await connection.execute(
      'UPDATE users SET language = ? WHERE id = ?',
      [language, user.id]
    );
    return true;
  } catch (error) {
    console.error('Error updating user language:', error);
    return false;
  }
};
