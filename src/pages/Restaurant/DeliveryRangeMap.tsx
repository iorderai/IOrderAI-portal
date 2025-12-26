import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Circle, Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import type { Coordinates } from '../../types';

interface DeliveryRangeMapProps {
  center: Coordinates;
  selfRadius: number;
  uberMaxRadius: number;
  onRadiusChange: (radius: number) => void;
  onSave: () => void;
}

const MILES_TO_METERS = 1609.34;

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const DeliveryRangeMap: React.FC<DeliveryRangeMapProps> = ({
  center,
  selfRadius,
  uberMaxRadius,
  onRadiusChange,
  onSave,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(selfRadius.toString());
  const [saved, setSaved] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  useEffect(() => {
    setInputValue(selfRadius.toString());
  }, [selfRadius]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setInputValue(value.toString());
    onRadiusChange(value);
  }, [onRadiusChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0.5 && numValue <= 10) {
      onRadiusChange(numValue);
    }
  }, [onRadiusChange]);

  const handleInputBlur = useCallback(() => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue < 0.5) {
      setInputValue('0.5');
      onRadiusChange(0.5);
    } else if (numValue > 10) {
      setInputValue('10');
      onRadiusChange(10);
    }
  }, [inputValue, onRadiusChange]);

  const handleSave = useCallback(() => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [onSave]);

  // Show API key missing message if no key provided
  if (!apiKey) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{t('restaurant.deliveryRange')}</h2>
        </div>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium text-yellow-800">{t('restaurant.mapApiKeyMissing')}</p>
                <p className="text-sm text-yellow-700 mt-1">{t('restaurant.mapApiKeyHint')}</p>
              </div>
            </div>
          </div>

          {/* Still show the slider control even without map */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('restaurant.selfDeliveryRadius')}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={selfRadius}
                  onChange={handleSliderChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-600">{t('restaurant.miles')}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{t('restaurant.radiusHint')}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">
                  {t('restaurant.selfDeliveryZone')}: {selfRadius} {t('restaurant.miles')} {t('restaurant.withinRadius')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-600">
                  {t('restaurant.uberDeliveryZone')}: {selfRadius} {t('restaurant.beyondRadius')} {uberMaxRadius} {t('restaurant.miles')}
                </span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              {saved ? t('restaurant.settingsSaved') : t('restaurant.saveSettings')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-red-500">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{t('restaurant.deliveryRange')}</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Map */}
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={11}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {/* Uber delivery zone (outer circle) */}
            <Circle
              center={center}
              radius={uberMaxRadius * MILES_TO_METERS}
              options={{
                fillColor: '#F97316',
                fillOpacity: 0.15,
                strokeColor: '#EA580C',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />

            {/* Self delivery zone (inner circle) */}
            <Circle
              center={center}
              radius={selfRadius * MILES_TO_METERS}
              options={{
                fillColor: '#3B82F6',
                fillOpacity: 0.25,
                strokeColor: '#1D4ED8',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />

            {/* Restaurant marker */}
            <Marker
              position={center}
              title="Restaurant Location"
            />
          </GoogleMap>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('restaurant.selfDeliveryRadius')}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={selfRadius}
                onChange={handleSliderChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-600">{t('restaurant.miles')}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{t('restaurant.radiusHint')}</p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">
                {t('restaurant.selfDeliveryZone')}: {selfRadius} {t('restaurant.miles')} {t('restaurant.withinRadius')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-500" />
              <span className="text-sm text-gray-600">
                {t('restaurant.uberDeliveryZone')}: {selfRadius} {t('restaurant.beyondRadius')} {uberMaxRadius} {t('restaurant.miles')}
              </span>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className={`w-full py-2.5 px-4 font-medium rounded-lg transition-colors ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('restaurant.settingsSaved')}</span>
              </span>
            ) : (
              t('restaurant.saveSettings')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRangeMap;
