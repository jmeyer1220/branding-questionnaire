import Head from 'next/head';
import Quiz from '@/components/quiz.js';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>Branding Questionnaire Quiz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">ArtSpeak Branding Quiz</h1>
        <Quiz />
      </main>
    </div>
  );
}
