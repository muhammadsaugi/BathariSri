import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

const inputCls =
    'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder-slate-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all';

function Field({ label, id, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-bold text-slate-700">{label}</label>
            {children}
            <InputError message={error} />
        </div>
    );
}

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput        = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password     : '',
        password             : '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-5">
                <Field label="Kata Sandi Saat Ini" id="current_password" error={errors.current_password}>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        className={inputCls}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </Field>

                <Field label="Kata Sandi Baru" id="password" error={errors.password}>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={inputCls}
                        placeholder="Minimal 8 karakter"
                        autoComplete="new-password"
                    />
                </Field>

                <Field label="Konfirmasi Kata Sandi Baru" id="password_confirmation" error={errors.password_confirmation}>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className={inputCls}
                        placeholder="Ulangi kata sandi baru"
                        autoComplete="new-password"
                    />
                </Field>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
                    >
                        {processing ? (
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : '🔒'}
                        Perbarui Kata Sandi
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-200"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-200"
                        leaveTo="opacity-0"
                    >
                        <p className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
                            <span>✓</span> Kata sandi berhasil diperbarui
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
