import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { mockRestaurant } from '../../mock/data';
import DeliveryRangeMap from './DeliveryRangeMap';

const Restaurant: React.FC = () => {
  const { t } = useTranslation();
  const [restaurant, setRestaurant] = useState(mockRestaurant);

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; text: string; dot: string }> = {
      active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
      paused: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
      terminated: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    };
    return styles[status];
  };

  const getDeliveryModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      uber: t('restaurant.uber'),
      self: t('restaurant.self'),
      hybrid: t('restaurant.hybrid'),
    };
    return labels[mode];
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: t('restaurant.active'),
      paused: t('restaurant.paused'),
      terminated: t('restaurant.terminated'),
    };
    return labels[status];
  };

  const handleRadiusChange = useCallback((radius: number) => {
    setRestaurant(prev => ({
      ...prev,
      deliverySettings: prev.deliverySettings
        ? { ...prev.deliverySettings, selfDeliveryRadius: radius }
        : {
            selfDeliveryRadius: radius,
            uberMaxRadius: 10,
            coordinates: { lat: 37.7749, lng: -122.4194 },
          },
    }));
  }, []);

  const handleSaveSettings = useCallback(() => {
    // In production, this would call an API to save the settings
    console.log('Saving delivery settings:', restaurant.deliverySettings);
  }, [restaurant.deliverySettings]);

  const statusStyle = getStatusStyle(restaurant.status);

  const infoItems = [
    {
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      label: t('restaurant.name'),
      value: restaurant.name,
    },
    {
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      label: t('restaurant.address'),
      value: restaurant.address,
    },
    {
      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
      label: t('restaurant.phone'),
      value: restaurant.phone,
    },
    {
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      label: t('restaurant.joinDate'),
      value: new Date(restaurant.joinDate).toLocaleDateString(),
    },
  ];

  // Check if delivery range settings should be shown (hybrid or self delivery mode)
  const showDeliveryRangeSettings = restaurant.deliveryMode === 'hybrid' || restaurant.deliveryMode === 'self';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t('restaurant.title')}</h1>
      </div>

      {/* Status banner */}
      <div className={`${statusStyle.bg} rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${statusStyle.dot}`} />
            <div>
              <p className="text-sm text-gray-600">{t('restaurant.status')}</p>
              <p className={`text-lg font-semibold ${statusStyle.text}`}>
                {getStatusLabel(restaurant.status)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{t('restaurant.deliveryMode')}</p>
            <p className="text-lg font-semibold text-gray-800">
              {getDeliveryModeLabel(restaurant.deliveryMode)}
            </p>
          </div>
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{t('restaurant.basicInfo')}</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-6">
            {infoItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-base font-medium text-gray-800 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery mode explanation */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{t('restaurant.deliveryMode')}</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {(['uber', 'self', 'hybrid'] as const).map((mode) => (
              <div
                key={mode}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  restaurant.deliveryMode === mode
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    restaurant.deliveryMode === mode
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {restaurant.deliveryMode === mode && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      restaurant.deliveryMode === mode ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {mode === 'uber' && t('restaurant.uber')}
                      {mode === 'self' && t('restaurant.self')}
                      {mode === 'hybrid' && t('restaurant.hybrid')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t(`restaurant.deliveryModeDesc.${mode}`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Range Settings - only show for hybrid or self delivery mode */}
      {showDeliveryRangeSettings && restaurant.deliverySettings && (
        <DeliveryRangeMap
          center={restaurant.deliverySettings.coordinates}
          selfRadius={restaurant.deliverySettings.selfDeliveryRadius}
          uberMaxRadius={restaurant.deliverySettings.uberMaxRadius}
          onRadiusChange={handleRadiusChange}
          onSave={handleSaveSettings}
        />
      )}

      {/* Contact support note */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-600">
              {t('restaurant.deliveryMode') === '配送模式'
                ? '如需修改餐馆信息或配送模式，请联系您的业务经理。'
                : 'To modify restaurant information or delivery mode, please contact your business manager.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
