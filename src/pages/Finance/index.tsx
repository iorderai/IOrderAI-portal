import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getFinanceStats, mockPaymentRecords, mockDailyStats, mockBankAccounts, mockWithdrawalBalance, mockWithdrawalRecords } from '../../mock/data';
import type { DateRange, BankAccount, WithdrawalRequest } from '../../types';
import WithdrawalModal from './WithdrawalModal';
import BankAccountModal from './BankAccountModal';

const Finance: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<DateRange>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'withdrawal'>('overview');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showBankAccountModal, setShowBankAccountModal] = useState(false);

  // Mock 数据状态
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [withdrawalRecords, setWithdrawalRecords] = useState<WithdrawalRequest[]>(mockWithdrawalRecords);
  const [withdrawalBalance, setWithdrawalBalance] = useState(mockWithdrawalBalance);

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

  // 提现处理
  const handleWithdraw = (amount: number, bankAccountId: string) => {
    const account = bankAccounts.find(a => a.id === bankAccountId);
    if (!account) return;

    const newRequest: WithdrawalRequest = {
      id: `WD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(withdrawalRecords.length + 1).padStart(3, '0')}`,
      amount,
      fee: amount * withdrawalBalance.withdrawalFeeRate,
      actualAmount: amount * (1 - withdrawalBalance.withdrawalFeeRate),
      bankAccountId,
      bankAccountInfo: `${account.bankName} ${account.accountNumber}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setWithdrawalRecords([newRequest, ...withdrawalRecords]);
    setWithdrawalBalance({
      ...withdrawalBalance,
      availableAmount: withdrawalBalance.availableAmount - amount,
      processingAmount: withdrawalBalance.processingAmount + amount,
    });

    // 这里应该显示成功提示
    console.log('Withdrawal submitted:', newRequest);
  };

  // 银行账户管理
  const handleAddAccount = (account: Omit<BankAccount, 'id' | 'createdAt'>) => {
    const newAccount: BankAccount = {
      ...account,
      id: `bank_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // 如果设为默认，取消其他账户的默认状态
    if (account.isDefault) {
      setBankAccounts(prev => prev.map(a => ({ ...a, isDefault: false })));
    }

    setBankAccounts(prev => [...prev, newAccount]);
  };

  const handleDeleteAccount = (accountId: string) => {
    setBankAccounts(prev => prev.filter(a => a.id !== accountId));
  };

  const handleSetDefaultAccount = (accountId: string) => {
    setBankAccounts(prev =>
      prev.map(a => ({
        ...a,
        isDefault: a.id === accountId,
      }))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{t('finance.title')}</h1>

        {/* Tab selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t('finance.overview')}
          </button>
          <button
            onClick={() => setActiveTab('withdrawal')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'withdrawal'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t('finance.withdrawal.title')}
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Period selector */}
          <div className="flex justify-end">
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
        </>
      ) : (
        /* Withdrawal Tab */
        <>
          {/* Withdrawal Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Available Amount */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90">{t('finance.withdrawal.availableAmount')}</p>
              <p className="text-3xl font-bold mt-2">${withdrawalBalance.availableAmount.toFixed(2)}</p>
              <button
                onClick={() => setShowWithdrawalModal(true)}
                className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                {t('finance.withdrawal.withdraw')}
              </button>
            </div>

            {/* Frozen Amount */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t('finance.withdrawal.frozenAmount')}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${withdrawalBalance.frozenAmount.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">{t('finance.withdrawal.frozenHint')}</p>
            </div>

            {/* Processing Amount */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t('finance.withdrawal.processingAmount')}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${withdrawalBalance.processingAmount.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">{t('finance.withdrawal.processingHint')}</p>
            </div>

            {/* Total Withdrawn */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t('finance.withdrawal.totalWithdrawn')}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${withdrawalBalance.totalWithdrawn.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {t('finance.withdrawal.minimumAmount')}: ${withdrawalBalance.minimumWithdrawal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Bank Accounts Quick View */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{t('finance.withdrawal.bankAccounts')}</h2>
              <button
                onClick={() => setShowBankAccountModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('finance.withdrawal.bankAccounts')} →
              </button>
            </div>
            {bankAccounts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('finance.withdrawal.noAccounts')}</p>
                <button
                  onClick={() => setShowBankAccountModal(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('finance.withdrawal.addAccount')}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className={`px-4 py-2 rounded-lg border ${
                      account.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <p className="font-medium text-gray-800">{account.bankName} {account.accountNumber}</p>
                    <p className="text-xs text-gray-500">
                      {account.accountType === 'checking'
                        ? t('finance.withdrawal.checking')
                        : t('finance.withdrawal.savings')}
                      {account.isDefault && (
                        <span className="ml-2 text-blue-600">• {t('finance.withdrawal.defaultAccount')}</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Withdrawal Records */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">{t('finance.withdrawal.withdrawalRecords')}</h2>
            </div>
            {withdrawalRecords.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('common.noData')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finance.withdrawal.requestId')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finance.withdrawal.withdrawAmount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finance.withdrawal.actualAmount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finance.bankAccount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finance.withdrawal.requestTime')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finance.paymentStatus')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {withdrawalRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {record.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          ${record.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                          ${record.actualAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.bankAccountInfo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(record.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                            {t(`finance.withdrawal.status.${record.status}`)}
                          </span>
                          {record.status === 'failed' && record.failReason && (
                            <p className="text-xs text-red-500 mt-1">{record.failReason}</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        balance={withdrawalBalance}
        bankAccounts={bankAccounts}
        onSubmit={handleWithdraw}
        onManageAccounts={() => {
          setShowWithdrawalModal(false);
          setShowBankAccountModal(true);
        }}
      />

      <BankAccountModal
        isOpen={showBankAccountModal}
        onClose={() => setShowBankAccountModal(false)}
        accounts={bankAccounts}
        onAddAccount={handleAddAccount}
        onDeleteAccount={handleDeleteAccount}
        onSetDefault={handleSetDefaultAccount}
      />
    </div>
  );
};

export default Finance;
