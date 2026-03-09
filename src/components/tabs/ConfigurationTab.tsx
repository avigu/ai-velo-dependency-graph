import React, { useState } from 'react';
import { Extension, ConfigField } from '../../types';
import { Save, X, Plus } from 'lucide-react';

interface ConfigurationTabProps {
  extension: Extension;
}

export default function ConfigurationTab({ extension }: ConfigurationTabProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, ConfigField['value']>>(
    Object.fromEntries(extension.configFields.map(f => [f.id, f.value]))
  );
  const [saved, setSaved] = useState(false);

  const update = (id: string, value: ConfigField['value']) => {
    setLocalConfig(prev => ({ ...prev, [id]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: '#cccccc' }}>
            Configuration
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#858585' }}>
            Manage settings for this {extension.type} extension
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors"
          style={{
            background: saved ? 'rgba(74,222,128,0.15)' : '#0e70c0',
            color: saved ? '#4ade80' : '#fff',
          }}
        >
          <Save size={12} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {extension.configFields.map(field => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={localConfig[field.id]}
            onChange={val => update(field.id, val)}
          />
        ))}
      </div>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: ConfigField;
  value: ConfigField['value'];
  onChange: (val: ConfigField['value']) => void;
}) {
  return (
    <div
      className="rounded-lg p-4 border"
      style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
    >
      <label className="block mb-1 text-xs font-semibold" style={{ color: '#cccccc' }}>
        {field.label}
      </label>
      {field.description && (
        <p className="text-[11px] mb-2" style={{ color: '#858585' }}>
          {field.description}
        </p>
      )}

      {field.type === 'text' && (
        <input
          type="text"
          value={value as string}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded text-sm border focus:outline-none"
          style={{
            background: '#1e1e1e',
            color: '#cccccc',
            borderColor: '#3e3e42',
          }}
          onFocus={e => (e.target.style.borderColor = '#0e70c0')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          value={value as string}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded text-sm border focus:outline-none resize-y"
          style={{
            background: '#1e1e1e',
            color: '#cccccc',
            borderColor: '#3e3e42',
          }}
          onFocus={e => (e.target.style.borderColor = '#0e70c0')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        />
      )}

      {field.type === 'code' && (
        <textarea
          value={value as string}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 rounded text-sm border focus:outline-none resize-y font-mono"
          style={{
            background: '#1a1a1a',
            color: '#9cdcfe',
            borderColor: '#3e3e42',
            fontSize: 12,
          }}
          onFocus={e => (e.target.style.borderColor = '#0e70c0')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        />
      )}

      {field.type === 'select' && field.options && (
        <select
          value={value as string}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded text-sm border focus:outline-none appearance-none"
          style={{
            background: '#1e1e1e',
            color: '#cccccc',
            borderColor: '#3e3e42',
          }}
          onFocus={e => (e.target.style.borderColor = '#0e70c0')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        >
          {field.options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {field.type === 'toggle' && (
        <button
          onClick={() => onChange(!value)}
          className="flex items-center gap-2 text-sm"
          style={{ color: '#cccccc' }}
        >
          <span
            className="relative inline-flex items-center w-10 h-5 rounded-full transition-colors"
            style={{ background: value ? '#0e70c0' : '#3c3c3c' }}
          >
            <span
              className="absolute w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: value ? 'translateX(22px)' : 'translateX(2px)' }}
            />
          </span>
          {value ? 'Enabled' : 'Disabled'}
        </button>
      )}

      {field.type === 'number' && (
        <input
          type="number"
          value={value as number}
          placeholder={field.placeholder}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full sm:w-32 px-3 py-2 rounded text-sm border focus:outline-none"
          style={{
            background: '#1e1e1e',
            color: '#cccccc',
            borderColor: '#3e3e42',
          }}
          onFocus={e => (e.target.style.borderColor = '#0e70c0')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        />
      )}

      {field.type === 'tags' && (
        <TagInput
          value={value as string[]}
          onChange={vals => onChange(vals)}
          placeholder={field.placeholder}
        />
      )}
    </div>
  );
}

function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput('');
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
            style={{ background: '#094771', color: '#60a5fa' }}
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-white">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          placeholder={placeholder || 'Add tag…'}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
          className="flex-1 px-3 py-1.5 rounded text-sm border focus:outline-none"
          style={{
            background: '#1e1e1e',
            color: '#cccccc',
            borderColor: '#3e3e42',
          }}
          onFocus={e => (e.target.style.borderColor = '#0e70c0')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        />
        <button
          onClick={addTag}
          className="px-2 py-1.5 rounded text-xs"
          style={{ background: '#3c3c3c', color: '#cccccc' }}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
