import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const PricingCalculator = () => {
  const [state, setState] = useState({
    subjectiveFactor: 0,
    sizeFactor: 0,
    attendance: 0,
    annualRevenue: 0,
    discovery: {
      base: { checked: true, quantity: 1, price: 2500, multiplier: 0, subjectiveFactor: 1, sizeFactor: 0.25 },
      localOnSite: { checked: false, quantity: 1, price: 3000, multiplier: 3000, subjectiveFactor: 1, sizeFactor: 0.5 },
      onSite: { checked: false, quantity: 1, price: 1000, multiplier: 7500, subjectiveFactor: 0, sizeFactor: 0 },
      survey: { checked: false, quantity: 1, price: 500, multiplier: 500, subjectiveFactor: 0.5, sizeFactor: 1 },
      demographicReports: { checked: true, quantity: 1, price: 100, multiplier: 175, subjectiveFactor: 0, sizeFactor: 0 },
      focusGroups: { checked: false, quantity: 1, price: 500, multiplier: 500, subjectiveFactor: 1, sizeFactor: 1 },
      brandAudit: { checked: false, quantity: 1, price: 250, multiplier: 250, subjectiveFactor: 0, sizeFactor: 1 },
      webAudit: { checked: false, quantity: 1, price: 250, multiplier: 250, subjectiveFactor: 0, sizeFactor: 1 },
    },
    consulting: {
      diagnostic: { checked: false, quantity: 1, price: 0, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1 },
      missionVisionValues: { checked: false, quantity: 1, price: 7500, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1 },
      nameChange: { checked: false, quantity: 1, price: 5000, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1 },
      structureAndSystems: { checked: false, quantity: 1, price: 0, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1 },
      leadershipCulture: { checked: false, quantity: 1, price: 2700, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1 },
    },
    messaging: {
      base: { checked: true, quantity: 1, price: 1000, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1.5 },
      persona: { checked: true, quantity: 3, price: 150, multiplier: 150, subjectiveFactor: 1, sizeFactor: 1.5 },
      archetype: { checked: true, quantity: 1, price: 150, multiplier: 150, subjectiveFactor: 1, sizeFactor: 1.5 },
      toneWords: { checked: true, quantity: 2, price: 150, multiplier: 50, subjectiveFactor: 1, sizeFactor: 1.5 },
      valuePropositions: { checked: true, quantity: 5, price: 100, multiplier: 125, subjectiveFactor: 1, sizeFactor: 1.5 },
      brandPromise: { checked: true, quantity: 1, price: 200, multiplier: 150, subjectiveFactor: 1, sizeFactor: 1.5 },
      coreStory: { checked: true, quantity: 1, price: 200, multiplier: 400, subjectiveFactor: 2, sizeFactor: 1.5 },
      oneLiner: { checked: true, quantity: 1, price: 200, multiplier: 150, subjectiveFactor: 1, sizeFactor: 1.5 },
    },
    visual: {
      base: { checked: true, quantity: 1, price: 750, multiplier: 0, subjectiveFactor: 1, sizeFactor: 1.5 },
      logo: { checked: false, quantity: 2, price: 750, multiplier: 250, subjectiveFactor: 2, sizeFactor: 1.5 },
      styleOverview: { checked: false, quantity: 2, price: 750, multiplier: 250, subjectiveFactor: 1, sizeFactor: 1.5 },
      brandGuide: { checked: false, quantity: 1, price: 750, multiplier: 150, subjectiveFactor: 1, sizeFactor: 1.5 },
      pulseWords: { checked: false, quantity: 3, price: 150, multiplier: 50, subjectiveFactor: 1, sizeFactor: 1.5 },
    },
  });

  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] = useState({
    discovery: 0,
    consulting: 0,
    messaging: 0,
    visual: 0,
  });

  const handleSliderChange = (field, value) => {
    setState(prevState => ({
      ...prevState,
      [field]: value[0]
    }));
  };

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
    const newBreakdown = {
      discovery: 0,
      consulting: 0,
      messaging: 0,
      visual: 0,
    };

    const applyFactors = (price, item) => {
      let adjustedPrice = price;
      adjustedPrice *= (1 + item.subjectiveFactor * state.subjectiveFactor / 100);
      adjustedPrice *= (1 + item.sizeFactor * state.sizeFactor / 100);
      return adjustedPrice;
    };

    Object.entries(state).forEach(([category, items]) => {
      if (typeof items === 'object' && items !== null) {
        Object.entries(items).forEach(([key, item]) => {
          if (item.checked || key === 'base') {
            const basePrice = item.price + item.multiplier;
            const itemTotal = applyFactors(basePrice * item.quantity, item);
            sum += itemTotal;
            newBreakdown[category] += itemTotal;
          }
        });
      }
    });

    if (state.attendance > 0) {
      sum *= (1 + state.attendance / 1000);
    }
    if (state.annualRevenue > 0) {
      sum *= (1 + state.annualRevenue / 1000000);
    }

    setTotal(sum);
    setBreakdown(newBreakdown);
  };

  useEffect(() => {
    calculateTotal();
  }, [state]);


  const renderCategory = (category, title) => (
    <Card className="mb-8 overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      <CardHeader className="bg-gray-100 dark:bg-gray-700 py-4 px-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h2>
      </CardHeader>
      <CardContent className="p-6">
        {Object.entries(state[category]).map(([key, item]) => (
          key !== 'base' && (
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
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">${(item.price + item.multiplier).toFixed(2)}</span>
              </div>
            </div>
          )
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
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="subjectiveFactor">Subjective Factor (%)</Label>
            <Slider
              id="subjectiveFactor"
              min={0}
              max={100}
              step={1}
              value={[state.subjectiveFactor]}
              onValueChange={(value) => handleSliderChange('subjectiveFactor', value)}
              className="mt-2"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{state.subjectiveFactor}%</span>
          </div>
          <div>
            <Label htmlFor="sizeFactor">Size Factor (%)</Label>
            <Slider
              id="sizeFactor"
              min={0}
              max={100}
              step={1}
              value={[state.sizeFactor]}
              onValueChange={(value) => handleSliderChange('sizeFactor', value)}
              className="mt-2"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{state.sizeFactor}%</span>
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
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">Pricing Calculator</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          {renderFactors()}
          {renderCategory('discovery', 'Discovery')}
          {renderCategory('consulting', 'Consulting')}
          {renderCategory('messaging', 'Messaging')}
          {renderCategory('visual', 'Visual')}
        </div>
        <div className="w-full lg:w-1/3">
          <div className="sticky top-8">
            <Card className="overflow-hidden shadow-lg bg-white dark:bg-gray-800">
              <CardHeader className="bg-gray-100 dark:bg-gray-700 py-4 px-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Total Breakdown</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(breakdown).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-lg capitalize text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="text-lg font-medium text-gray-900 dark:text-gray-100">${amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800 dark:text-white">Grand Total</span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
