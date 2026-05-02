'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  MapPin,
  Camera,
  Mic,
  AlertTriangle,
  Leaf,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import type { Alert, AlertLevel } from './AlertsScreen';
import { toast } from 'sonner';

interface CreateAlertModalProps {
  onClose: () => void;
  onCreated: (alert: Alert) => void;
}

interface AlertFormValues {
  disease: string;
  parcelId: string;
  level: AlertLevel;
  description: string;
  gpsLat: string;
  gpsLng: string;
  useCurrentGps: boolean;
}

const DISEASE_OPTIONS = [
  'Ganoderma boninense',
  'Phytophthora palmivora',
  'Fusarium oxysporum',
  'Rhynchophorus ferrugineus',
  'Coelaenomenodera lameensis',
  'Cercospora elaeidis',
  'Carence Magnésium',
  'Carence Bore',
  'Carence Azote',
  'Autre symptôme',
];

const PARCEL_OPTIONS = [
  'P-B4-012',
  'P-B4-013',
  'P-B4-014',
  'P-B4-015',
  'P-B5-001',
  'P-B5-002',
  'P-B5-003',
  'P-B6-007',
  'P-B6-008',
  'P-B6-009',
  'P-B7-001',
  'P-B7-002',
];

const STEPS = ['Localisation', 'Maladie', 'Description', 'Confirmation'];

export default function CreateAlertModal({ onClose, onCreated }: CreateAlertModalProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AlertFormValues>({
    defaultValues: {
      disease: '',
      parcelId: '',
      level: 'élevé',
      description: '',
      gpsLat: '5.2741',
      gpsLng: '3.3162',
      useCurrentGps: true,
    },
  });

  const watchedValues = watch();

  const handleUseGps = () => {
    // Backend integration point: navigator.geolocation.getCurrentPosition
    setValue('gpsLat', '5.2741');
    setValue('gpsLng', '3.3162');
    toast.success('Position GPS acquise', { description: '5.2741°N, 3.3162°E' });
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Backend integration point: Web Speech API
      setTimeout(() => {
        setValue(
          'description',
          'Palmier avec carpophores de Ganoderma visibles à la base. Frondes inférieures en jupe. Stipe mou au toucher.'
        );
        setIsRecording(false);
        toast.success('Transcription vocale complète');
      }, 2000);
    }
  };

  const onSubmit = async (data: AlertFormValues) => {
    setIsSubmitting(true);
    // Backend integration point: POST /api/alertes (with offline queue fallback)
    await new Promise((r) => setTimeout(r, 1000));

    const newAlert: Alert = {
      id: `ALT-2026-${String(Math.floor(848 + Math.random() * 100)).padStart(4, '0')}`,
      parcelId: data.parcelId,
      parcelName: data.parcelId,
      bloc: `Bloc ${data.parcelId.split('-')[1]}`,
      site: 'Ehania-Toumaguié',
      disease: data.disease,
      level: data.level,
      source: 'manuel',
      status: 'nouveau',
      riskIndex:
        data.level === 'critique'
          ? 75
          : data.level === 'élevé'
            ? 55
            : data.level === 'modéré'
              ? 35
              : 15,
      description: data.description,
      gps: { lat: parseFloat(data.gpsLat), lng: parseFloat(data.gpsLng) },
      reportedBy: 'Vous (PAL-2847)',
      reportedAt: '02/05/2026 02:43',
      assignedTo: null,
      teamName: null,
      photoUrl: hasPhoto
        ? 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=70'
        : null,
      aiRecommendation: null,
      product: null,
      dose: null,
      read: true,
    };

    onCreated(newAlert);
    toast.success('Alerte signalée avec succès', {
      description: `${newAlert.id} · ${data.disease}`,
    });
    setIsSubmitting(false);
  };

  const canProceed = () => {
    if (step === 0) return watchedValues.parcelId !== '';
    if (step === 1) return watchedValues.disease !== '';
    if (step === 2) return watchedValues.description.length >= 10;
    return true;
  };

  const levelColor =
    watchedValues.level === 'critique'
      ? '#F04444'
      : watchedValues.level === 'élevé'
        ? '#F59820'
        : watchedValues.level === 'modéré'
          ? '#06b6d4'
          : '#22c55e';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[450] bg-black/70 backdrop-blur-sm fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed bottom-0 left-0 right-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[500] scale-in sm:rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(10, 15, 12, 0.99)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          borderTop: `2px solid #22c55e`,
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        }}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-4 pb-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <h2 className="text-base font-bold text-foreground">Signaler une alerte</h2>
            <p className="text-xs text-muted-foreground">Site Ehania-Toumaguié</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-all"
            aria-label="Fermer la fenêtre de signalement"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step progress */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-2">
            {STEPS.map((stepLabel, idx) => (
              <React.Fragment key={`step-${stepLabel}`}>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                    style={{
                      background:
                        idx < step
                          ? '#22c55e'
                          : idx === step
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${idx <= step ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                      color: idx <= step ? '#22c55e' : '#6b9b74',
                    }}
                  >
                    {idx < step ? <Check size={11} /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-medium hidden sm:inline ${idx === step ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {stepLabel}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-0.5 rounded-full transition-all duration-300"
                    style={{ background: idx < step ? '#22c55e' : 'rgba(255,255,255,0.08)' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4 min-h-[260px]">
            {/* STEP 0: Localisation */}
            {step === 0 && (
              <div className="space-y-4 fade-in">
                <div>
                  <label className="block text-sm font-medium text-palm-200 mb-1.5">
                    Parcelle concernée
                    <span className="text-risk-high ml-1">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Scannez le QR code ou sélectionnez la parcelle manuellement
                  </p>
                  <div className="relative">
                    <select
                      {...register('parcelId', { required: 'Sélectionnez une parcelle' })}
                      className="w-full appearance-none px-4 py-3 rounded-xl text-sm bg-input border border-border text-foreground focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">-- Sélectionner une parcelle --</option>
                      {PARCEL_OPTIONS.map((p) => (
                        <option key={`parcel-opt-${p}`} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.parcelId && (
                    <p className="mt-1.5 text-xs text-risk-high flex items-center gap-1">
                      <AlertTriangle size={11} />
                      {errors.parcelId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-palm-200 mb-1.5">
                    Coordonnées GPS
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Latitude"
                      {...register('gpsLat')}
                      className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-input border border-border text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Longitude"
                      {...register('gpsLng')}
                      className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-input border border-border text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleUseGps}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-95"
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                      }}
                    >
                      <MapPin size={13} />
                      GPS
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Disease */}
            {step === 1 && (
              <div className="space-y-4 fade-in">
                <div>
                  <label className="block text-sm font-medium text-palm-200 mb-1.5">
                    Type de maladie / problème
                    <span className="text-risk-high ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {DISEASE_OPTIONS.map((disease) => (
                      <button
                        key={`disease-select-${disease}`}
                        type="button"
                        onClick={() => setValue('disease', disease, { shouldValidate: true })}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                        style={{
                          background:
                            watchedValues.disease === disease
                              ? 'rgba(34, 197, 94, 0.1)'
                              : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${watchedValues.disease === disease ? 'rgba(34, 197, 94, 0.35)' : 'rgba(255,255,255,0.07)'}`,
                        }}
                      >
                        <Leaf
                          size={13}
                          className={
                            watchedValues.disease === disease
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }
                        />
                        <span
                          className={`text-sm italic ${watchedValues.disease === disease ? 'text-primary font-medium' : 'text-palm-200'}`}
                        >
                          {disease}
                        </span>
                        {watchedValues.disease === disease && (
                          <Check size={13} className="text-primary ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-palm-200 mb-1.5">
                    Niveau de criticité
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['faible', 'modéré', 'élevé', 'critique'] as AlertLevel[]).map((lvl) => {
                      const colors: Record<AlertLevel, string> = {
                        faible: '#22c55e',
                        modéré: '#06b6d4',
                        élevé: '#F59820',
                        critique: '#F04444',
                      };
                      return (
                        <button
                          key={`level-select-${lvl}`}
                          type="button"
                          onClick={() => setValue('level', lvl)}
                          className="py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                          style={{
                            background:
                              watchedValues.level === lvl
                                ? `${colors[lvl]}20`
                                : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${watchedValues.level === lvl ? colors[lvl] : 'rgba(255,255,255,0.08)'}`,
                            color: watchedValues.level === lvl ? colors[lvl] : '#6b9b74',
                          }}
                        >
                          {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Description */}
            {step === 2 && (
              <div className="space-y-4 fade-in">
                <div>
                  <label className="block text-sm font-medium text-palm-200 mb-1.5">
                    Description des symptômes
                    <span className="text-risk-high ml-1">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Décrivez ce que vous observez — couleur des feuilles, état du stipe, carpophores
                    visibles…
                  </p>
                  <div className="relative">
                    <textarea
                      {...register('description', {
                        required: 'La description est obligatoire',
                        minLength: { value: 10, message: 'Minimum 10 caractères' },
                      })}
                      rows={4}
                      placeholder="Ex: Carpophores de Ganoderma visibles à la base. Frondes inférieures en jupe. Stipe mou au toucher..."
                      className="w-full px-4 py-3 rounded-xl text-sm bg-input border border-border text-foreground focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className={`
                        absolute bottom-3 right-3 p-2 rounded-lg transition-all
                        ${isRecording ? 'pulse-red' : 'hover:bg-surface-1'}
                      `}
                      style={{
                        background: isRecording
                          ? 'rgba(240, 68, 68, 0.2)'
                          : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${isRecording ? 'rgba(240,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        color: isRecording ? '#F04444' : '#6b9b74',
                      }}
                      aria-label={
                        isRecording ? "Arrêter l'enregistrement vocal" : 'Démarrer la dictée vocale'
                      }
                    >
                      <Mic size={14} />
                    </button>
                  </div>
                  {errors.description && (
                    <p className="mt-1.5 text-xs text-risk-high flex items-center gap-1">
                      <AlertTriangle size={11} />
                      {errors.description.message}
                    </p>
                  )}
                  {isRecording && (
                    <p className="mt-1.5 text-xs text-risk-high flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-risk-high pulse-red" />
                      Enregistrement en cours…
                    </p>
                  )}
                </div>

                {/* Photo capture */}
                <div>
                  <label className="block text-sm font-medium text-palm-200 mb-1.5">
                    Photo (optionnel)
                  </label>
                  <button
                    type="button"
                    onClick={() => setHasPhoto(!hasPhoto)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
                    style={{
                      background: hasPhoto ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px dashed ${hasPhoto ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255,255,255,0.15)'}`,
                      color: hasPhoto ? '#22c55e' : '#6b9b74',
                    }}
                  >
                    <Camera size={16} />
                    {hasPhoto ? '✓ Photo capturée (simulée)' : 'Prendre une photo'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-3 fade-in">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Récapitulatif de l&apos;alerte
                </h3>

                {[
                  { label: 'Parcelle', value: watchedValues.parcelId, icon: <MapPin size={13} /> },
                  { label: 'Maladie', value: watchedValues.disease, icon: <Leaf size={13} /> },
                  {
                    label: 'Niveau',
                    value:
                      watchedValues.level.charAt(0).toUpperCase() + watchedValues.level.slice(1),
                    icon: <AlertTriangle size={13} />,
                    color: levelColor,
                  },
                  {
                    label: 'GPS',
                    value: `${watchedValues.gpsLat}°N, ${watchedValues.gpsLng}°E`,
                    icon: <MapPin size={13} />,
                  },
                  {
                    label: 'Photo',
                    value: hasPhoto ? 'Jointe' : 'Aucune',
                    icon: <Camera size={13} />,
                  },
                ].map((item) => (
                  <div
                    key={`recap-${item.label}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {item.icon}
                      <span className="text-xs">{item.label}</span>
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: item.color || '#e8f5e9' }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}

                {watchedValues.description && (
                  <div
                    className="px-3 py-2.5 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">Description</div>
                    <p className="text-xs text-palm-200 leading-relaxed line-clamp-3">
                      {watchedValues.description}
                    </p>
                  </div>
                )}

                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: 'rgba(34, 197, 94, 0.06)',
                    border: '1px solid rgba(34, 197, 94, 0.12)',
                  }}
                >
                  <span className="text-[10px] text-muted-foreground">
                    L&apos;alerte sera synchronisée dès que la connexion est disponible si vous êtes
                    hors ligne.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation footer */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-surface-1"
                style={{ color: '#6b9b74', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ChevronLeft size={15} />
                Retour
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-surface-1"
                style={{ color: '#6b9b74', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Annuler
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                style={{
                  background: canProceed()
                    ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
                    : 'rgba(34, 197, 94, 0.2)',
                  color: '#0A1F10',
                }}
              >
                Suivant
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-70 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                  color: '#0A1F10',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <AlertTriangle size={15} />
                    Signaler l&apos;alerte
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
