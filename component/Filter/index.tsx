import NumberRange from "./NumberRange";
import SelectMany from "./SelectMany";

interface Filter {
    filterType: string,
    unit?: 'CURRENCY' | undefined,
    paramQueryFieldNumberFrom?: string | undefined;
    paramQueryFieldNumberTo?: string | undefined;
    filterName: string;
    data: Array<any>;
    defaultValue?: string | String[] | undefined;
    fieldsToDisplay?: string | undefined;
    fieldToSet?: string | undefined;
    paramQueryField: string;
}

const Filter: React.FC<Filter> = ({ filterName, data, defaultValue, fieldsToDisplay, fieldToSet, filterType, unit, paramQueryField, paramQueryFieldNumberFrom, paramQueryFieldNumberTo }) => {
    return (
        filterType === 'SELECT_MANY' ?
            <SelectMany
                filterName={filterName}
                data={data}
                defaultValue={defaultValue}
                fieldToSet={fieldToSet}
                paramQueryField={paramQueryField}
                fieldsToDisplay={fieldsToDisplay}
            />
            :
            filterType === 'NUMBER_RANGE' ?
                <NumberRange
                    filterName={filterName}
                    data={data}
                    unit={unit}
                    paramQueryFieldNumberFrom={paramQueryFieldNumberFrom}
                    paramQueryFieldNumberTo={paramQueryFieldNumberTo}
                />
                :
                null
    )
}

export default Filter;
