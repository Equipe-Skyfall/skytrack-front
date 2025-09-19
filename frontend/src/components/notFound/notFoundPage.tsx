import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-8 font-sans text-gray-700">
      <div className="text-center w-full max-w-3xl px-6 py-12"> {/* Aumentei o max-w para usar mais espaço */}
        <img
          src="../../../public/nuvem-tristonha.png"
          alt="Página Não Encontrada"
          className="mx-auto w-40 h-40 mb-8 opacity-80 animate-fade-in-up" // Aumentei o tamanho da nuvem
        />
        <h2 className="text-7xl font-extrabold text-gray-800 mb-4 tracking-tight animate-fade-in-up delay-100">
          404
        </h2>
        <p className="text-2xl text-gray-600 mb-6 animate-fade-in-up delay-200">
          Página não encontrada.
        </p>
        <p className="text-lg text-gray-500 mb-12 leading-relaxed max-w-xl mx-auto animate-fade-in-up delay-300">
          Parece que o tempo fechou por aqui... Mas não se preocupe, vamos te ajudar a voltar para casa!
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out animate-fade-in-up delay-400"
        >
          <svg className="mr-3 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;