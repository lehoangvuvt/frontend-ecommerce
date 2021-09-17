import axios from 'axios';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from '@material-ui/lab/Pagination';
import LinearProgress from '@material-ui/core/LinearProgress';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import Item from '../../component/ProductItemMini/item';
import Filter from '../../component/Filter'
import { CategoryType, ProductAttributeType, ProductBrandType, ProductInformationType, SelectedFilterType } from '../../redux/types';
import { RootReducerType } from '../../redux/rootReducer';
import { actions } from '../../component/Filter/action';
import { useTranslation } from 'react-i18next';

const mapStateToProps = (state: RootReducerType) => {
    return {
        selectedFilters: state.filter.selectedFilters,
    }
}

const mapDispatchToProps = {
    setFilter: actions.setFilter,
    resetFilter: actions.resetFilter,
}

const Products: FC<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> = ({ selectedFilters, setFilter, resetFilter }) => {
    const router = useRouter();
    const [foundProducts, setFoundProducts] = useState<Array<ProductInformationType>>([]);
    const [foundProductsCategories, setFoundProductsCategories] = useState<Array<CategoryType>>([]);
    const [foundProductsBrands, setFoundProductsBrands] = useState<Array<ProductBrandType>>([]);
    const [foundProductsSizes, setFoundProductsSizes] = useState<Array<number | string>>([]);
    const [maxPrice, setMaxPrice] = useState<[number, number]>([0, 0]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [attributes, setAttributes] = useState<Array<{ attributeInfo: ProductAttributeType, attributeValues: Array<Date | number | string>, attributeType: 'm' | 's' }>>([]);
    const [isLoadingFoundProducts, setIsLoadingFoundProducts] = useState<boolean>(false);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
    const [selectedSortField, setSelectedSortField] = useState<string>('default');
    const [isToggleFilters, setIsToggleFilters] = useState<boolean>(false);
    const [percentCompleted, setPercentCompleted] = useState<number>(0);
    const { t } = useTranslation();

    function resize() {
        if (window.innerWidth <= 1000) {
            setIsSmallScreen(true);
        } else {
            setIsSmallScreen(false);
        }
    }

    useEffect(() => {
        resetFilter();
        resize();
        window.addEventListener("resize", resize.bind(this));
        return () => {
            window.removeEventListener("resize", resize.bind(this));
        };
    }, [])

    useEffect(() => {
        let filters = document.getElementById('filters');
        let filtersToggle = document.getElementById('filters-toggle');
        if (!isSmallScreen) {
            setIsToggleFilters(false);
            if (filters) {
                filters.style.width = '21%';
                filters.style.left = '0%';
            }
        } else {
            if (filters && filtersToggle) {
                filters.style.width = '70%';
                filters.style.left = '-70%';
                filtersToggle.style.left = '0%';
                filtersToggle.style.width = '40px';
                filtersToggle.style.background = 'transparent';
                setIsToggleFilters(false);
            }
        }
    }, [isSmallScreen])

    useEffect(() => {
        if (!router.isReady) return;
        let queryObj = router.query;
        if (router.query.page) {
            const current_page = router.query.page;
            setPage(parseInt(current_page.toString()));
        }
        let newPath = '';
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        let url = `http://localhost:5035/products?${newPath.substring(0, newPath.length - 1)}`;
        const getProducts = async () => {
            setPercentCompleted(0);
            setIsLoadingFoundProducts(true);
            const response = await axios({
                url,
                method: 'GET',
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setPercentCompleted(percentCompleted);
                },
            });
            const data = await response.data;
            const products = data.products;
            const categories = data.categories;
            const sizes = data.sizes;
            const maxPrice = data.max_price;
            const totalPages = data.total_pages;
            const totalRecords = data.total_records;
            const attributes = data.attributes;
            const brands = data.brands;
            setIsLoadingFoundProducts(false);
            setFoundProducts(products);
            setFoundProductsCategories(categories);
            setFoundProductsSizes(sizes);
            setMaxPrice([0, maxPrice]);
            setTotalPages(totalPages);
            setTotalRecords(totalRecords);
            setAttributes(attributes);
            setFoundProductsBrands(brands);
        };
        getProducts();
        if (router.query.sort) {
            if (router.query.sort.toString().split(' ').length > 1) {
                const sortField = router.query.sort.toString().split(' ')[0];
                const sortOption = router.query.sort.toString().split(' ')[1];
                setSelectedSortField(`${sortField}_${sortOption}`);
            } else {
                setSelectedSortField(router.query.sort.toString());
            }
        }
    }, [router.isReady, router.query, selectedFilters])


    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        let newPath: string;
        newPath = '';
        let queryObj = router.query;
        queryObj.page = value.toString();
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        router.push(`/products?${newPath.substring(0, newPath.length - 1)}`);
    };

    const sortProducts = (sortField: string, option?: string) => {
        let queryObj = router.query;
        let newPath: string;
        newPath = '';
        switch (sortField) {
            case 'price':
                queryObj.sort = `price ${option}`;
                break;
            case 'newest':
                queryObj.sort = `newest`;
                break;
            case 'top_seller':
                queryObj.sort = 'top_seller';
                break;
            default:
                queryObj.sort = 'default';
                break;
        }
        queryObj.page = '1';
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        // router.push(`/products?${newPath.substring(0, newPath.length - 1)}`);
        router.push({
            pathname: router.pathname,
            query: queryObj,
        }, undefined, { scroll: false });
    }

    const removeFilter = (filter: SelectedFilterType) => {
        const paramQueryField = filter.filterFieldName;
        const value = filter.filterSetValue;
        let queryObj = router.query;
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
        let newPath = '';
        queryObj.page = '1';
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        const newUrl = `/products?${newPath.substring(0, newPath.length - 1)}`;
        setFilter(filter);
        router.push({
            pathname: router.pathname,
            query: queryObj,
        }, undefined, { scroll: false });
    }

    const clearAllFilters = () => {
        let queryObj = router.query;
        for (let property in queryObj) {
            if (property !== 'page' && property !== 'q') {
                delete queryObj[property];
            }
        }
        resetFilter();
        queryObj.page = '1';
        router.push({
            pathname: router.pathname,
            query: queryObj,
        }, undefined, { scroll: false });
    }

    return (
        <div className='products-container'>
            {isLoadingFoundProducts ?
                <LinearProgress
                    style={{ width: '100%' }}
                    variant="determinate" value={percentCompleted} /> : null
            }
            <div
                id='filters'
                className='products-container__left'>
                {foundProductsCategories.length > 0 ?
                    <Filter
                        fieldToSet={'SID'}
                        paramQueryField={'category_sid'}
                        fieldsToDisplay={'CATEGORY_NAME'}
                        filterName={t('search.category')}
                        data={foundProductsCategories}
                        filterType={'SELECT_MANY'}
                    />
                    :
                    null
                }
                {foundProductsBrands.length > 0 ?
                    <Filter
                        fieldToSet={'SID'}
                        paramQueryField={'brand_sid'}
                        fieldsToDisplay={'NAME'}
                        filterName={t('search.brand')}
                        data={foundProductsBrands}
                        filterType={'SELECT_MANY'}
                    />
                    :
                    null
                }
                {attributes.length > 0 ?
                    attributes.map(attribute =>
                        <Filter
                            filterName={attribute.attributeInfo.LABEL_TEXT}
                            data={attribute.attributeValues}
                            filterType={'SELECT_MANY'}
                            paramQueryField={`patb_${attribute.attributeType}_` + attribute.attributeInfo.ID}
                        />)
                    :
                    null
                }
                {/* {maxPrice.length > 0 ?
                    <Filter
                        filterName={"Price"}
                        unit={"CURRENCY"}
                        data={maxPrice}
                        filterType={'NUMBER_RANGE'}
                        paramQueryFieldNumberFrom={'price_from'}
                        paramQueryFieldNumberTo={'price_to'}
                        paramQueryField={''}
                    />
                    :
                    null
                } */}
            </div>
            <div
                id='filters-toggle'
                className='products-container__filters-toggle'>
                <i
                    className={isToggleFilters ? "fas fa-times" : "fas fa-sliders-h"}
                    onClick={() => {
                        let filters = document.getElementById('filters');
                        let filtersToggle = document.getElementById('filters-toggle');
                        if (!isToggleFilters) {
                            setIsToggleFilters(true);
                            if (filters) filters.style.left = '0%';
                            if (filtersToggle) {
                                filtersToggle.style.left = '70%';
                                filtersToggle.style.width = '30%';
                                filtersToggle.style.background = 'rgba(0,0,0,0.4)';
                            }
                        } else {
                            setIsToggleFilters(false);
                            if (filters) filters.style.left = '-70%';
                            if (filtersToggle) {
                                filtersToggle.style.left = '0%';
                                filtersToggle.style.width = '40px';
                                filtersToggle.style.background = 'transparent';
                            }
                        }
                    }}>
                </i>
            </div>
            <div className='products-container__right'>
                <div className='products-container__right__top'>
                    <div className='products-container__right__top__results-num-tab'>
                        <div
                            style={{
                                height: selectedFilters.length > 0 ? '50%' : '100%',
                            }}
                            className='products-container__right__top__results-num-tab__text'>
                            {totalRecords} {t('search.result')} "{router.query.q}"
                        </div>
                        {selectedFilters.length > 0 ?
                            <div className='products-container__right__top__results-num-tab__selected-filters'>
                                Filtered By:
                                {selectedFilters.map(filter =>
                                    <Chip
                                        size="small"
                                        label={`${filter.filterName}: ${filter.filterValue}`}
                                        onDelete={() => { removeFilter(filter) }}
                                        variant="default"
                                        deleteIcon={<ClearIcon />}
                                    />
                                )}
                                <a
                                    onClick={() => { clearAllFilters() }}
                                    id='clear-filter-link'>CLEAR ALL</a>
                            </div>
                            : null
                        }
                    </div>
                    <div className='products-container__right__top__sort-tabs'>
                        <div
                            onClick={() => { sortProducts('default') }}
                            className={
                                selectedSortField === 'default' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            {t('search.popular')}
                        </div>
                        <div
                            onClick={() => { sortProducts('top_seller') }}
                            className={
                                selectedSortField === 'top_seller' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            {t('search.bestSelling')}
                        </div>
                        <div
                            onClick={() => { sortProducts('newest') }}
                            className={
                                selectedSortField === 'newest' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            {t('search.newest')}
                        </div>
                        <div
                            onClick={() => { sortProducts('price', 'asc') }}
                            className={
                                selectedSortField === 'price_asc' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            {t('search.highPrice')}
                        </div>
                        <div
                            onClick={() => { sortProducts('price', 'desc') }}
                            className={
                                selectedSortField === 'price_desc' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            {t('search.lowPrice')}
                        </div>
                    </div>
                </div>
                <div className='products-container__right__products-container'>
                    {
                        !isLoadingFoundProducts ?
                            foundProducts.length > 0 ?
                                foundProducts.map(productInformation =>
                                    <Item
                                        key={productInformation.SID}
                                        productInformation={productInformation}
                                    />)
                                :
                                <div className='products-container__right__products-container__not-found-container'>
                                    <div className='products-container__right__products-container__not-found-container__text'>
                                        <h1>{t('search.total')}</h1>
                                        <p>{t('search.sorry')}</p>
                                    </div>
                                    <div className='products-container__right__products-container__not-found-container__icon'>
                                        <img src='https://image.flaticon.com/icons/png/512/1178/1178479.png' />
                                    </div>
                                </div>
                            : null
                        // <ClipLoader loading={isLoadingFoundProducts} size={25} />
                    }
                </div>
                <div className='products-container__right__pagination'>
                    {totalPages > 1 ?
                        <Pagination
                            count={totalPages}
                            shape="round"
                            page={page}
                            siblingCount={1}
                            boundaryCount={1}
                            onChange={changePage} />
                        : null
                    }
                </div>
            </div>
        </div >
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);