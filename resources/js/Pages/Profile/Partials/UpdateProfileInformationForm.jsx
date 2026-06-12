import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';



function Field({ label, id, error, children, hint }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-bold text-slate-700">
                {label}
            </label>
            {children}
            {hint && !error && (
                <p className="text-xs text-slate-400">{hint}</p>
            )}
            <InputError message={error} />
        </div>
    );
}

const inputCls =
    'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder-slate-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all';



export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name   : user.name   ?? '',
        email  : user.email  ?? '',
        phone  : user.phone  ?? '',
        alamat : user.alamat ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-5">
                {}
                <Field label="Nama Lengkap" id="name" error={errors.name}>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={inputCls}
                        placeholder="Masukkan nama lengkap"
                        autoComplete="name"
                        required
                    />
                </Field>

                {}
                <Field label="Alamat Email" id="email" error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={inputCls}
                        placeholder="contoh@email.com"
                        autoComplete="username"
                        required
                    />
                </Field>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <span className="text-amber-500 mt-0.5">⚠</span>
                        <p className="text-sm text-amber-700 font-medium">
                            Email Anda belum terverifikasi.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-bold underline hover:no-underline"
                            >
                                Kirim ulang verifikasi
                            </Link>
                        </p>
                    </div>
                )}

                {status === 'verification-link-sent' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700">
                        ✓ Link verifikasi baru telah dikirim ke email Anda.
                    </div>
                )}

                {}
                <Field label="Nomor Telepon" id="phone" error={errors.phone} hint="Format: 08xx-xxxx-xxxx">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium select-none">
                            📱
                        </div>
                        <input
                            id="phone"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className={inputCls + ' pl-11'}
                            placeholder="0812-3456-7890"
                            autoComplete="tel"
                        />
                    </div>
                </Field>

                {}
                <Field label="Alamat Lengkap" id="alamat" error={errors.alamat} hint="Desa, Kecamatan, Kabupaten/Kota, Provinsi">
                    <textarea
                        id="alamat"
                        rows={3}
                        value={data.alamat}
                        onChange={(e) => setData('alamat', e.target.value)}
                        className={inputCls + ' resize-none'}
                        placeholder="Jl. Sawah No. 1, Desa Subur, Kec. Makmur..."
                    />
                </Field>

                {}
                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
                    >
                        {processing ? (
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : '✓'}
                        Simpan Perubahan
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-200"
                        leaveTo="opacity-0"
                    >
                        <p className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
                            <span className="text-emerald-500">✓</span> Berhasil disimpan
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
