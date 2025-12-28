import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { BankAccount, WithdrawalBalance } from '../../types';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: WithdrawalBalance;
  bankAccounts: BankAccount[];
  onSubmit: (amount: number, bankAccountId: string) => void;
  onManageAccounts: () => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  balance,
  bankAccounts,
  onSubmit,
  onManageAccounts,
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [error, setError] = useState<string>('');

  // 设置默认账户
  useEffect(() => {
    if (bankAccounts.length > 0 && !selectedAccountId) {
      const defaultAccount = bankAccounts.find(acc => acc.isDefault) || bankAccounts[0];
      setSelectedAccountId(defaultAccount.id);
    }
  }, [bankAccounts, selectedAccountId]);

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
    }
  }, [isOpen]);

  const numericAmount = parseFloat(amount) || 0;
  const fee = numericAmount * balance.withdrawalFeeRate;
  const actualAmount = numericAmount - fee;

  const validateAmount = (value: number): string => {
    if (value <= 0) {
      return '';
    }
    if (value > balance.availableAmount) {
      return t('finance.withdrawal.insufficientBalance');
    }
    if (value < balance.minimumWithdrawal) {
      return t('finance.withdrawal.belowMinimum');
    }
    return '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许数字和小数点
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
      setError(validateAmount(parseFloat(value) || 0));
    }
  };

  const handleWithdrawAll = () => {
    setAmount(balance.availableAmount.toFixed(2));
    setError('');
  };

  const handleSubmit = () => {
    const validationError = validateAmount(numericAmount);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!selectedAccountId) {
      return;
    }
    onSubmit(numericAmount, selectedAccountId);
    onClose();
  };

  const isValid = numericAmount >= balance.minimumWithdrawal &&
                  numericAmount <= balance.availableAmount &&
                  selectedAccountId;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {t('finance.withdrawal.withdraw')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Available Balance */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">{t('finance.withdrawal.availableAmount')}</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              ${balance.availableAmount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {t('finance.withdrawal.minimumAmount')}: ${balance.minimumWithdrawal.toFixed(2)}
            </p>
          </div>

          {/* Bank Account Selection */}
          {bankAccounts.length === 0 ? (
            <div className="bg-yellow-50 rounded-xl p-4">
              <p className="text-sm text-yellow-800">{t('finance.withdrawal.noAccounts')}</p>
              <button
                onClick={onManageAccounts}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('finance.withdrawal.addAccount')} →
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('finance.withdrawal.withdrawTo')}
              </label>
              <div className="space-y-2">
                {bankAccounts.map((account) => (
                  <label
                    key={account.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAccountId === account.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bankAccount"
                      value={account.id}
                      checked={selectedAccountId === account.id}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {account.bankName} {account.accountNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {account.accountType === 'checking'
                          ? t('finance.withdrawal.checking')
                          : t('finance.withdrawal.savings')}
                        {account.isDefault && (
                          <span className="ml-2 text-blue-600">({t('finance.withdrawal.defaultAccount')})</span>
                        )}
                      </p>
                    </div>
                    {selectedAccountId === account.id && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
              <button
                onClick={onManageAccounts}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                {t('finance.withdrawal.bankAccounts')} →
              </button>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('finance.withdrawal.withdrawAmount')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className={`w-full pl-8 pr-24 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              <button
                onClick={handleWithdrawAll}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                {t('finance.withdrawal.withdrawAll')}
              </button>
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Fee & Actual Amount */}
          {numericAmount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('finance.withdrawal.fee')}</span>
                <span className="text-gray-800">
                  {balance.withdrawalFeeRate === 0
                    ? t('finance.withdrawal.noFee')
                    : `$${fee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-700">{t('finance.withdrawal.actualAmount')}</span>
                <span className="text-green-600">${actualAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('finance.withdrawal.estimatedArrival')}</span>
                <span className="text-gray-800">{t('finance.withdrawal.workingDays')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('finance.withdrawal.submitWithdrawal')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;
