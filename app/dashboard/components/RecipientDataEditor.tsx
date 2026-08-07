"use client";

import { useState, useRef } from "react";
import { RecipientDataEditorProps } from "@/types/campaign";
import { parseRecipientCSV } from "@/lib/email/csv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  Upload,
  Table as TableIcon,
  Tag,
  Edit2,
  Check,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

export function RecipientDataEditor({
  variables,
  setVariables,
  recipientItems,
  setRecipientItems,
  syncToTextInput,
}: RecipientDataEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New Variable Input state
  const [newVarName, setNewVarName] = useState("");
  const [isAddingVar, setIsAddingVar] = useState(false);

  // Variable Rename state
  const [editingVar, setEditingVar] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const parsed = parseRecipientCSV(text);
      if (parsed.recipients.length === 0) {
        toast.error("No valid recipient email rows found in CSV file.");
        return;
      }

      // Merge newly parsed variables with existing defined variables
      const mergedVars = Array.from(
        new Set([...variables, ...parsed.variables]),
      );
      setVariables(mergedVars);

      // Set parsed recipient rows
      setRecipientItems(parsed.recipients);
      syncToTextInput(parsed.recipients);

      toast.success(
        `Imported ${parsed.recipients.length} recipients with ${parsed.variables.length} custom variables!`,
      );
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  // Add new dynamic custom variable column
  const handleAddVariable = () => {
    const trimmed = newVarName
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, "")
      .trim();

    if (!trimmed) {
      toast.error("Variable name must contain alphanumeric characters.");
      return;
    }

    if (variables.some((v) => v.toLowerCase() === trimmed)) {
      toast.error(`Variable "{{${trimmed}}}" already exists.`);
      return;
    }

    const updatedVars = [...variables, trimmed];
    setVariables(updatedVars);

    // Initialize blank value for new variable across all existing recipients
    const updatedItems = recipientItems.map((item) => ({
      ...item,
      variables: {
        ...item.variables,
        [trimmed]: item.variables[trimmed] || "",
      },
    }));

    setRecipientItems(updatedItems);
    setNewVarName("");
    setIsAddingVar(false);
    toast.success(`Variable "{{${trimmed}}}" added.`);
  };

  // Start renaming a variable column
  const startRenameVar = (varName: string) => {
    setEditingVar(varName);
    setEditingValue(varName);
  };

  // Save variable column rename
  const saveRenameVar = (oldVarName: string) => {
    const trimmed = editingValue
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, "")
      .trim();

    if (!trimmed) {
      toast.error("Variable name cannot be empty.");
      return;
    }

    if (
      trimmed !== oldVarName &&
      variables.some((v) => v.toLowerCase() === trimmed)
    ) {
      toast.error(`Variable "{{${trimmed}}}" already exists.`);
      return;
    }

    const updatedVars = variables.map((v) => (v === oldVarName ? trimmed : v));
    setVariables(updatedVars);

    // Update keys in recipient records
    const updatedItems = recipientItems.map((item) => {
      const newVars = { ...item.variables };
      if (oldVarName in newVars) {
        newVars[trimmed] = newVars[oldVarName];
        delete newVars[oldVarName];
      }
      return { ...item, variables: newVars };
    });

    setRecipientItems(updatedItems);
    setEditingVar(null);
    toast.success(`Renamed variable to "{{${trimmed}}}".`);
  };

  // Delete a variable column
  const handleDeleteVariable = (varName: string) => {
    if (
      !confirm(
        `Delete variable "{{${varName}}}" and remove its values across all recipients?`,
      )
    ) {
      return;
    }

    const updatedVars = variables.filter((v) => v !== varName);
    setVariables(updatedVars);

    const updatedItems = recipientItems.map((item) => {
      const newVars = { ...item.variables };
      delete newVars[varName];
      return { ...item, variables: newVars };
    });

    setRecipientItems(updatedItems);
    toast.success(`Variable "{{${varName}}}" deleted.`);
  };

  // Update recipient email cell
  const handleEmailChange = (index: number, newEmail: string) => {
    const updated = [...recipientItems];
    updated[index] = {
      ...updated[index],
      email: newEmail,
    };
    setRecipientItems(updated);
    syncToTextInput(updated);
  };

  // Update recipient variable cell value
  const handleVariableCellChange = (
    index: number,
    varName: string,
    value: string,
  ) => {
    const updated = [...recipientItems];
    updated[index] = {
      ...updated[index],
      variables: {
        ...updated[index].variables,
        [varName]: value,
      },
    };
    setRecipientItems(updated);
  };

  // Add new blank recipient row
  const handleAddRecipientRow = () => {
    const defaultVars: Record<string, string> = {};
    variables.forEach((v) => {
      defaultVars[v] = "";
    });

    const updated = [
      ...recipientItems,
      {
        email: `recipient${recipientItems.length + 1}@example.com`,
        variables: defaultVars,
      },
    ];

    setRecipientItems(updated);
    syncToTextInput(updated);
  };

  // Delete recipient row
  const handleDeleteRecipientRow = (index: number) => {
    const updated = recipientItems.filter((_, i) => i !== index);
    setRecipientItems(updated);
    syncToTextInput(updated);
  };

  return (
    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-xl">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-850 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-violet-600/10 text-violet-400 rounded-lg">
            <TableIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Recipient Variables & Data Editor
            </h4>
            <p className="text-[11px] text-zinc-400">
              Define custom merge variables (e.g. name, company) and import
              CSV/Excel spreadsheets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* CSV File Import Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.txt"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white cursor-pointer text-xs h-8 gap-1.5"
          >
            <Upload className="h-3.5 w-3.5 text-violet-400" />
            Import CSV
          </Button>

          {/* Add Variable Column Trigger */}
          {!isAddingVar ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setIsAddingVar(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer text-xs h-8 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Variable
            </Button>
          ) : (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={newVarName}
                onChange={(e) => setNewVarName(e.target.value)}
                placeholder="e.g. company"
                className="h-8 w-28 bg-zinc-900 border-zinc-700 text-xs text-white"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAddVariable()}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddVariable}
                className="h-8 px-2 bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setIsAddingVar(false)}
                className="h-8 px-2 text-zinc-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Recipient Data Table Grid */}
      <div className="overflow-x-auto rounded-lg border border-zinc-850 bg-zinc-950">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-850">
            <tr>
              <th className="px-3.5 py-2.5 min-w-50">
                Email Address ({recipientItems.length})
              </th>
              {variables.map((v) => (
                <th key={v} className="px-3.5 py-2.5 min-w-37.5">
                  {editingVar === v ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="h-6 w-24 bg-zinc-950 border-zinc-700 text-xs text-violet-300"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && saveRenameVar(v)}
                      />
                      <button
                        type="button"
                        onClick={() => saveRenameVar(v)}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingVar(null)}
                        className="text-zinc-400 hover:text-zinc-300"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1 group">
                      <span className="flex items-center gap-1 text-violet-400 font-mono lowercase">
                        <Tag className="h-3 w-3" />
                        {`{{${v}}}`}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => startRenameVar(v)}
                          title="Rename variable"
                          className="text-zinc-400 hover:text-white"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariable(v)}
                          title="Delete variable"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </th>
              ))}
              <th className="px-3 py-2.5 w-12 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {recipientItems.length === 0 ? (
              <tr>
                <td
                  colSpan={variables.length + 2}
                  className="px-4 py-8 text-center text-zinc-500 font-medium"
                >
                  <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                  No recipients added. Import a CSV file or add rows below.
                </td>
              </tr>
            ) : (
              recipientItems.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-zinc-900/50 transition-colors"
                >
                  {/* Email Input Cell */}
                  <td className="px-3 py-1.5">
                    <Input
                      type="email"
                      value={item.email}
                      onChange={(e) =>
                        handleEmailChange(rowIdx, e.target.value)
                      }
                      placeholder="user@domain.com"
                      className="h-8 bg-zinc-900/60 border-zinc-800 text-xs text-white focus-visible:ring-1 focus-visible:ring-violet-500/40"
                    />
                  </td>

                  {/* Dynamic Variable Cells */}
                  {variables.map((v) => (
                    <td key={v} className="px-3 py-1.5">
                      <Input
                        type="text"
                        value={item.variables[v] || ""}
                        onChange={(e) =>
                          handleVariableCellChange(rowIdx, v, e.target.value)
                        }
                        placeholder={`Value for {{${v}}}`}
                        className="h-8 bg-zinc-900/60 border-zinc-800 text-xs text-zinc-200 focus-visible:ring-1 focus-visible:ring-violet-500/40"
                      />
                    </td>
                  ))}

                  {/* Action Cell */}
                  <td className="px-3 py-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRecipientRow(rowIdx)}
                      title="Remove recipient"
                      className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Actions */}
      <div className="flex items-center justify-between pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRecipientRow}
          className="border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white cursor-pointer text-xs h-8 gap-1.5"
        >
          <Plus className="h-3.5 w-3.5 text-emerald-400" />
          Add Recipient Row
        </Button>

        <span className="text-[11px] text-zinc-500 font-mono">
          {recipientItems.length} recipient(s) • {variables.length} custom
          variable(s)
        </span>
      </div>
    </div>
  );
}
