import Slider from '@material-ui/core/Slider';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { formatter } from '../../utils/currency.formatter';

interface Filter {
    filterName: string,
    data: any[];
    unit: 'CURRENCY' | undefined,
    paramQueryFieldNumberFrom: string | undefined,
    paramQueryFieldNumberTo: string | undefined,
}

const NumberRange: React.FC<Filter> = ({ filterName, data, unit, paramQueryFieldNumberFrom, paramQueryFieldNumberTo }) => {
    const [isToggleFitler, setIsToggleFilter] = useState(true);
    const router = useRouter();
    const [value, setValue] = useState([0, 100])

    function handleChange(e: any, newValue: any) {
        setValue(newValue);
    }

    function scalingValue() {
        const scaleValue = [
            value[0] * (data[data.length - 1] / 100),
            value[1] * (data[data.length - 1] / 100)
        ];
        return scaleValue;
    }

    function filter() {
        let queryObj = router.query;
        const scaleValue = scalingValue();
        if (paramQueryFieldNumberFrom) queryObj[paramQueryFieldNumberFrom] = scaleValue[0] + '';
        if (paramQueryFieldNumberTo) queryObj[paramQueryFieldNumberTo] = scaleValue[1] + '';
        let newPath = '';
        for (const property in queryObj) {
            if (property === 'PAGE') {
                newPath += `PAGE=1&`;
            } else {
                newPath += `${property}=${queryObj[property]}&`;
            }
        }
        window.location.href = `/products?${newPath.substring(0, newPath.length - 1)}`;
    }

    function getFormatValue() {
        const scaleValue = scalingValue();
        let formatValue: string[];
        formatValue = [];
        switch (unit) {
            case 'CURRENCY':
                formatValue.push(formatter(scaleValue[0]));
                formatValue.push(formatter(scaleValue[1]));
                break;
            default:
                formatValue = formatValue;
        }
        return formatValue;
    }

    return (
        <div
            style={{ maxHeight: isToggleFitler ? '500px' : '50px' }}
            className='filter-containers__filter'>
            <div className='filter-containers__filter__header'>
                <div className='filter-containers__filter__header__left'>
                    {filterName}
                </div>
                <div
                    onClick={() => { setIsToggleFilter(!isToggleFitler) }}
                    className={isToggleFitler ? 'filter-containers__filter__header__right filter-containers__filter__header__right--active' : 'filter-containers__filter__header__right filter-containers__filter__header__right--disabled'}>
                </div>
            </div>
            <div
                style={{ alignItems: 'center' }}
                className='filter-containers__filter__body'>
                <Slider
                    style={{ width: '85%', color: 'rgba(0,0,0,0.8)' }}
                    value={value}
                    onChange={handleChange}
                />
                <div
                    style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        paddingLeft: '15px',
                        fontSize: '12px',
                        height: '50px',
                        color: 'rgba(0,0,0,0.9)',
                    }}
                >
                    <button
                        onClick={() => { filter() }}
                        style={{
                            border: 'none',
                            background: 'black',
                            color: 'white',
                            width: '22%',
                            height: '25px',
                            textTransform: 'uppercase',
                            marginRight: '10px',
                            cursor: 'pointer'
                        }}
                    >Filter</button> {filterName}: {getFormatValue()[0]} - {getFormatValue()[1]}
                </div>
            </div>
        </div>
    )
}

export default NumberRange;