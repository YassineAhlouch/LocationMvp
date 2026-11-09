import useTranslation from '@/utils/hooks/useTranslation'

/**
 * Static group/column names that exist by default in the database get a
 * localized display label; custom user-created names pass through untouched.
 */
const GROUP_KEY_MAP: Record<string, string> = {
    todo: 'tasks.group.toDo',
    inprogress: 'tasks.group.inProgress',
    underreview: 'tasks.group.underReview',
    done: 'tasks.group.done',
}

const localizeGroupName = (
    t: ReturnType<typeof useTranslation>['t'],
    name: string,
): string => {
    if (!name) {
        return name
    }
    const slug = name.toLowerCase().replace(/[^a-z]/g, '')
    const key = GROUP_KEY_MAP[slug]
    return key ? t(key, name) : name
}

export default localizeGroupName
