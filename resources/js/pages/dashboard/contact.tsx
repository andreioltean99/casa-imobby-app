import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { TinyTextEditor } from '@/components/tiny-text-editor';

type Props = {
    page: {
        id: number;
        section_title: string;
        section_body: string;
        contact_details_title: string;
        address: string | null;
        email: string | null;
        contact_person_name: string | null;
        contact_person_photo_path: string | null;
        contact_person_photo_url: string | null;
        phone: string | null;
        map_placeholder: string | null;
    };
};

export default function DashboardContact({ page }: Props) {
    const t = useAdminT();
    const { data, setData, processing, put, errors } = useForm<{
        section_title: string;
        section_body: string;
        contact_details_title: string;
        address: string;
        email: string;
        contact_person_name: string;
        phone: string;
        map_placeholder: string;
        contact_person_photo: File | null;
    }>({
        section_title: page.section_title ?? '',
        section_body: page.section_body ?? '',
        contact_details_title: page.contact_details_title ?? 'Contact details',
        address: page.address ?? '',
        email: page.email ?? '',
        contact_person_name: page.contact_person_name ?? 'Ploscar Gheorghe Dumitru',
        phone: page.phone ?? '0741634486',
        map_placeholder: page.map_placeholder ?? '',
        contact_person_photo: null,
    });

    const { props } = usePage<{
        status?: string;
    }>();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: '/dashboard' },
            { title: t('breadcrumb.contact_details'), href: '/dashboard/contact' },
        ],
        [t],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/contact', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('contact.meta')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('contact.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('contact.intro')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {props.status && (
                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                                {props.status}
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="section_title">
                                {t('contact.form.section_title')}
                            </label>
                            <input
                                id="section_title"
                                type="text"
                                value={data.section_title}
                                onChange={(e) => setData('section_title', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.section_title && (
                                <p className="text-xs text-red-500">{errors.section_title}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="section_body">
                                {t('contact.form.section_body')}
                            </label>
                            <TinyTextEditor
                                id="section_body"
                                value={data.section_body}
                                onChange={(val) => setData('section_body', val)}
                                className="w-full"
                            />
                            {errors.section_body && (
                                <p className="text-xs text-red-500">{errors.section_body}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="contact_details_title">
                                {t('contact.form.contact_details_title')}
                            </label>
                            <input
                                id="contact_details_title"
                                type="text"
                                value={data.contact_details_title}
                                onChange={(e) => setData('contact_details_title', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.contact_details_title && (
                                <p className="text-xs text-red-500">{errors.contact_details_title}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="address">
                                {t('contact.form.address')}
                            </label>
                            <textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="min-h-[64px] w-full resize-y rounded-md border border-sidebar-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.address && (
                                <p className="text-xs text-red-500">{errors.address}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="email">
                                {t('contact.form.email')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="phone">
                                {t('contact.form.phone')}
                            </label>
                            <input
                                id="phone"
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+40 7xx xxx xxx"
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="contact_person_name">
                                {t('contact.form.contact_person_name')}
                            </label>
                            <input
                                id="contact_person_name"
                                type="text"
                                value={data.contact_person_name}
                                onChange={(e) => setData('contact_person_name', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.contact_person_name && (
                                <p className="text-xs text-red-500">{errors.contact_person_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium" htmlFor="contact_person_photo">
                                {t('contact.form.contact_person_photo')}
                            </label>
                            {page.contact_person_photo_url ? (
                                <div className="flex items-center gap-3">
                                    <img
                                        src={page.contact_person_photo_url}
                                        alt=""
                                        className="h-16 w-16 rounded-full border border-sidebar-border object-cover"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t('contact.form.current_photo_note')}
                                    </p>
                                </div>
                            ) : null}
                            <input
                                id="contact_person_photo"
                                type="file"
                                accept="image/*"
                                className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
                                onChange={(e) =>
                                    setData('contact_person_photo', e.target.files?.[0] ?? null)
                                }
                            />
                            {errors.contact_person_photo && (
                                <p className="text-xs text-red-500">{errors.contact_person_photo}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="map_placeholder">
                                {t('contact.form.map_placeholder')}
                            </label>
                            <input
                                id="map_placeholder"
                                type="text"
                                value={data.map_placeholder}
                                onChange={(e) => setData('map_placeholder', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.map_placeholder && (
                                <p className="text-xs text-red-500">{errors.map_placeholder}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                {t('contact.form.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

