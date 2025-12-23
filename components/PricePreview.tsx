'use client';

import { useEffect, useState } from 'react';
import { forecastApi, calculateDynamicPrice } from '@/lib/api';

interface PricePreviewProps {
  basePrice: number;
  location: string;
  startTime: string;
}

export default function PricePreview({ basePrice, location, startTime }: PricePreviewProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!startTime || !location) {
      setPrice(null);
      setTemperature(null);
      return;
    }

    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError('');
        const date = new Date(startTime).toISOString().split('T')[0];
        const forecast = await forecastApi.getForecast(location, date);
        const calculatedPrice = calculateDynamicPrice(basePrice, forecast.temperature);
        setTemperature(forecast.temperature);
        setPrice(calculatedPrice);
      } catch (err: any) {
        setError('Unable to calculate price');
        setPrice(null);
        setTemperature(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [basePrice, location, startTime]);

  if (!startTime || !location) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Calculating price...</p>
      </div>
    );
  }

  if (error || price === null) {
    return (
      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">{error || 'Price calculation unavailable'}</p>
      </div>
    );
  }

  const priceDiff = price - basePrice;
  const surcharge = priceDiff > 0 ? priceDiff : 0;

  return (
    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Base Price:</span>
          <span className="text-sm text-gray-900 dark:text-white">${basePrice.toFixed(2)}</span>
        </div>
        {surcharge > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Weather Surcharge ({temperature?.toFixed(1)}°C):
            </span>
            <span className="text-sm text-gray-900 dark:text-white">+${surcharge.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-2 border-t border-green-200 dark:border-green-700 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">Total Price:</span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">${price.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Price for 1 hour booking. Temperature deviation from 21°C: {Math.abs((temperature || 0) - 21).toFixed(1)}°C
        </p>
      </div>
    </div>
  );
}

