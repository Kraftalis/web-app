"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  Modal,
  Badge,
  Textarea,
} from "@/components/ui";
import { IconPlus, IconFilter, IconEdit, IconTrash } from "@/components/icons";
import { useDictionary } from "@/i18n";
import {
  useAccounts,
  useTransactions,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/hooks/finance";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import type {
  FinanceAccount,
  FinanceTransaction,
  TransactionType,
  TransactionQueryParams,
  CreateTransactionPayload,
} from "@/services/finance";

// ─── Helpers ────────────────────────────────────────────────

function fmtCurrency(val: string | number, currency = "IDR") {
  const n = typeof val === "string" ? parseFloat(val) : val;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ──────────────────────────────────────────────

export default function TransactionsTab() {
  const { dict } = useDictionary();
  const f = dict.finance;

  // ─── Filters ──────────────────────────────────────────────
  const [filterType, setFilterType] = useState<TransactionType | "">("");
  const [filterAccountId, setFilterAccountId] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const params = useMemo<TransactionQueryParams>(() => {
    const p: TransactionQueryParams = { page, limit: 20 };
    if (filterType) p.type = filterType;
    if (filterAccountId) p.accountId = filterAccountId;
    if (filterStartDate) p.startDate = filterStartDate;
    if (filterEndDate) p.endDate = filterEndDate;
    return p;
  }, [page, filterType, filterAccountId, filterStartDate, filterEndDate]);

  // ─── Queries ──────────────────────────────────────────────
  const accountsQuery = useAccounts();
  const txQuery = useTransactions(params);
  const accounts: FinanceAccount[] = useMemo(
    () => accountsQuery.data ?? [],
    [accountsQuery.data],
  );
  const transactions: FinanceTransaction[] = txQuery.data?.data ?? [];
  const total = txQuery.data?.meta?.total ?? 0;
  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  // ─── Account mutations ────────────────────────────────────
  const createAcctMut = useCreateAccount();
  const updateAcctMut = useUpdateAccount();
  const deleteAcctMut = useDeleteAccount();
  const acctDelete = useConfirmDelete((id) => deleteAcctMut.mutate(id));

  // ─── Transaction mutations ────────────────────────────────
  const createTxMut = useCreateTransaction();
  const updateTxMut = useUpdateTransaction();
  const deleteTxMut = useDeleteTransaction();
  const txDelete = useConfirmDelete((id) => deleteTxMut.mutate(id));

  // ─── Account modal ────────────────────────────────────────
  const [acctModalOpen, setAcctModalOpen] = useState(false);
  const [editingAcct, setEditingAcct] = useState<FinanceAccount | null>(null);

  const openAddAcct = () => {
    setEditingAcct(null);
    setAcctModalOpen(true);
  };
  const openEditAcct = (a: FinanceAccount) => {
    setEditingAcct(a);
    setAcctModalOpen(true);
  };
  const closeAcctModal = () => {
    setAcctModalOpen(false);
    setEditingAcct(null);
  };

  const handleSaveAccount = (fd: FormData) => {
    const name = (fd.get("name") as string).trim();
    const description = (fd.get("description") as string).trim() || null;
    if (!name) return;
    if (editingAcct) {
      updateAcctMut.mutate(
        { id: editingAcct.id, payload: { name, description } },
        { onSuccess: closeAcctModal },
      );
    } else {
      createAcctMut.mutate(
        { name, description },
        { onSuccess: closeAcctModal },
      );
    }
  };

  // ─── Transaction modal ────────────────────────────────────
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<FinanceTransaction | null>(null);

  const openAddTx = () => {
    setEditingTx(null);
    setTxModalOpen(true);
  };
  const openEditTx = (tx: FinanceTransaction) => {
    setEditingTx(tx);
    setTxModalOpen(true);
  };
  const closeTxModal = () => {
    setTxModalOpen(false);
    setEditingTx(null);
  };

  const handleSaveTx = (fd: FormData) => {
    const accountId = fd.get("accountId") as string;
    const type = fd.get("type") as TransactionType;
    const category = (fd.get("category") as string).trim();
    const description = (fd.get("description") as string).trim() || null;
    const amount = parseFloat(fd.get("amount") as string);
    const transactionDate = fd.get("transactionDate") as string;
    const notes = (fd.get("notes") as string).trim() || null;

    if (!accountId || !type || !category || !amount || !transactionDate) return;

    const payload: CreateTransactionPayload = {
      accountId,
      type,
      category,
      description,
      amount,
      transactionDate,
      notes,
    };

    if (editingTx) {
      updateTxMut.mutate(
        { id: editingTx.id, payload },
        { onSuccess: closeTxModal },
      );
    } else {
      createTxMut.mutate(payload, { onSuccess: closeTxModal });
    }
  };

  // ─── Account options for select ───────────────────────────
  const accountOptions = useMemo(
    () => accounts.map((a) => ({ value: a.id, label: a.name })),
    [accounts],
  );

  return (
    <div className="space-y-6">
      {/* Accounts strip */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            {f.accountsTitle}
          </h3>
          <button
            onClick={openAddAcct}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            + {f.addAccount}
          </button>
        </div>
        {accounts.length === 0 && !accountsQuery.isLoading && (
          <p className="mt-2 text-sm text-gray-400">{f.noAccountsDesc}</p>
        )}
        {accounts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {accounts.map((acct) => (
              <button
                key={acct.id}
                onClick={() => openEditAcct(acct)}
                className="group relative rounded-lg border border-gray-200 bg-white px-4 py-2 text-left transition-colors hover:border-blue-300"
              >
                <span className="text-sm font-medium text-gray-900">
                  {acct.name}
                </span>
                {acct.isPrimary && (
                  <Badge variant="info" className="ml-1.5 text-[10px]">
                    Primary
                  </Badge>
                )}
                {acct.description && (
                  <span className="ml-2 text-xs text-gray-400">
                    {acct.description}
                  </span>
                )}
                {!acct.isPrimary && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      acctDelete.handleDelete(acct.id);
                    }}
                    className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs text-red-600 group-hover:flex"
                    title={f.confirmDeleteAccount}
                  >
                    ×
                  </button>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar: Add tx + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button size="md" onClick={openAddTx} disabled={accounts.length === 0}>
          <IconPlus size={16} />
          {f.addTransaction}
        </Button>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <IconFilter size={14} />
          {dict.common.filter}
        </button>
      </div>

      {/* Filters row */}
      {showFilters && (
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <Select
                label={f.allTypes}
                options={[
                  { value: "", label: f.allTypes },
                  { value: "INCOME", label: f.income },
                  { value: "EXPENSE", label: f.expense },
                ]}
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as TransactionType | "");
                  setPage(1);
                }}
              />
              <Select
                label={f.allAccounts}
                options={[
                  { value: "", label: f.allAccounts },
                  ...accountOptions,
                ]}
                value={filterAccountId}
                onChange={(e) => {
                  setFilterAccountId(e.target.value);
                  setPage(1);
                }}
              />
              <Input
                type="date"
                label={f.startDate}
                value={filterStartDate}
                onChange={(e) => {
                  setFilterStartDate(e.target.value);
                  setPage(1);
                }}
              />
              <Input
                type="date"
                label={f.endDate}
                value={filterEndDate}
                onChange={(e) => {
                  setFilterEndDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </CardBody>
        </Card>
      )}

      {/* Transaction list */}
      {txQuery.isLoading && (
        <div className="py-12 text-center text-sm text-gray-400">
          {dict.common.loading}
        </div>
      )}

      {!txQuery.isLoading && transactions.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-gray-500">
            {f.noTransactions}
          </p>
          <p className="mt-1 text-xs text-gray-400">{f.noTransactionsDesc}</p>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">{f.transactionDate}</th>
                  <th className="px-4 py-3">{f.category}</th>
                  <th className="px-4 py-3">{f.account}</th>
                  <th className="px-4 py-3 text-right">{f.amount}</th>
                  <th className="px-4 py-3 text-right">
                    {dict.event.colActions || "Aksi"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => {
                  const isIncome = tx.type === "INCOME";
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {fmtDate(tx.transactionDate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {tx.category}
                          </span>
                          {tx.description && (
                            <span className="text-[11px] text-gray-400 line-clamp-1">
                              {tx.description}
                            </span>
                          )}
                          {tx.event && (
                            <span className="text-[10px] text-blue-500 font-medium">
                              #{tx.event.clientName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                          {tx.account?.name}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <span
                          className={`font-bold ${
                            isIncome ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {isIncome ? "+" : "−"}
                          {fmtCurrency(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {!tx.eventId ? (
                          <div className="flex justify-end gap-1.5 px-2">
                            <button
                              onClick={() => openEditTx(tx)}
                              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                              title={dict.common.edit}
                            >
                              <IconEdit size={14} />
                            </button>
                            <button
                              onClick={() => txDelete.handleDelete(tx.id)}
                              className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              title={dict.common.delete}
                            >
                              <IconTrash size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter pr-4">
                            System
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹
              </Button>
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ─── Account Modal ─────────────────────────────────── */}
      <Modal
        open={acctModalOpen}
        onClose={closeAcctModal}
        title={editingAcct ? f.editAccount : f.addAccount}
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={closeAcctModal}>
              {dict.common.cancel}
            </Button>
            <Button
              size="sm"
              type="submit"
              form="account-form"
              disabled={createAcctMut.isPending || updateAcctMut.isPending}
            >
              {dict.common.save}
            </Button>
          </div>
        }
      >
        <form
          id="account-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveAccount(new FormData(e.currentTarget));
          }}
          className="space-y-4"
        >
          <Input
            name="name"
            label={f.accountName}
            placeholder={f.accountNamePlaceholder}
            defaultValue={editingAcct?.name ?? ""}
            required
          />
          <Textarea
            name="description"
            label={f.accountDescription}
            placeholder={f.accountDescPlaceholder}
            defaultValue={editingAcct?.description ?? ""}
            rows={2}
          />
        </form>
      </Modal>

      {/* ─── Transaction Modal ─────────────────────────────── */}
      <Modal
        open={txModalOpen}
        onClose={closeTxModal}
        title={editingTx ? f.editTransaction : f.addTransaction}
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={closeTxModal}>
              {dict.common.cancel}
            </Button>
            <Button
              size="sm"
              type="submit"
              form="tx-form"
              disabled={createTxMut.isPending || updateTxMut.isPending}
            >
              {dict.common.save}
            </Button>
          </div>
        }
      >
        <form
          id="tx-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveTx(new FormData(e.currentTarget));
          }}
          className="space-y-4"
        >
          {/* Type */}
          <Select
            name="type"
            label={f.allTypes}
            options={[
              { value: "INCOME", label: f.income },
              { value: "EXPENSE", label: f.expense },
            ]}
            defaultValue={editingTx?.type ?? "EXPENSE"}
          />

          {/* Account */}
          <Select
            name="accountId"
            label={f.account}
            options={accountOptions}
            defaultValue={editingTx?.accountId ?? accounts[0]?.id ?? ""}
          />

          {/* Category */}
          <Input
            name="category"
            label={f.category}
            placeholder={f.categoryPlaceholder}
            defaultValue={editingTx?.category ?? ""}
            required
          />

          {/* Amount */}
          <Input
            name="amount"
            type="number"
            label={f.amount}
            step="1"
            min="1"
            placeholder="0"
            defaultValue={editingTx?.amount ?? ""}
            required
          />

          {/* Date */}
          <Input
            name="transactionDate"
            type="date"
            label={f.transactionDate}
            defaultValue={
              editingTx
                ? editingTx.transactionDate.slice(0, 10)
                : new Date().toISOString().slice(0, 10)
            }
            required
          />

          {/* Description */}
          <Input
            name="description"
            label={f.description}
            placeholder={f.descriptionPlaceholder}
            defaultValue={editingTx?.description ?? ""}
          />

          {/* Notes */}
          <Textarea
            name="notes"
            label={f.notes}
            placeholder={f.notesPlaceholder}
            defaultValue={editingTx?.notes ?? ""}
            rows={2}
          />
        </form>
      </Modal>
    </div>
  );
}
