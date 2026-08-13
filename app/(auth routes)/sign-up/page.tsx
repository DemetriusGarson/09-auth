'use client';
import { register, RegisterRequest } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUpPage.module.css';
import { ApiError } from '@/lib/api/api';

const SignUpPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  // Отримуємо метод із стора
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      // Типізуємо дані форми
      const formValues = Object.fromEntries(formData) as RegisterRequest;
      console.log(formValues);
      // Виконуємо запит
      const res = await register(formValues);

      // Виконуємо редірект або відображаємо помилку
      if (res) {
        setUser(res);
        // console.log('22222222222222222');
        router.push('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Oops... some error'
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form action={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>Error</p>}
      </form>
    </main>
  );
};

export default SignUpPage;
