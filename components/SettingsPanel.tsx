"use client";

import { useState } from "react";
import { AppSettings } from "@/lib/types";
import { exportData, importData, resetAllData } from "@/lib/storage";
import { Download, Upload, Trash2, Save, Users, AlertTriangle, CheckCircle2, Shield } from "lucide-react";

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (s: AppSettings) => void;
  onDataReset: () => void;
  onDataImport: () => void;
}

const inputClass = "w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all font-medium";
const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5";

export default function SettingsPanel({ settings, onSettingsChange, onDataReset, onDataImport }: SettingsPanelProps) {
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

  function handleExport() {
    const blob = new Blob([exportData()], { type: "application/json" });
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
    reader.onload = (ev) => {
      try {
        importData(ev.target?.result as string);
        onDataImport();
        e.target.value = "";
      } catch {
        setImportError("Invalid file. Please use a valid Hostel Hisab export.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-4">
      {/* Names */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
            <Users className="h-4.5 w-4.5 text-green-700" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Person Names</p>
            <p className="text-[10px] text-gray-400 font-medium">Used in all expense records</p>
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Person A (You)</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              {personAName.charAt(0).toUpperCase() || "A"}
            </div>
            <input
              className={`${inputClass} pl-11`}
              value={personAName}
              onChange={(e) => setPersonAName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Person B (Friend)</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              {personBName.charAt(0).toUpperCase() || "B"}
            </div>
            <input
              className={`${inputClass} pl-11`}
              value={personBName}
              onChange={(e) => setPersonBName(e.target.value)}
              placeholder="Friend's name"
            />
          </div>
        </div>

        <button
          onClick={handleSaveNames}
          className="w-full h-11 rounded-xl bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-md shadow-green-200 flex items-center justify-center gap-2"
        >
          {saved ? (
            <><CheckCircle2 className="h-4 w-4" /> Saved!</>
          ) : (
            <><Save className="h-4 w-4" /> Save Names</>
          )}
        </button>
      </div>

      {/* Data management */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
            <Shield className="h-4.5 w-4.5 text-gray-600" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Data Management</p>
            <p className="text-[10px] text-gray-400 font-medium">Backup and restore your data</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full h-11 rounded-xl border border-green-200 bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export as JSON
        </button>

        <div>
          <button
            onClick={() => document.getElementById("import-file")?.click()}
            className="w-full h-11 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import from JSON
          </button>
          <input id="import-file" type="file" accept=".json" className="hidden" onChange={handleImport} />
          {importError && (
            <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">
              <span>⚠️</span> {importError}
            </p>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full h-11 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Reset All Expenses
          </button>
        ) : (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-800">Delete everything?</p>
                <p className="text-xs text-red-500 mt-0.5">This permanently deletes all expenses. Export first if needed.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { resetAllData(); onDataReset(); setShowResetConfirm(false); }}
                className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-sm font-bold transition-all"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sample data */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Sample Import JSON</p>
        <pre className="text-[10px] bg-gray-50 rounded-xl p-3 overflow-x-auto text-gray-500 leading-relaxed whitespace-pre-wrap break-all border border-gray-100">{`{
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
