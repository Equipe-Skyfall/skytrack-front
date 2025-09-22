import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-slate-900 font-poppins p-8">
      <section className="text-center w-full max-w-2xl px-6 py-12">
        <img
          src="../../public/notfound_cloud.png"
          alt="Ilustração de uma nuvem triste representando erro 404"
          className="mx-auto w-36 h-36 mb-8 opacity-80 animate-fade-in-up"
        />
        <h1 className="text-6xl font-bold mb-4 animate-fade-in-up delay-100">
          404
        </h1>
        <h2 className="text-xl mb-6 animate-fade-in-up delay-200">
          Página não encontrada
        </h2>
        <p className="text-sm text-gray-700 mb-10 leading-relaxed animate-fade-in-up delay-300">
          Parece que o tempo fechou por aqui... Mas não se preocupe, vamos te ajudar a voltar para casa!
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-[0.3rem] bg-slate-900 text-white font-medium text-sm hover:bg-slate-700 transition-colors animate-fade-in-up delay-400"
        >
          Voltar para a Página Inicial
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
