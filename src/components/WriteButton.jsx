import React from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function WriteButton() {
  const { user } = useAuthContext();
  return (
    <div className='fixed bottom-8 right-8'>
      {user && (
        <div className='shadow-md w-14 h-14 flex justify-center items-center rounded-full z-10 bg-white hover:scale-125 transition-all hover:bg-black hover:text-white'>
          <Link to="/post/new" className="block">
            <BsPencilSquare className="text-2xl " />
          </Link>
        </div>
      )}
    </div>
  );
}

