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
      base: { checked: true, quantity: 1, price: 2500, multiplier: 0, subjectiveFactor: 1, sizeFactor: 0.25 },
      onSite: { checked: false, quantity: 1, price: 1000,  multiplier: 7500, subjectiveFactor: 0, sizeFactor: 0 },
      survey: { checked: false, quantity: 1, price: 500, multiplier: 500, subjectiveFactor: 0.5, sizeFactor: 1 },
      demographicReports: { checked: true, quantity: 1, price: 100, multiplier: 175, subjectiveFactor: 0, sizeFactor: 0 },
      focusGroups: { checked: false, quantity: 1, price: 500, multiplier: 500, subjectiveFactor: 1, sizeFactor: 1 },
      brandAudit: { checked: false, quantity: 1, price: 250, multiplier: 250, subjectiveFactor: 0, sizeFactor: 1 },
      webAudit: { checked: false, quantity: 1, price: 250, multiplier: 250, subjectiveFactor: 0, sizeFactor: 1 },
    },
    consulting: {
      valuePropositions: { checked: true, quantity: 1, price: 100, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1 },
      brandPromise: { checked: true, quantity: 1, price: 200, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1 },
      coreStory: { checked: true, quantity: 1, price: 200, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1  },
      oneLiner: { checked: true, quantity: 1, price: 200, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1 },
    },
    messaging: {
      base: { checked: true, quantity: 1, price: 1000, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1.5 },
      missionVisionValues: { checked: true, quantity: 1, price: 7500, subjectiveFactor: 0, sizeFactor: 0 },
      nameChange: { checked: true, quantity: 1, price: 5000, subjectiveFactor: 0, sizeFactor: 0 },
    },
    visual: {
      base: { checked: true, quantity: 1, price: 1000, subjectiveFactor: 0, sizeFactor: 0 },
      persona: { checked: true, quantity: 1, price: 150, subjectiveFactor: 0, sizeFactor: 0 },
    },
  });

  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] = useState({
    discovery: 0,
    messaging: 0,
    visual: 0,
    consulting: 0,
  });

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
    const breakdown = {
      discovery: 0,
      messaging: 0,
      visual: 0,
      consulting: 0,
    };

    const applyFactors = (price, item) => {
      let adjustedPrice = price;
      adjustedPrice *= (1 + item.subjectiveFactor / 100);
      adjustedPrice *= (1 + item.sizeFactor / 100);
      return adjustedPrice;
    };

    Object.entries(state.discovery).forEach(([key, item]) => {
      if (item.checked) {
        const itemTotal = applyFactors(item.price * item.quantity, item);
        sum += itemTotal;
        breakdown.discovery += itemTotal;
      }
    });
    Object.entries(state.messaging).forEach(([key, item]) => {
      if (item.checked) {
        const itemTotal = applyFactors(item.price * item.quantity, item);
        sum += itemTotal;
        breakdown.messaging += itemTotal;
      }
    });
    Object.entries(state.visual).forEach(([key, item]) => {
      if (item.checked) {
        const itemTotal = applyFactors(item.price * item.quantity, item);
        sum += itemTotal;
        breakdown.visual += itemTotal;
      }
    });
    Object.entries(state.consulting).forEach(([key, item]) => {
      if (item.checked) {
        const itemTotal = applyFactors(item.price * item.quantity, item);
        sum += itemTotal;
        breakdown.consulting += itemTotal;
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
    setBreakdown(breakdown);
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