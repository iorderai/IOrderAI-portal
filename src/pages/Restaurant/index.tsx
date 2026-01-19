import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockRestaurant } from '../../mock/data';

const Restaurant: React.FC = () => {
  const { t } = useTranslation();
  const restaurant = mockRestaurant;
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

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
        
        {/* Notice banner - 放在配送模式上方 */}
        <div className="mx-6 mt-6 mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">
              {t('restaurant.deliveryModeNotice')}
            </p>
          </div>
        </div>

                <div className="px-6 pb-6">
          <div className="space-y-4">
            {(['uber', 'self', 'hybrid'] as const).map((mode, index) => {
              const isSelected = restaurant.deliveryMode === mode;
              const isLocked = !isSelected;
              
              return (
                <div
                  key={mode}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75'
                  }`}
                  style={{ zIndex: hoveredMode === mode ? 50 : 3 - index }}
                  onMouseEnter={() => isLocked && setHoveredMode(mode)}
                  onMouseLeave={() => setHoveredMode(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          isSelected ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {mode === 'uber' && t('restaurant.uber')}
                          {mode === 'self' && t('restaurant.self')}
                          {mode === 'hybrid' && t('restaurant.hybrid')}
                        </p>
                        <p className={`text-sm mt-1 ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                          {t(`restaurant.deliveryModeDesc.${mode}`)}
                        </p>
                      </div>
                    </div>
                    
                    {/* 锁定图标 + Tooltip 容器 */}
                    {isLocked && (
                      <div className="relative flex-shrink-0 group">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        
                        {/* Hover Tooltip - 显示在锁定图标左侧 */}
                        {hoveredMode === mode && (
                          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 z-[100]">
                            <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {t('restaurant.contactToSwitch')}
                              </div>
                              {/* Arrow pointing right */}
                              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delivery Range Settings - Read Only Display */}
      {restaurant.deliverySettings && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">{t('restaurant.deliveryRange')}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t('restaurant.readOnly')}
            </span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Self Delivery Range */}
              <div className="bg-blue-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">{t('restaurant.selfDeliveryZone')}</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {restaurant.deliverySettings.selfDeliveryRadius} {t('restaurant.miles')}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-blue-600/80">
                  {t('restaurant.withinRadius')} {restaurant.deliverySettings.selfDeliveryRadius} {t('restaurant.miles')}
                </p>
              </div>

              {/* Uber Delivery Range */}
              {restaurant.deliveryMode === 'hybrid' && (
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{t('restaurant.uberDeliveryZone')}</p>
                      <p className="text-2xl font-bold text-gray-700">
                        {restaurant.deliverySettings.selfDeliveryRadius} - {restaurant.deliverySettings.uberMaxRadius} {t('restaurant.miles')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {restaurant.deliverySettings.selfDeliveryRadius} {t('restaurant.beyondRadius')} {restaurant.deliverySettings.uberMaxRadius} {t('restaurant.miles')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact support note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">
              {t('restaurant.readOnlyNotice')}
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {t('restaurant.contactToModify')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
