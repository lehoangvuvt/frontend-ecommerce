import { action } from 'typesafe-actions'
import { RESET_FILTER, SET_FILTER } from '../../contants/actions.constants'
import { SelectedFilterType } from '../../redux/types'

export const actions = {
    setFilter: (selectedFilter: SelectedFilterType) => action(SET_FILTER, { selectedFilter }),
    resetFilter: () => action(RESET_FILTER),
}