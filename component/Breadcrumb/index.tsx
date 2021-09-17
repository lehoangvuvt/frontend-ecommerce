import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import Link from '@material-ui/core/Link';
import { useEffect, useState } from 'react';
import { redirect } from 'next/dist/next-server/server/api-utils';
import axios from 'axios';
import { CategoryType } from '../../redux/types';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
}));

const Breadcrumbs = () => {
    const router = useRouter();
    const [paths, setPaths] = useState<string[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        let queryObj = router.query;
        let pathSplitArr = router.pathname.split('/').filter(path => path !== 'detail');
        if (queryObj['category_sid']) {
            const SID = queryObj['category_sid'].toString();
            const getCategory = async () => {
                let category: CategoryType = await getCategoryDetails(SID);
                if (category.CATEGORY_NAME.toString().includes('WOM')) {
                    pathSplitArr.push('Women');
                } else if (category.CATEGORY_NAME.toString().includes('MEN')) {
                    pathSplitArr.push('Men');
                }
                pathSplitArr.push(category.CATEGORY_NAME);
                setPaths(pathSplitArr);
            }
            getCategory();
        } else if (queryObj['psid']) {
            const productName = window.location.href.split('/')[5].split('?')[0].replace(/%20/g, ' ');
            if (paths.length > 0) {
                pathSplitArr = paths.filter(path => path !== '[product_name]');
            } else {
                pathSplitArr = pathSplitArr.filter(path => path !== '[product_name]');
            }
            pathSplitArr.push(productName);
            setPaths(pathSplitArr);
        } else {
            setPaths(pathSplitArr);
        }

    }, [router.isReady, router.query])

    const getCategoryDetails = async (SID: string) => {
        const response = await axios({
            url: `http://localhost:5035/categories/details/${SID}`,
            withCredentials: true,
            method: 'GET',
        })
        const data = response.data;
        return data.category;
    }

    function redirect(path: string) {

    }

    return (
        router.asPath !== '/'
            && !router.asPath.includes('active-account')
            && router.asPath !== '/resend-activation' ?
            <div className='breadcrumb-container'>
                {paths[1] !== "" ?
                    <Breadcrumb className="breadcrumb-container__breadcrumb">
                        {paths.map((path, i) =>
                            <BreadcrumbItem
                                key={path}
                                className="breadcrumb-container__breadcrumb__item">
                                {i !== paths.length - 1 ?
                                    i === 0 ?
                                        <a onClick={() => { redirect("/") }}
                                            style={{ color: 'rgba(0,0,0,0.55)', cursor: 'pointer' }}
                                        >{t('search.home')}</a>
                                        :
                                        <a
                                            onClick={() => { redirect("/" + path) }}
                                            style={{ color: 'rgba(0,0,0,0.55)', cursor: 'pointer' }}
                                        >{path}</a>
                                    :
                                    <a>
                                        {
                                            path === "" ? "Home" : path.includes('-') ?
                                                path.replace('-', ' ') : path
                                        }
                                    </a>
                                }
                            </BreadcrumbItem>)}
                    </Breadcrumb>
                    : null
                }
            </div>
            :
            null
    )
}

export default Breadcrumbs;