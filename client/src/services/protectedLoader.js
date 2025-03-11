import { useSelector } from 'react-redux';
import { redirect } from 'react-router';

export function protectedLoader() {
  const isAuth = useSelector((state) => state.auth.isAuth);

  if (!isAuth) {
    return redirect('/auth/login');
  }

  return null;
}
