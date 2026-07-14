"use client";

import { useState } from "react";
import { AppSettings } from "@/lib/types";
import { exportData, importData, resetAllData } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Download, Upload, Trash2, Save, Users, AlertTriangle, CheckCircle2, Shield } from "lucide-react";

interface SettingsPanelProps {
  settings: AppSettings;
  expenseCount: number;
  onSettingsChange: (s: AppSettings) => void;
  onDataReset: () => void;
  onDataImport: () => void;
}

const inputClass =
  "w-full h-10 px-3.5 rounded-md border border-gray-200 text-sm outline-none bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-colors";
const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

export default function SettingsPanel({ settings, expenseCount, onSettingsChange, onDataReset, onDataImport }: SettingsPanelProps) {
  const [personAName, setPersonAName] = useState(settings.personAName);
  const [personBName, setPersonBName] = useState(settings.personBName);
  const [saved, setSaved] = useState(false);
  const [importError, setImportError] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handleSaveNames() {
    if (!personAName.trim() || !personBName.trim()) return;
    onSettingsChange({ personAName: personAName.trim(), personBName: personBName.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleExport() {
    const blob = new Blob([await exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hostel-hisab-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        await importData(ev.target?.result as string);
        onDataImport();
        e.target.value = "";
      } catch {
        setImportError("Invalid file. Please use a valid Hostel Hisab export.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-3">
      {/* Names */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-sm">Person names</p>
            <p className="text-xs text-gray-400">Used in all expense records</p>
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Person A (You)</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-[10px] font-semibold">
              {personAName.charAt(0).toUpperCase() || "A"}
            </div>
            <input
              className={cn(inputClass, "pl-10")}
              value={personAName}
              onChange={(e) => setPersonAName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Person B (Friend)</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-semibold">
              {personBName.charAt(0).toUpperCase() || "B"}
            </div>
            <input
              className={cn(inputClass, "pl-10")}
              value={personBName}
              onChange={(e) => setPersonBName(e.target.value)}
              placeholder="Friend's name"
            />
          </div>
        </div>

        <button
          onClick={handleSaveNames}
          className="w-full h-10 rounded-md bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          {saved ? (
            <><CheckCircle2 className="h-4 w-4" strokeWidth={2} /> Saved</>
          ) : (
            <><Save className="h-4 w-4" strokeWidth={2} /> Save names</>
          )}
        </button>
      </div>

      {/* Data management */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
            <Shield className="h-4 w-4 text-gray-600" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-sm">Data management</p>
            <p className="text-xs text-gray-400">Backup and restore your data</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={expenseCount === 0}
          className="w-full h-10 rounded-md border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <Download className="h-4 w-4" strokeWidth={2} />
          Export as JSON
        </button>

        <div>
          <button
            onClick={() => document.getElementById("import-file")?.click()}
            className="w-full h-10 rounded-md border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" strokeWidth={2} />
            Import from JSON
          </button>
          <input id="import-file" type="file" accept=".json" className="hidden" onChange={handleImport} />
          {importError && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 shrink-0" strokeWidth={2} /> {importError}
            </p>
          )}
        </div>

        <div className="h-px bg-gray-100" />

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full h-10 rounded-md bg-red-50 border border-red-200 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
            Reset all expenses
          </button>
        ) : (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-sm font-semibold text-red-900">Delete everything?</p>
                <p className="text-xs text-red-600 mt-0.5">This permanently deletes all expenses. Export first if needed.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => { await resetAllData(); onDataReset(); setShowResetConfirm(false); }}
                className="flex-1 h-9 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Yes, delete all
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 h-9 rounded-md border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sample data */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-xs font-medium text-gray-500 mb-2.5">Sample import JSON</p>
        <pre className="text-[11px] bg-gray-50 rounded-md p-3 overflow-x-auto text-gray-500 leading-relaxed whitespace-pre-wrap break-all border border-gray-100">{`{
  "expenses": [
    {"id":"1","title":"Chicken karahi","amount":850,"paidBy":"personA","date":"2026-06-10","category":"Food"},
    {"id":"2","title":"Grocery run","amount":1200,"paidBy":"personB","date":"2026-06-11","category":"Grocery"},
    {"id":"3","title":"Hostel rent June","amount":8000,"paidBy":"personA","date":"2026-06-01","category":"Hostel"},
    {"id":"4","title":"Drinks & snacks","amount":320,"paidBy":"personB","date":"2026-06-12","category":"Drinks"},
    {"id":"5","title":"Rickshaw fare","amount":150,"paidBy":"personA","date":"2026-06-13","category":"Transport"}
  ],
  "settings": {"personAName":"Jamil","personBName":"Friend"}
}`}</pre>
      </div>
    </div>
  );
}
