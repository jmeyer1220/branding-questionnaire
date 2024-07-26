import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PricingCalculator = () => {
  const [state, setState] = useState({
    subjectiveFactor: 0,
    sizeFactor: 0,
    attendance: 0,
    annualRevenue: 0,
    discovery: {
      base: { checked: true, quantity: 1, price: 2500 },
      localOnSite: { checked: false, quantity: 1, price: 3000 },
      onSite: { checked: false, quantity: 1, price: 8500 },
      survey: { checked: false, quantity: 1, price: 1000 },
      demographicReports: { checked: true, quantity: 1, price: 275 },
      focusGroups: { checked: false, quantity: 1, price: 1000 },
      brandAudit: { checked: false, quantity: 1, price: 500 },
      webAudit: { checked: false, quantity: 1, price: 500 },
    },
    messaging: {
      base: { checked: true, quantity: 1, price: 1000 },
      persona: { checked: true, quantity: 3, price: 600 },
      archetype: { checked: true, quantity: 1, price: 300 },
      toneWords: { checked: true, quantity: 2, price: 250 },
      valuePropositions: { checked: true, quantity: 5, price: 725 },
      brandPromise: { checked: true, quantity: 1, price: 350 },
      coreStory: { checked: true, quantity: 1, price: 600 },
      oneLiner: { checked: true, quantity: 1, price: 350 },
    },
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [state]);

  const handleInputChange = (field, value) => {
    setState(prevState => ({
      ...prevState,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleCheckboxChange = (category, item) => {
    setState(prevState => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [item]: {
          ...prevState[category][item],
          checked: !prevState[category][item].checked,
        },
      },
    }));
  };

  const handleQuantityChange = (category, item, value) => {
    setState(prevState => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [item]: {
          ...prevState[category][item],
          quantity: parseInt(value) || 0,
        },
      },
    }));
  };

  const calculateTotal = () => {
    let sum = 0;
    Object.values(state.discovery).forEach(item => {
      if (item.checked) {
        sum += item.price * item.quantity;
      }
    });
    Object.values(state.messaging).forEach(item => {
      if (item.checked) {
        sum += item.price * item.quantity;
      }
    });

    sum *= (1 + state.subjectiveFactor / 100);
    sum *= (1 + state.sizeFactor / 100);

    if (state.attendance > 0) {
      sum *= (1 + state.attendance / 1000);
    }
    if (state.annualRevenue > 0) {
      sum *= (1 + state.annualRevenue / 1000000);
    }

    setTotal(sum);
  };

  const renderCategory = (category, title) => (
    <Card className="mb-8 overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      <CardHeader className="bg-gray-100 dark:bg-gray-700 py-4 px-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h2>
      </CardHeader>
      <CardContent className="p-6">
        {Object.entries(state[category]).map(([key, item]) => (
          <div key={key} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="flex items-center space-x-4">
              <Checkbox
                id={`${category}-${key}`}
                checked={item.checked}
                onCheckedChange={() => handleCheckboxChange(category, key)}
                className="border-2 border-gray-300 dark:border-gray-600"
              />
              <Label htmlFor={`${category}-${key}`} className="text-lg text-gray-700 dark:text-gray-300">{key}</Label>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(category, key, e.target.value)}
                className="w-20 text-right"
                min="1"
              />
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">${item.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderFactors = () => (
    <Card className="mb-8 overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      <CardHeader className="bg-gray-100 dark:bg-gray-700 py-4 px-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Client Factors</h2>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subjectiveFactor">Subjective Factor (%)</Label>
            <Input
              id="subjectiveFactor"
              type="number"
              value={state.subjectiveFactor}
              onChange={(e) => handleInputChange('subjectiveFactor', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sizeFactor">Size Factor (%)</Label>
            <Input
              id="sizeFactor"
              type="number"
              value={state.sizeFactor}
              onChange={(e) => handleInputChange('sizeFactor', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="attendance">Church Attendance</Label>
            <Input
              id="attendance"
              type="number"
              value={state.attendance}
              onChange={(e) => handleInputChange('attendance', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
            <Input
              id="annualRevenue"
              type="number"
              value={state.annualRevenue}
              onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">Pricing Calculator</h1>
      {renderFactors()}
      {renderCategory('discovery', 'Discovery')}
      {renderCategory('messaging', 'Messaging')}
      <div className="text-3xl font-bold mt-8 text-right text-gray-900 dark:text-white">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
};

export default PricingCalculator;