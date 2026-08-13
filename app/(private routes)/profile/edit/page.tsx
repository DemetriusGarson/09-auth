'use client';
import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
// import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

export default function EditProfilePage() {
  // const user = useAuthStore(store => store.user);
  const setUser = useAuthStore(store => store.setUser);

  const [userData, setUserData] = useState<null | User>(null);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  // const { mutate } = useMutation({
  //   mutationFn: updateMe,
  //   onSuccess: (response: User) => {
  //     console.log(response);
  //     setUserData(response);
  //     setUser(response);
  //   },
  // });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDataResponse = await getMe();
        setUserData(userDataResponse);
      } catch {
        setError(true);
      }
    };
    fetchUser();
  }, [setUserData]);

  const handleSubmit = async (formData: FormData) => {
    const userNameToPatch = formData.get('username') as string;
    if (userData) {
      // mutate({
      //   username: userNameToPatch,
      //   email: userData.email,
      // });

      try {
        const updatedUser = await updateMe({
          username: userNameToPatch,
          email: userData.email,
        });
        setUserData(updatedUser);
        setUser(userData);

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
      {error && ErrorMessage}
      {userData && (
        <main className={css.mainContent}>
          <div className={css.profileCard}>
            <h1 className={css.formTitle}>Edit Profile</h1>

            <Image
              src={userData?.avatar}
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
                  defaultValue={userData?.username}
                />
              </div>

              <p>Email: {userData?.email}</p>

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
