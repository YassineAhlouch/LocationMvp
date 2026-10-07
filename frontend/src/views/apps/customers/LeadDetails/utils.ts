export const leadStatusColor: Record<string, { tag: string; dot?: string }> = {
    New: {
        tag: '',
        dot: 'bg-gray-300',
    },
    Contacted: {
        tag: 'bg-blue-100 text-blue-500 border-blue-500',
        dot: 'bg-blue-500',
    },
    Unqualified: {
        tag: 'bg-error-subtle text-error border-error',
        dot: 'bg-error',
    },
    Qualified: {
        tag: 'bg-success-subtle text-success border-success',
        dot: 'bg-success',
    },
}
