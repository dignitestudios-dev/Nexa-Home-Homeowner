'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { useCreateReportIssue, useGetReportIssues } from '@/features/report/hooks'
import ServiceCard from '../report-issue/_components/issue-card'
import IssueCard from '../report-issue/_components/issue-card'
import SuccessDialog from '@/components/ui/success-dialog'
// import { useGetReportIssues, useCreateReportIssue } from '@/features/user/hooks'

const TITLE_MAX = 30
const DESC_MAX = 250
const REPORTS_PER_PAGE = 10

const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

const reportIssueSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required.')
        .max(TITLE_MAX, `Title must be ${TITLE_MAX} characters or less.`)
        .refine((val) => !emojiRegex.test(val), 'Emojis are not allowed.'),
    description: z
        .string()
        .trim()
        .min(1, 'Description is required.')
        .max(DESC_MAX, `Description must be ${DESC_MAX} characters or less.`)
        .refine((val) => !emojiRegex.test(val), 'Emojis are not allowed.'),
})

type ReportIssueFormValues = z.infer<typeof reportIssueSchema>

export default function ReportIssue() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [statusTab, setStatusTab] = useState<'pending' | 'resolved'>('pending')

    const { data, isLoading } = useGetReportIssues({ page, limit: REPORTS_PER_PAGE, status: statusTab })
    const { mutate: createReport, isPending } = useCreateReportIssue({
        onSuccess: () => {
            setIsDialogOpen(false)
            setIsSuccessDialogOpen(true)
            reset()
        },
    })

    const reports = data?.data?.issues ?? []
    const totalPages = data?.data.pagination?.totalPages ?? 1

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ReportIssueFormValues>({
        resolver: zodResolver(reportIssueSchema),
        defaultValues: { title: '', description: '' },
    })

    const titleValue = watch('title')
    const descriptionValue = watch('description')

    const onSubmit = (values: ReportIssueFormValues) => {
        createReport(values)
    }

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) reset()
    }

    return (
        <>
            <div className="space-y-6">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-[24px] font-semibold text-[#181818]">Report an Issue</h2>
                    <button
                        type="button"
                        onClick={() => setIsDialogOpen(true)}
                        className="inline-flex items-center gap-2 text-[16px] font-medium bg-[#005864] text-white px-4 rounded-md py-2 underline-offset-4"
                    >
                        <Plus className="size-5" strokeWidth={2} />
                        Add Report
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-[#E5E5E5]">
                    <button
                        onClick={() => { setStatusTab('pending'); setPage(1); }}
                        className={`pb-3 text-[15px] font-medium transition-colors ${statusTab === 'pending' ? 'border-b-2 border-[#005864] text-[#005864]' : 'text-[#737373] hover:text-[#181818]'}`}
                    >
                        Unresolved
                    </button>
                    <button
                        onClick={() => { setStatusTab('resolved'); setPage(1); }}
                        className={`pb-3 text-[15px] font-medium transition-colors ${statusTab === 'resolved' ? 'border-b-2 border-[#005864] text-[#005864]' : 'text-[#737373] hover:text-[#181818]'}`}
                    >
                        Resolved
                    </button>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-[90px] animate-pulse rounded-2xl bg-[#F0F0F0]" />
                        ))}
                    </div>
                ) : reports.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#005864] bg-[rgba(0,88,100,0.04)] px-6 py-12 text-center">
                        <p className="font-medium text-[#1F1F1F]">
                            {statusTab === 'pending' ? 'No unresolved reports yet.' : 'No resolved reports yet.'}
                        </p>
                        <p className="mt-1 text-sm text-[rgba(24,24,24,0.5)]">
                            {statusTab === 'pending' 
                                ? 'Use the button above to report an issue.' 
                                : 'Resolved issues will appear here.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {reports?.map((report) => (
                                <IssueCard
                                    key={report._id}
                                    issueId={report._id}

                                    title={report.title}
                                    description={report.description}
                                    // status="Completed"
                                    date={new Date(report.createdAt).toLocaleDateString()}
                                // actionText="Report an Issue"
                                // when={new Date(report.createdAt).toLocaleTimeString()}
                                />
                            ))}
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>

            {/* Add Report Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[460px] rounded-[16px] border-none bg-white p-6">
                    <DialogHeader>
                        <DialogTitle className="text-[20px] font-semibold text-[#181818]">
                            Add Report
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
                        {/* Title field */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-[#181818]">
                                Issue Title
                            </label>
                            <input
                                {...register('title')}
                                onChange={(e) => {
                                    const val = e.target.value
                                        .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
                                        .replace(/^\s+/, '')
                                    setValue('title', val, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                                }}
                                onBlur={(e) => {
                                    setValue('title', e.target.value.trim(), { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                                }}
                                type="text"
                                placeholder="Brief title of the issue"
                                maxLength={TITLE_MAX}
                                className={`w-full rounded-[10px] border px-4 py-3 text-[14px] text-[#181818] placeholder:text-[rgba(24,24,24,0.35)] outline-none transition focus:ring-2 focus:ring-[#005864]/20 ${errors.title
                                    ? 'border-red-400 focus:border-red-400'
                                    : 'border-[#E5E5E5] focus:border-[#005864]'
                                    }`}
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] text-red-500">{errors.title?.message ?? ''}</p>
                                <p className={`text-[12px] ${titleValue?.length >= TITLE_MAX ? 'text-red-500' : 'text-[#999]'}`}>
                                    {titleValue?.length ?? 0}/{TITLE_MAX}
                                </p>
                            </div>
                        </div>

                        {/* Description field */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-[#181818]">
                                Description
                            </label>
                            <textarea
                                {...register('description')}
                                onChange={(e) => {
                                    const val = e.target.value
                                        .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
                                        .replace(/^\s+/, '')
                                    setValue('description', val, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                                }}
                                onBlur={(e) => {
                                    setValue('description', e.target.value.trim(), { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                                }}
                                placeholder="Describe the issue in detail"
                                maxLength={DESC_MAX}
                                rows={4}
                                className={`w-full resize-none rounded-[10px] border px-4 py-3 text-[14px] text-[#181818] placeholder:text-[rgba(24,24,24,0.35)] outline-none transition focus:ring-2 focus:ring-[#005864]/20 ${errors.description
                                    ? 'border-red-400 focus:border-red-400'
                                    : 'border-[#E5E5E5] focus:border-[#005864]'
                                    }`}
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] text-red-500">{errors.description?.message ?? ''}</p>
                                <p className={`text-[12px] ${descriptionValue?.length >= DESC_MAX ? 'text-red-500' : 'text-[#999]'}`}>
                                    {descriptionValue?.length ?? 0}/{DESC_MAX}
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-2 flex h-[49px] w-full items-center justify-center rounded-[12px] bg-[#005864] text-[14px] font-semibold text-white transition hover:bg-[#004d57] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? 'Submitting...' : 'Add Now'}
                        </button>
                    </form>
                </DialogContent>
            </Dialog>

            <SuccessDialog
                open={isSuccessDialogOpen}
                onClose={() => setIsSuccessDialogOpen(false)}
                title="Issue Reported Successfully"
            />
        </>
    )
}