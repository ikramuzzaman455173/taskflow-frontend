
import React, { useState } from 'react';
import Login from '@/components/Login';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Login 
      isLogin={isLogin} 
      onToggleMode={() => setIsLogin(!isLogin)} 
    />
  );
}
