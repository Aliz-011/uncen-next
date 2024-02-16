import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="h-full mx-auto md:max-w-5xl">{children}</div>;
};

export default AuthLayout;
