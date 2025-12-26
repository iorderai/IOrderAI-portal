import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getFinanceStats, mockPaymentRecords, mockDailyStats } from '../../mock/data';
import type { DateRange } from '../../types';

const Finance: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<DateRange>('week');
  const stats = getFinanceStats(period === 'custom' ? 'month' : period);

  const statCards = [
    {
      label: t('finance.orderCount'),
      value: stats.orderCount.toString(),
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      color: 'blue',
    },
    {
      label: t('finance.totalAmount'),
      value: `$${stats.totalAmount.toFixed(2)}`,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'green',
    },
    {
      label: t('finance.deliveryFeeExpense'),
      value: `$${stats.deliveryFee.toFixed(2)}`,
      icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
      color: 'orange',
    },
    {
      label: t('finance.platformFee'),
      value: `$${stats.platformFee.toFixed(2)}`,
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: 'purple',
    },
  ];

  const summaryCards = [
    {
      label: t('finance.settlementAmount'),
      value: `$${stats.settlementAmount.toFixed(2)}`,
      color: 'text-gray-800',
      bg: 'bg-gray-50',
    },
    {
      label: t('finance.settledAmount'),
      value: `$${stats.settledAmount.toFixed(2)}`,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: t('finance.pendingAmount'),
      value: `$${stats.pendingAmount.toFixed(2)}`,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{t('finance.title')}</h1>

        {/* Period selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['today', 'week', 'month'] as DateRange[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {p === 'today' && t('finance.today')}
              {p === 'week' && t('finance.thisWeek')}
              {p === 'month' && t('finance.thisMonth')}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className={`${colorMap[card.color]} p-2 rounded-lg`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-3">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <div key={index} className={`${card.bg} rounded-xl p-6`}>
            <p className="text-sm font-medium text-gray-600">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color} mt-2`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t('finance.trendChart')} - {t('finance.orders')}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Amount trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t('finance.trendChart')} - {t('finance.amount')}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, t('finance.amount')]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment records */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{t('finance.paymentRecords')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('finance.paymentDate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('finance.paymentAmount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('finance.paymentMethod')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('finance.bankAccount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('finance.paymentStatus')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockPaymentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    ${record.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 uppercase">
                    {record.method}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {record.bankAccount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : record.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status === 'completed' ? t('finance.completed') : t('finance.processing')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
