import {
    List,
    ListItem,
    Typography,
    ListItemText,
    ListItemIcon
} from '@material-ui/core'
import { PlayArrow } from '@material-ui/icons'
import listMenu from './listMenu.json'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

interface IndexType {
    children: JSX.Element | null;
    visibleMenu?: string;
}

const MenuAdmin: React.FC<IndexType> = ({ children, visibleMenu }) => {
    const router = useRouter();
    const [selectMenu, setSelectMenu] = useState<string>("")
    useEffect(() => {
        if (!router.isReady) return;
        const route = router.route;
        const splitRoute = route.split('/')[2]
        setSelectMenu(splitRoute);
    }, [router.isReady])
    return (
        <div style={visibleMenu && visibleMenu === 'header' ? {backgroundColor: 'inherit'} : {}} className="container-menu">
            {
                visibleMenu && visibleMenu === 'header' ? children : (
                <div className="container">
                <Typography className="widget-title" variant="h3">My Account</Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap' }} className="row">
                    <List className="list-menu-admin">
                        {listMenu.map(child => (
                            <ListItem
                                button
                                selected={selectMenu === child.key}
                                onClick={() => { router.push(`/customer/${child.key}`) }}
                            >
                                <ListItemIcon>
                                    <PlayArrow />
                                </ListItemIcon>
                                <ListItemText primary={child.name} />
                            </ListItem>
                        ))}
                    </List>
                    {children}
                </div>
            </div>
                )
            }
            
        </div>
    )
}

export default MenuAdmin;