// src/components/projects/ProjectForm.tsx
import { useState } from 'react';
import type { Project, ProjectFormData } from '../../types';

const PROJECT_TYPES = [
  'YouTube Video',
  'Instagram Reel',
  'Short Film',
  'Advertisement',
  'Podcast',
  'Other',
] as const;

const RESOLUTIONS = ['1920 × 1080', '3840 × 2160', '1280 × 720', '1080 × 1080', '1080 × 1920', 'Custom'];
const ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '21:9'];

interface Props {
  initialData?: Partial<Project>;
  onSubmit: (data: ProjectFormData) => void;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
}

type Errors = Partial<Record<keyof ProjectFormData, string>>;

const defaultForm: ProjectFormData = {
  project_name:           '',
  description:            '',
  project_type:           '',
  deadline:               '',
  budget:                 '',
  resolution:             '',
  aspect_ratio:           '',
  editing_style:          '',
  subtitles_required:     false,
  music_required:         false,
  color_grading_required: false,
  additional_instructions: '',
};

export default function ProjectForm({ initialData, onSubmit, loading, error, submitLabel = 'Submit Project' }: Props) {
  const [form, setForm] = useState<ProjectFormData>({
    ...defaultForm,
    ...(initialData && {
      project_name:            initialData.project_name            ?? '',
      description:             initialData.description             ?? '',
      project_type:            initialData.project_type            ?? '',
      deadline:                initialData.deadline ? initialData.deadline.slice(0, 10) : '',
      budget:                  initialData.budget != null ? String(initialData.budget) : '',
      resolution:              initialData.resolution              ?? '',
      aspect_ratio:            initialData.aspect_ratio            ?? '',
      editing_style:           initialData.editing_style           ?? '',
      subtitles_required:      initialData.subtitles_required      ?? false,
      music_required:          initialData.music_required          ?? false,
      color_grading_required:  initialData.color_grading_required  ?? false,
      additional_instructions: initialData.additional_instructions ?? '',
    }),
  });

  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const e: Errors = {};

    if (!form.project_name.trim())                      e.project_name  = 'Project name is required.';
    if (!form.description.trim())                       e.description   = 'Description is required.';
    if (!form.project_type)                             e.project_type  = 'Project type is required.';
    if (!form.deadline)                                 e.deadline      = 'Deadline is required.';
    if (!form.budget)                                   e.budget        = 'Budget is required.';
    else if (isNaN(parseFloat(form.budget)) || parseFloat(form.budget) <= 0)
                                                        e.budget        = 'Budget must be a positive number.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
    if (errors[target.name as keyof ProjectFormData]) {
      setErrors((prev) => ({ ...prev, [target.name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const field = (
    name: keyof ProjectFormData,
    label: string,
    required = false
  ) => (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}{required && <span className="required"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={form[name] as string}
        onChange={handleChange}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
      />
      {errors[name] && <p className="form-error">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error">{error}</div>}

      {/* ── Basic Information ─────────────────────── */}
      <h3 className="section-title">Basic Information</h3>

      <div className="form-grid">
        <div className={`form-group ${errors.project_name ? '' : ''}`}>
          <label className="form-label" htmlFor="project_name">
            Project Name <span className="required">*</span>
          </label>
          <input
            id="project_name"
            name="project_name"
            type="text"
            value={form.project_name}
            onChange={handleChange}
            className={`form-control ${errors.project_name ? 'is-invalid' : ''}`}
            placeholder="e.g. YouTube Video #01"
          />
          {errors.project_name && <p className="form-error">{errors.project_name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project_type">
            Project Type <span className="required">*</span>
          </label>
          <select
            id="project_type"
            name="project_type"
            value={form.project_type}
            onChange={handleChange}
            className={`form-control ${errors.project_type ? 'is-invalid' : ''}`}
          >
            <option value="">— Select type —</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.project_type && <p className="form-error">{errors.project_type}</p>}
        </div>

        <div className="form-group full-width">
          <label className="form-label" htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            placeholder="Describe the project..."
            rows={3}
          />
          {errors.description && <p className="form-error">{errors.description}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="deadline">
            Deadline <span className="required">*</span>
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
          />
          {errors.deadline && <p className="form-error">{errors.deadline}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="budget">
            Budget (₹) <span className="required">*</span>
          </label>
          <input
            id="budget"
            name="budget"
            type="number"
            min="1"
            step="any"
            value={form.budget}
            onChange={handleChange}
            className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
            placeholder="e.g. 5000"
          />
          {errors.budget && <p className="form-error">{errors.budget}</p>}
        </div>
      </div>

      {/* ── Editing Requirements ──────────────────── */}
      <h3 className="section-title">Editing Requirements</h3>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="resolution">Video Resolution</label>
          <select
            id="resolution"
            name="resolution"
            value={form.resolution}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">— Select resolution —</option>
            {RESOLUTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="aspect_ratio">Aspect Ratio</label>
          <select
            id="aspect_ratio"
            name="aspect_ratio"
            value={form.aspect_ratio}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">— Select ratio —</option>
            {ASPECT_RATIOS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label className="form-label" htmlFor="editing_style">Editing Style</label>
          <input
            id="editing_style"
            name="editing_style"
            type="text"
            value={form.editing_style}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. Fast-paced and cinematic"
          />
        </div>

        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', justifyContent: 'flex-end' }}>
          <label className="form-label">Requirements</label>
          <label className="checkbox-group">
            <input
              type="checkbox"
              name="subtitles_required"
              checked={form.subtitles_required}
              onChange={handleChange}
            />
            Subtitles Required
          </label>
          <label className="checkbox-group">
            <input
              type="checkbox"
              name="music_required"
              checked={form.music_required}
              onChange={handleChange}
            />
            Background Music
          </label>
          <label className="checkbox-group">
            <input
              type="checkbox"
              name="color_grading_required"
              checked={form.color_grading_required}
              onChange={handleChange}
            />
            Color Grading
          </label>
        </div>

        <div className="form-group full-width">
          <label className="form-label" htmlFor="additional_instructions">Additional Instructions</label>
          <textarea
            id="additional_instructions"
            name="additional_instructions"
            value={form.additional_instructions}
            onChange={handleChange}
            className="form-control"
            rows={3}
            placeholder="Any other instructions for the editor..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
