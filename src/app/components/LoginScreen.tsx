'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Leaf,
  Satellite,
  Shield,
  Copy,
  Check,
  Wifi,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';

interface LoginFormValues {
  matricule: string;
  password: string;
  rememberMe: boolean;
}

interface DemoCredential {
  role: string;
  roleLabel: string;
  matricule: string;
  password: string;
  site: string;
  color: string;
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: 'DOP',
    roleLabel: 'Directeur Opérations',
    matricule: 'SIF-DOP-01',
    password: 'palmci2025!',
    site: 'Siège',
    color: 'text-gray-900',
  },
  {
    role: 'CDA',
    roleLabel: 'Chef Dép. Agricole',
    matricule: 'PAL-CDA-12',
    password: 'palmci2025!',
    site: 'Unité (Multi-sites)',
    color: 'text-gray-800',
  },
  {
    role: 'CPI',
    roleLabel: 'Chef de Plantation',
    matricule: 'PAL-CPI-45',
    password: 'palmci2025!',
    site: 'Section Ehania',
    color: 'text-[#009E60]',
  },
  {
    role: 'SPHY',
    roleLabel: 'Surveillant Phyto.',
    matricule: 'PAL-SPH-89',
    password: 'palmci2025!',
    site: 'Section Toumaguié',
    color: 'text-[#F77F00]',
  },
];

const ROLE_REDIRECTS: Record<string, string> = {
  SPHY: '/interventions',
  CPI: '/dashboard',
  CDA: '/dashboard',
  DOP: '/dashboard',
};

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      matricule: '',
      password: '',
      rememberMe: false,
    },
  });

  const matriculeValue = watch('matricule');

  const handleAutofill = (cred: DemoCredential) => {
    setValue('matricule', cred.matricule, { shouldValidate: true });
    setValue('password', cred.password, { shouldValidate: true });
    setLoginError(null);
    toast.success(`Identifiants ${cred.roleLabel} chargés`, {
      description: `Site: ${cred.site}`,
      duration: 2000,
    });
  };

  const handleCopy = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);

    // Backend integration point: POST /auth/login
    await new Promise((r) => setTimeout(r, 1200));

    const matchedCred = DEMO_CREDENTIALS.find(
      (c) => c.matricule === data.matricule && c.password === data.password
    );

    if (!matchedCred) {
      setLoginError(
        'Identifiants invalides — utilisez les comptes de démonstration ci-dessous pour vous connecter.'
      );
      setIsLoading(false);
      return;
    }

    toast.success(`Bienvenue, ${matchedCred.roleLabel}`, {
      description: `Site: ${matchedCred.site} | Connexion sécurisée JWT`,
      duration: 2500,
    });

    const redirect = ROLE_REDIRECTS[matchedCred.role] || '/dashboard';
    setTimeout(() => router.push(redirect), 800);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-stretch">
      {/* LEFT PANEL — Brand */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden bg-white border-r border-gray-200">
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-xl flex-shrink-0 border border-gray-100 p-2 shadow-sm">
              <AppImage
                src="/assets/images/image-1777689165368.png"
                alt="PHYTO-SENTINELLE logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 tracking-wide">
                PHYTO-SENTINELLE
              </div>
              <div className="text-xs text-gray-500 tracking-widest uppercase mt-0.5 font-medium">
                L'intelligence au pied du palmier
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 bg-green-50 border border-green-200 w-fit">
              <Shield size={12} className="text-[#009E60]" />
              <span className="text-xs text-[#009E60] font-semibold tracking-wider uppercase">
                Certifié RSPO · ISO 14001
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Surveillance
              <span className="block text-[#009E60]">Phytosanitaire</span>
              <span className="block text-gray-800">PALMCI</span>
            </h1>

            <p className="text-gray-600 text-base leading-relaxed mb-10 max-w-md">
              Monitoring en temps réel de Ganoderma, Phytophthora et Fusarium sur{' '}
              <strong className="text-gray-900">40 000 ha</strong> de plantations industrielles en
              Côte d'Ivoire.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { value: '40K', unit: 'ha', label: 'Plantations', icon: <Leaf size={14} /> },
                {
                  value: '8',
                  unit: 'sites',
                  label: 'Ehania → Gbapet',
                  icon: <Satellite size={14} />,
                },
                {
                  value: '280K',
                  unit: 't/an',
                  label: 'Huile de palme',
                  icon: <Shield size={14} />,
                },
              ].map((stat) => (
                <div key={`stat-${stat.label}`} className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    {stat.icon}
                    <span className="text-[10px] uppercase tracking-wider font-semibold">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-[#009E60] font-tabular">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.unit}</div>
                </div>
              ))}
            </div>

            {/* Disease targets */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">
                Maladies surveillées
              </p>
              {[
                {
                  name: 'Ganoderma boninense',
                  level: 'Critique',
                  color: 'text-red-700',
                  bg: 'bg-red-50',
                  border: 'border-red-100',
                },
                {
                  name: 'Phytophthora palmivora',
                  level: 'Critique',
                  color: 'text-red-700',
                  bg: 'bg-red-50',
                  border: 'border-red-100',
                },
                {
                  name: 'Fusarium oxysporum',
                  level: 'Critique',
                  color: 'text-red-700',
                  bg: 'bg-red-50',
                  border: 'border-red-100',
                },
                {
                  name: 'Rhynchophorus ferrugineus',
                  level: 'Élevé',
                  color: 'text-orange-700',
                  bg: 'bg-orange-50',
                  border: 'border-orange-100',
                },
                {
                  name: 'Coelaenomenodera lameensis',
                  level: 'Élevé',
                  color: 'text-orange-700',
                  bg: 'bg-orange-50',
                  border: 'border-orange-100',
                },
              ].map((disease) => (
                <div
                  key={`disease-${disease.name}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border ${disease.bg} ${disease.border}`}
                >
                  <span className="text-xs text-gray-700 font-medium italic">{disease.name}</span>
                  <span className={`text-[10px] font-bold ${disease.color}`}>
                    {disease.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden opacity-80 border border-gray-100">
                <AppImage
                  src="/assets/images/image-1777689165368.png"
                  alt="PALMCI SIFCA group logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-xs text-gray-500">Filiale du</div>
                <div className="text-xs font-bold text-gray-900">Groupe SIFCA</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <div className="w-2 h-2 rounded-full bg-[#009E60]" />
              <span>Système opérationnel</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-14 xl:px-16 overflow-y-auto bg-white lg:bg-[#F9FAFB]">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 p-1">
            <AppImage
              src="/assets/images/image-1777689165368.png"
              alt="PHYTO-SENTINELLE logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <div className="text-base font-bold text-gray-900">PHYTO-SENTINELLE</div>
            <div className="text-[10px] text-gray-500 tracking-widest uppercase font-medium">
              PALMCI · Groupe SIFCA
            </div>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto bg-white lg:p-8 lg:shadow-sm lg:border lg:border-gray-100 lg:rounded-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion</h2>
            <p className="text-gray-500 text-sm">
              Entrez votre matricule PALMCI pour accéder au système.
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Matricule */}
            <div>
              <label htmlFor="matricule" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Matricule PALMCI
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Format: PAL-XXXX ou SIF-XXXX</p>
              <div className="relative">
                <input
                  id="matricule"
                  type="text"
                  autoComplete="username"
                  placeholder="PAL-CPI-45"
                  className={`
                    w-full px-4 py-3 rounded-xl text-sm font-mono text-gray-900
                    bg-gray-50 border transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#009E60]/20 focus:border-[#009E60] focus:bg-white
                    ${errors.matricule ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                  {...register('matricule', {
                    required: 'Le matricule est obligatoire',
                    pattern: {
                      value: /^(PAL|SIF)-[A-Z]{3}-\d{2}$/,
                      message: 'Format invalide — ex: PAL-CPI-45',
                    },
                  })}
                />
                {matriculeValue && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {/^(PAL|SIF)-[A-Z]{3}-\d{2}$/.test(matriculeValue) ? (
                      <Check size={16} className="text-[#009E60]" />
                    ) : (
                      <AlertTriangle size={16} className="text-orange-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.matricule && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertTriangle size={11} />
                  {errors.matricule.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mot de passe
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className={`
                    w-full px-4 py-3 pr-12 rounded-xl text-sm text-gray-900
                    bg-gray-50 border transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#009E60]/20 focus:border-[#009E60] focus:bg-white
                    ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                  {...register('password', {
                    required: 'Le mot de passe est obligatoire',
                    minLength: {
                      value: 8,
                      message: 'Minimum 8 caractères',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
               <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertTriangle size={11} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#009E60] focus:ring-[#009E60]"
                  {...register('rememberMe')}
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
                  Rester connecté
                </span>
              </label>
              <button
                type="button"
                className="text-xs text-[#009E60] hover:text-[#007A4A] transition-colors font-semibold"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Error message */}
            {loginError && (
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm bg-red-50 border border-red-100"
                role="alert"
              >
                <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-red-700 font-medium">{loginError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3.5 rounded-xl font-bold text-sm text-white
                transition-all duration-200 flex items-center justify-center gap-2
                ${
                  isLoading
                    ? 'bg-[#009E60]/70 cursor-not-allowed'
                    : 'bg-[#009E60] hover:bg-[#007A4A] active:scale-[0.98] shadow-sm'
                }
              `}
            >
              {isLoading ? (
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
                  <span>Authentification...</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span>Se connecter</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Offline indicator */}
          <div className="flex items-center gap-2 mt-4 px-1 justify-center">
            <Wifi size={12} className="text-[#009E60]" />
            <span className="text-xs text-gray-500 font-medium">
              Authentification hors-ligne disponible
            </span>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold text-center mb-4">
              Comptes de démonstration
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50 border-b border-gray-200">
                <span>Rôle</span>
                <span>Matricule</span>
                <span>Action</span>
              </div>

              {DEMO_CREDENTIALS.map((cred, idx) => (
                <div
                  key={`cred-${cred.role}`}
                  className={`
                    grid grid-cols-[1fr_1fr_auto] gap-3 px-4 py-3 items-center
                    hover:bg-gray-50 transition-colors cursor-pointer
                    ${idx < DEMO_CREDENTIALS.length - 1 ? 'border-b border-gray-100' : ''}
                  `}
                  onClick={() => handleAutofill(cred)}
                >
                  <div>
                    <div className={`text-xs font-bold ${cred.color}`}>{cred.roleLabel}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 font-medium">{cred.site}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      {cred.matricule}
                    </code>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(cred.matricule, `mat-${cred.role}`);
                      }}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                      aria-label={`Copier le matricule ${cred.matricule}`}
                    >
                      {copiedField === `mat-${cred.role}` ? (
                        <Check size={11} className="text-[#009E60]" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAutofill(cred);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-150 active:scale-95 bg-[#009E60]/10 text-[#009E60] hover:bg-[#009E60]/20"
                  >
                    Utiliser
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-gray-500 text-center mt-3 font-medium">
              Mot de passe commun: <code className="text-gray-700 font-mono bg-gray-100 px-1 rounded">palmci2025!</code>
            </p>
          </div>

          {/* Footer note */}
          <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed font-medium">
            Accès réservé aux agents PALMCI autorisés.
            <br />
            Journalisation conforme à la politique RSPO.
          </p>
        </div>
      </div>
    </div>
  );
}
