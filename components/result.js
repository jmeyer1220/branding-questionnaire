import React from 'react';

const Result = ({ answers }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Answers</h2>
      <ul className="list-disc pl-5">
        {answers.map((answer, index) => (
          <li key={index}><strong>{answer.question}</strong>: {answer.answer}</li>
        ))}
      </ul>
    </div>
  );
};

export default Result;
