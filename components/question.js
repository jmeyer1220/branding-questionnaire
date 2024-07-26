import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';

const Question = ({ question, options, onAnswer }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{question}</h2>
      <RadioGroup.Root className="flex flex-col space-y-2">
        {options.map((option, index) => (
          <RadioGroup.Item 
            key={index} 
            value={option.label} 
            className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
            onClick={() => onAnswer(option.label, option.next)}
          >
            {option.label}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
};

export default Question;



