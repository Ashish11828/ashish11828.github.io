import React, { useEffect, useId, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowUpRight, Loader2, Mail, RotateCcw, Send } from 'lucide-react';
import { TRANSLATIONS, type LanguageCode } from '../data/translations';

export interface ContactDraft {
  topic?: string;
  message: string;
  nonce: number;
}

interface ContactFormProps {
  prefillDraft?: ContactDraft | null;
  language?: LanguageCode;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  topic: string;
  message: string;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const TOPICS = [
  'Research Collaboration',
  'XR / Smart Glasses Role',
  'AI Safety & ML Engineering',
  'Speaking / Mentoring',
  'General Inquiry',
] as const;

const RECIPIENT_EMAIL = 'ak6358404@gmail.com';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_VALUES: FormValues = {
  name: '',
  email: '',
  topic: TOPICS[0],
  message: '',
  honeypot: '',
};

export const ContactForm: React.FC<ContactFormProps> = ({
  prefillDraft,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language].contactForm;
  const formId = useId();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'emailjs' | 'formsubmit'>('emailjs');
  const lastDraftNonceRef = useRef<number>(-1);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!prefillDraft || prefillDraft.nonce === lastDraftNonceRef.current) return;
    lastDraftNonceRef.current = prefillDraft.nonce;

    let validTopic: string | undefined;
    if (prefillDraft.topic) {
      if (TOPICS.includes(prefillDraft.topic as (typeof TOPICS)[number])) {
        validTopic = prefillDraft.topic;
      } else {
        const localizedIdx = t.topics.indexOf(prefillDraft.topic);
        if (localizedIdx >= 0 && TOPICS[localizedIdx]) {
          validTopic = TOPICS[localizedIdx];
        }
      }
    }

    setStatus('idle');
    setErrorMessage('');
    setErrors((prev) => ({ ...prev, message: undefined }));
    setValues((prev) => ({
      ...prev,
      topic: validTopic ?? prev.topic,
      message: prefillDraft.message.slice(0, 2500),
    }));

    window.setTimeout(() => {
      messageInputRef.current?.focus();
    }, 280);
  }, [prefillDraft]);

  const validate = (draft: FormValues): FormErrors => {
    const next: FormErrors = {};
    const trimmedName = draft.name.trim();
    const trimmedEmail = draft.email.trim();
    const trimmedMsg = draft.message.trim();

    if (trimmedName.length < 2) {
      next.name = t.errNameShort;
    } else if (trimmedName.length > 100) {
      next.name = t.errNameLong;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      next.email = t.errEmailInvalid;
    }

    if (trimmedMsg.length < 10) {
      next.message = t.errMsgShort;
    } else if (trimmedMsg.length > 2500) {
      next.message = t.errMsgLong;
    }

    return next;
  };

  const handleChange = (
    field: keyof FormValues,
    value: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Silently ignore spam bots that populate hidden honeypot
    if (values.honeypot.trim().length > 0) {
      setStatus('success');
      return;
    }

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const payload = {
      from_name: values.name.trim(),
      reply_to: values.email.trim(),
      subject: values.topic,
      message: values.message.trim(),
      to_email: RECIPIENT_EMAIL,
    };

    const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '').trim();
    const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '').trim();
    const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '').trim();

    try {
      if (serviceId && templateId && publicKey) {
        await emailjs.send(serviceId, templateId, payload, { publicKey });
        setDeliveryMethod('emailjs');
      } else {
        const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: payload.from_name,
            email: payload.reply_to,
            topic: payload.subject,
            message: payload.message,
            _subject: `[Portfolio · ${payload.subject}] Message from ${payload.from_name}`,
            _template: 'table',
          }),
        });

        if (!res.ok) {
          throw new Error(`Submission failed with status ${res.status}`);
        }
        setDeliveryMethod('formsubmit');
      }

      setStatus('success');
      setValues(INITIAL_VALUES);
      setErrors({});
    } catch {
      setStatus('error');
      setErrorMessage(t.errorNetwork);
    }
  };

  const mailtoFallbackHref = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(
    `[${values.topic}] Message from ${values.name.trim() || 'Portfolio Visitor'}`
  )}&body=${encodeURIComponent(
    `${values.message.trim()}\n\n— ${values.name.trim()}${values.email.trim() ? ` (${values.email.trim()})` : ''}`
  )}`;

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
    setErrors({});
  };

  const inputBaseClass =
    'w-full rounded-xl border border-[#DFD6C9] bg-[#FCFBF8]/92 px-3.5 py-2.5 text-sm text-[#171C28] placeholder:text-[#788296] transition-all duration-150 focus:border-[#C83E4D] focus:outline-none focus:ring-2 focus:ring-[#C83E4D]/20 dark:border-white/14 dark:bg-[#0F1629]/85 dark:text-[#F3F6FC] dark:placeholder:text-[#7F8CA6] dark:focus:border-[#F47292] dark:focus:ring-[#F47292]/25';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="mt-10 rounded-2xl border border-[#E6DFD5]/78 bg-[#FFFFFF]/78 p-6 backdrop-blur-md sm:p-8 dark:border-white/12 dark:bg-[#0B1020]/74"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left 5 Columns: Direct Message Introduction */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <p className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
              {t.eyebrow}
            </p>
            <h3 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#171C28] sm:text-3xl dark:text-[#F3F6FC] [text-wrap:balance]">
              {t.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
              {t.intro}
            </p>

            <div className="mt-6 space-y-2.5 border-t border-[#EFEAE1] pt-5 text-xs text-[#525C6E] dark:border-white/10 dark:text-[#9CA8BE]">
              <p className="font-semibold text-[#171C28] dark:text-[#EEF1F7]">
                {t.typicalTopics}
              </p>
              <p className="leading-relaxed">
                {t.typicalTopicsBody}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#EFEAE1] pt-5 text-xs text-[#525C6E] dark:border-white/10 dark:text-[#9CA8BE]">
            <Mail className="h-3.5 w-3.5 text-[#C83E4D] dark:text-[#F47292]" aria-hidden="true" />
            <span>{t.directInbox}</span>
            <a
              href={`mailto:${RECIPIENT_EMAIL}`}
              className="font-mono font-medium text-[#171C28] hover:text-[#C83E4D] transition-colors dark:text-[#EEF1F7] dark:hover:text-[#FFA3BC]"
            >
              {RECIPIENT_EMAIL}
            </a>
          </div>
        </div>

        {/* Right 7 Columns: Animated Form & Confirmation States */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="contact-success"
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                role="status"
                aria-live="polite"
                className="flex h-full min-h-[280px] flex-col items-start justify-center rounded-xl border border-[#2E8B6E]/35 bg-[#2E8B6E]/8 p-6 sm:p-8 dark:border-[#57B894]/35 dark:bg-[#57B894]/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2E8B6E]/15 text-[#2E8B6E] dark:bg-[#57B894]/20 dark:text-[#7AE7BC]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                    <motion.path
                      d="M5 12.5L10 17.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>
                </div>

                <h4 className="mt-4 font-display text-xl font-bold text-[#171C28] dark:text-[#F3F6FC]">
                  {t.sentTitle}
                </h4>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#3B4456] dark:text-[#C5CFE0]">
                  {t.sentBody}
                  {deliveryMethod === 'emailjs' ? ' (EmailJS)' : ''}.
                </p>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#D8CFC2] bg-[#FCFBF8] px-4 py-2 text-xs font-semibold text-[#171C28] transition-colors duration-150 hover:border-[#C83E4D] hover:text-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-white/15 dark:bg-[#131B2E] dark:text-[#EEF1F7] dark:hover:border-[#F47292] dark:hover:text-[#FFA3BC] whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.sendAnother}</span>
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >
                {/* Hidden honeypot anti-spam trap */}
                <input
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.honeypot}
                  onChange={(e) => handleChange('honeypot', e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`${formId}-name`}
                      className="mb-1.5 block text-xs font-semibold text-[#2F3748] dark:text-[#DCE3F0]"
                    >
                      {t.nameLabel}
                    </label>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder={t.namePlaceholder}
                      value={values.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? `${formId}-name-err` : undefined}
                      className={`${inputBaseClass} ${
                        errors.name ? 'border-[#C83E4D] dark:border-[#F47292]' : ''
                      }`}
                    />
                    {errors.name && (
                      <p
                        id={`${formId}-name-err`}
                        className="mt-1 text-xs text-[#C83E4D] dark:text-[#FFA3BC]"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`${formId}-email`}
                      className="mb-1.5 block text-xs font-semibold text-[#2F3748] dark:text-[#DCE3F0]"
                    >
                      {t.emailLabel}
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder={t.emailPlaceholder}
                      value={values.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? `${formId}-email-err` : undefined}
                      className={`${inputBaseClass} ${
                        errors.email ? 'border-[#C83E4D] dark:border-[#F47292]' : ''
                      }`}
                    />
                    {errors.email && (
                      <p
                        id={`${formId}-email-err`}
                        className="mt-1 text-xs text-[#C83E4D] dark:text-[#FFA3BC]"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Interactive Topic Selector */}
                <div>
                  <span className="mb-1.5 block text-xs font-semibold text-[#2F3748] dark:text-[#DCE3F0]">
                    {t.topicLabel}
                  </span>
                  <div
                    role="radiogroup"
                    aria-label={t.topicLabel}
                    className="flex flex-wrap gap-1.5"
                  >
                    {TOPICS.map((topic, idx) => {
                      const active = values.topic === topic;
                      const displayTopic = t.topics[idx] ?? topic;
                      return (
                        <button
                          key={topic}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => handleChange('topic', topic)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] whitespace-nowrap shrink-0 ${
                            active
                              ? 'border-[#C83E4D] bg-[#C83E4D] text-white dark:border-[#E14B67] dark:bg-[#E14B67]'
                              : 'border-[#DFD6C9] bg-[#FCFBF8]/80 text-[#4C566A] hover:border-[#C83E4D]/50 hover:text-[#171C28] dark:border-white/14 dark:bg-[#0F1629]/75 dark:text-[#A9B5CA] dark:hover:border-[#F47292]/50 dark:hover:text-[#F3F6FC]'
                          }`}
                        >
                          {displayTopic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label
                      htmlFor={`${formId}-message`}
                      className="text-xs font-semibold text-[#2F3748] dark:text-[#DCE3F0]"
                    >
                      {t.messageLabel}
                    </label>
                    <span className="font-mono text-[11px] tabular-nums text-[#697386] dark:text-[#8E9BB2]">
                      {values.message.length} / 2500
                    </span>
                  </div>
                  <textarea
                    ref={messageInputRef}
                    id={`${formId}-message`}
                    name="message"
                    rows={4}
                    required
                    maxLength={2500}
                    placeholder={t.messagePlaceholder}
                    value={values.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? `${formId}-msg-err` : undefined}
                    className={`${inputBaseClass} resize-y min-h-[112px] ${
                      errors.message ? 'border-[#C83E4D] dark:border-[#F47292]' : ''
                    }`}
                  />
                  {errors.message && (
                    <p
                      id={`${formId}-msg-err`}
                      className="mt-1 text-xs text-[#C83E4D] dark:text-[#FFA3BC]"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {status === 'error' && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="flex flex-col gap-2 rounded-xl border border-[#C83E4D]/40 bg-[#C83E4D]/10 p-3.5 text-xs text-[#8E2230] dark:border-[#F47292]/40 dark:bg-[#F47292]/12 dark:text-[#FFD2DE]"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                    <div className="pl-6">
                      <a
                        href={mailtoFallbackHref}
                        className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-85"
                      >
                        <span>{t.openMailto}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <motion.button
                    type="submit"
                    disabled={status === 'submitting'}
                    whileTap={status === 'submitting' ? undefined : { scale: 0.985 }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#C83E4D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#C83E4D]/25 transition-colors duration-150 hover:bg-[#B23342] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:bg-[#E14B67] dark:shadow-[#E14B67]/25 dark:hover:bg-[#CC3D58] whitespace-nowrap shrink-0"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>{t.sendingButton}</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        <span>{t.sendButton}</span>
                      </>
                    )}
                  </motion.button>

                  <span className="text-xs text-[#697386] dark:text-[#8E9BB2]">
                    {t.deliveredNote}
                  </span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
