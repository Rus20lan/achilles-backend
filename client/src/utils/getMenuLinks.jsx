import { useLocation } from 'react-router';

export const getMenuLinks = (pathname) => {
  const commonLinks = [
    { to: '/', text: 'Главная' },
    { to: '/auth/login', text: 'Вход' },
    { to: '/auth/register', text: 'Регистрация' },
  ];

  //   if (pathname.startsWith('/auth') || pathname.startsWith('/')) {
  //     return [
  //       ...commonLinks,
  //       { to: '/auth/login', text: 'Вход' },
  //       { to: '/auth/register', text: 'Регистрация' },
  //     ];
  //   }

  if (pathname.startsWith('/main') || pathname.startsWith('/title')) {
    return [...commonLinks, { to: '/main', text: 'Список объектов' }].filter(
      (link) => !link.to.includes('/auth')
    );
  }

  return commonLinks;
};
