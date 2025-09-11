import { config } from '../../../config.ts'


export const GROUPS = {
    TOP_MANAGERS: 'top_managers',
    TECH_MANAGERS: 'tech_managers',
} as const

export type TGroup = (typeof GROUPS)[keyof typeof GROUPS]

export const GROUP_IDS: Record<TGroup, string> = {
    [GROUPS.TOP_MANAGERS]: config.group_ids.top_managers,
    [GROUPS.TECH_MANAGERS]: config.group_ids.tech_managers,
}
