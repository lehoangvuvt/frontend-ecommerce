import { Reducer, ActionType } from 'typesafe-actions'
import { RESET_FILTER, SET_FILTER } from '../../contants/actions.constants';
import { actions } from './action';
import { SelectedFilterType } from '../../redux/types';

const initialState = {
    selectedFilters: [],
}

type State = {
    selectedFilters: Array<SelectedFilterType>,
}

type Action = ActionType<typeof actions>;

export const filterReducer: Reducer<Readonly<State>, Action> = (state = initialState, action) => {
    switch (action.type) {
        case SET_FILTER:
            let newSelectedFilters = [...state.selectedFilters];
            if (newSelectedFilters.filter(sFilter => sFilter.filterFieldName === action.payload.selectedFilter.filterFieldName && sFilter.filterValue === action.payload.selectedFilter.filterValue).length === 0) {
                newSelectedFilters.push(action.payload.selectedFilter);
            } else {
                newSelectedFilters = newSelectedFilters.filter(sFilter => sFilter.filterFieldName !== action.payload.selectedFilter.filterFieldName && sFilter.filterValue !== action.payload.selectedFilter.filterValue);
            }
            return {
                ...state,
                selectedFilters: newSelectedFilters,
            }
        case RESET_FILTER:
            return {
                ...state,
                selectedFilters: state.selectedFilters.filter(sFilter => sFilter.filterName === ''),
            }
        default:
            return state;
    }
}