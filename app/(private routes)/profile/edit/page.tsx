'use client';
import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { updateMe } from '@/lib/api/clientApi';
import { useState } from 'react';
// import { User } from '@/types/user';
// import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

export default function EditProfilePage() {
  const user = useAuthStore(store => store.user);
  const setUser = useAuthStore(store => store.setUser);

  // const [userData, setUserData] = useState<null | User>(null);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const userDataResponse = await getMe();
  //       setUserData(userDataResponse);
  //     } catch {
  //       setError(true);
  //     }
  //   };
  //   fetchUser();
  // }, [setUserData]);

  const handleSubmit = async (formData: FormData) => {
    const userNameToPatch = formData.get('username') as string;
    if (user) {
      try {
        const updatedUser = await updateMe(userNameToPatch);
        // setUserData(updatedUser);
        setUser(updatedUser);

        router.push('/profile');
      } catch {
        setError(true);
      }
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <>
      {error && <ErrorMessage />}
      {user && (
        <main className={css.mainContent}>
          <div className={css.profileCard}>
            <h1 className={css.formTitle}>Edit Profile</h1>

            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />

            <form action={handleSubmit} className={css.profileInfo}>
              <div className={css.usernameWrapper}>
                <label htmlFor="username">Username:</label>
                <input
                  name="username"
                  id="username"
                  type="text"
                  className={css.input}
                  defaultValue={user.username}
                />
              </div>

              <p>Email: {user.email}</p>

              <div className={css.actions}>
                <button type="submit" className={css.saveButton}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={css.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      )}
    </>
  );
}
