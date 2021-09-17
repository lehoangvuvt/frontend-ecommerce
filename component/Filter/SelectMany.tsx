import { useRouter } from "next/router";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import { FC, useEffect, useState } from "react";
import { actions } from "./action";
import { RootReducerType } from "../../redux/rootReducer";

interface SelectManyPropsType {
    filterName: string;
    data: Array<any>;
    defaultValue: string | String[] | undefined;
    fieldsToDisplay?: string | undefined;
    fieldToSet?: string | undefined;
    paramQueryField: string;
}

const mapStateToProps = (state: RootReducerType) => {
    return {
        selectedFilters: state.filter.selectedFilters,
    }
}

const mapDispatchToProps = {
    setFilter: actions.setFilter,
}

const SelectMany: FC<SelectManyPropsType & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> = ({ filterName, data, defaultValue, fieldsToDisplay, fieldToSet, paramQueryField, setFilter, selectedFilters }) => {
    const [isToggleFitler, setIsToggleFilter] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (paramQueryField) {
            const paramQueryFieldValue = router.query[paramQueryField];
            if (paramQueryFieldValue) {
                if (fieldToSet) {
                    const queryValues = paramQueryFieldValue.toString().split(' ');
                    let displayValues: Array<any>;
                    displayValues = [];
                    if (fieldsToDisplay) {
                        queryValues.map(value => {
                            if (data.filter(data => data[fieldToSet] === value)[0]) {
                                displayValues.push(data.filter(data => data[fieldToSet] === value)[0][fieldsToDisplay]);
                                setFilter({ filterFieldName: paramQueryField, filterName, filterValue: data.filter(data => data[fieldToSet] === value)[0][fieldsToDisplay], filterSetValue: value });
                            }
                        })
                    }
                } else {
                    const queryValues = paramQueryFieldValue.toString().split(' ');
                    queryValues.map(value => {
                        setFilter({ filterFieldName: paramQueryField, filterName, filterValue: value, filterSetValue: value });
                    })
                }

            }
        }
    }, [router.isReady])

    function filter(value: string | number | Date, valueToDisplay: string | number | Date) {
        let queryObj = router.query;
        if (paramQueryField) {
            let queryValue = queryObj[paramQueryField];
            if (queryValue) {
                if (queryValue.toString().includes(' ')) {
                    let queryValues: Array<string>;
                    queryValues = [];
                    queryValue.toString().split(' ').map(value => {
                        if (value !== '') {
                            queryValues.push(value);
                        }
                    })
                    if (queryValues.includes(value.toString())) {
                        queryValues = queryValues.filter(qValue => qValue !== value.toString());
                        let newQuery: string;
                        newQuery = '';
                        queryValues.map(qValue => {
                            if (queryValues.length === 1) {
                                newQuery = qValue.toString();
                            } else {
                                newQuery += qValue.toString() + ' ';
                            }
                        });
                        if (queryValues.length === 1) {
                            queryObj[paramQueryField] = newQuery;
                        } else {
                            queryObj[paramQueryField] = newQuery.substring(0, newQuery.length - 1);
                        }
                    } else {
                        queryObj[paramQueryField] = queryValue.toString() + ' ' + value.toString();
                    }
                } else {
                    if (queryValue.toString() === value.toString()) {
                        delete queryObj[paramQueryField];
                    } else {
                        queryObj[paramQueryField] = queryValue.toString() + ' ' + value.toString();
                    }
                }
            } else {
                queryObj[paramQueryField] = value.toString();
            }
        }
        let newPath = '';
        queryObj.page = '1';
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        const newUrl = `/products?${newPath.substring(0, newPath.length - 1)}`;
        setFilter({ filterName, filterFieldName: paramQueryField, filterValue: valueToDisplay, filterSetValue: value.toString() });
        router.push({
            pathname: router.pathname,
            query: queryObj,
        }, undefined, { scroll: false });
    }

    const checkIfChecked = (value: string) => {
        if (selectedFilters.filter(sFilter => sFilter.filterFieldName === paramQueryField && sFilter.filterSetValue === value.toString())[0]) return true;
        return false;
    }

    return (
        <div
            style={{ maxHeight: isToggleFitler ? '500px' : '50px' }}
            className='filter-containers__filter'>
            <div className='filter-containers__filter__header'>
                <div className='filter-containers__filter__header__left'>
                    {filterName}
                </div>
                {/* <div
                    onClick={() => { setIsToggleFilter(!isToggleFitler) }}
                    className={isToggleFitler ? 'filter-containers__filter__header__right filter-containers__filter__header__right--active' : 'filter-containers__filter__header__right filter-containers__filter__header__right--disabled'}>
                </div> */}
            </div>
            <div className='filter-containers__filter__body'>
                <FormGroup>
                    {
                        data.length > 0 ?
                            data.map((value, i) => {
                                return (
                                    <div key={i}
                                        className='filter-containers__filter__body__value'>
                                        {
                                            <FormControlLabel control={<Checkbox
                                                size={"medium"}
                                                color="primary"
                                                checked={checkIfChecked(fieldToSet ? value[fieldToSet] : value)}
                                                onChange={() => {
                                                    filter(fieldToSet ? value[fieldToSet] : value, fieldsToDisplay ? value[fieldsToDisplay] : value);
                                                }}
                                                name="gilad" />}
                                                label={fieldsToDisplay ? value[fieldsToDisplay] : value}
                                            />
                                        }
                                    </div>
                                )
                            }) : null}
                </FormGroup>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectMany);