import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BankAccount } from '../../types';

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onAddAccount: (account: Omit<BankAccount, 'id' | 'createdAt'>) => void;
  onDeleteAccount: (accountId: string) => void;
  onSetDefault: (accountId: string) => void;
}

const BankAccountModal: React.FC<BankAccountModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onAddAccount,
  onDeleteAccount,
  onSetDefault,
}) => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    bankName: '',
    accountType: 'checking' as 'checking' | 'savings',
    accountNumber: '',
    routingNumber: '',
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      bankName: '',
      accountType: 'checking',
      accountNumber: '',
      routingNumber: '',
      isDefault: accounts.length === 0, // 第一个账户默认设为默认
    });
    setFormErrors({});
    setShowAddForm(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.bankName.trim()) {
      errors.bankName = 'Required';
    }
    if (!formData.accountNumber.trim() || formData.accountNumber.length < 4) {
      errors.accountNumber = 'Invalid account number';
    }
    if (!formData.routingNumber.trim() || formData.routingNumber.length !== 9) {
      errors.routingNumber = 'Routing number must be 9 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onAddAccount({
      bankName: formData.bankName,
      accountType: formData.accountType,
      accountNumber: `****${formData.accountNumber.slice(-4)}`,
      routingNumber: `****${formData.routingNumber.slice(-4)}`,
      isDefault: formData.isDefault || accounts.length === 0,
    });

    resetForm();
  };

  const handleDelete = (accountId: string) => {
    onDeleteAccount(accountId);
    setDeleteConfirmId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {t('finance.withdrawal.bankAccounts')}
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
        <div className="p-6 overflow-y-auto flex-1">
          {/* Account List */}
          {accounts.length > 0 && (
            <div className="space-y-3 mb-6">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {deleteConfirmId === account.id ? (
                    // Delete Confirmation
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        {t('finance.withdrawal.deleteAccountConfirm')}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
                        >
                          {t('common.cancel')}
                        </button>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Account Info
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800">
                            {account.bankName}
                          </p>
                          {account.isDefault && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {t('finance.withdrawal.defaultAccount')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {account.accountType === 'checking'
                            ? t('finance.withdrawal.checking')
                            : t('finance.withdrawal.savings')}
                          {' · '}{account.accountNumber}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {t('finance.withdrawal.routingNumber')}: {account.routingNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!account.isDefault && (
                          <button
                            onClick={() => onSetDefault(account.id)}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            {t('finance.withdrawal.setDefault')}
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirmId(account.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {accounts.length === 0 && !showAddForm && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">{t('finance.withdrawal.noAccounts')}</p>
              <p className="text-sm text-gray-500">{t('finance.withdrawal.addAccountHint')}</p>
            </div>
          )}

          {/* Add Account Form */}
          {showAddForm ? (
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-gray-800">{t('finance.withdrawal.addAccount')}</h3>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('finance.withdrawal.bankName')}
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g., Chase Bank"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.bankName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('finance.withdrawal.accountType')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="checking"
                      checked={formData.accountType === 'checking'}
                      onChange={() => setFormData({ ...formData, accountType: 'checking' })}
                      className="mr-2"
                    />
                    {t('finance.withdrawal.checking')}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="savings"
                      checked={formData.accountType === 'savings'}
                      onChange={() => setFormData({ ...formData, accountType: 'savings' })}
                      className="mr-2"
                    />
                    {t('finance.withdrawal.savings')}
                  </label>
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('finance.withdrawal.accountNumberFull')}
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, accountNumber: value });
                  }}
                  placeholder="Enter account number"
                  maxLength={17}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.accountNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Routing Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('finance.withdrawal.routingNumberFull')}
                </label>
                <input
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                    setFormData({ ...formData, routingNumber: value });
                  }}
                  placeholder="9-digit routing number"
                  maxLength={9}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.routingNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.routingNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.routingNumber}</p>
                )}
              </div>

              {/* Set as Default */}
              {accounts.length > 0 && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{t('finance.withdrawal.setDefault')}</span>
                </label>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('common.save')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('finance.withdrawal.addAccount')}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankAccountModal;
