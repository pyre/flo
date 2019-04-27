// external imports
import React, { useState } from 'react'
import { css } from 'glamor'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'
import { graphql } from 'react-relay'
// local imports
import Header from '../Header'
import { darkGrey } from '~/design'
import { Query } from '~/components'
import { useQuery } from '~/hooks'

export default () => {
    // the current tab
    const [tabIndex, setTabIndex] = useState(0)

    // fire the query
    const { data, loading } = useQuery(graphql`
        query NoSelectionSidebarQuery {
            products {
                id
            }
        }
    `)

    return (
        <Tabs
            {...css({
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
            })}
            index={tabIndex}
            onChange={setTabIndex}
        >
            <TabList
                {...css({
                    flexDirection: 'row',
                    display: 'flex',
                    borderBottom: `1px solid #dedede`,
                    marginBottom: 9,
                })}
            >
                <Tab as="div" {...css(styles.tab)} {...tabIndex !== 0 && css(styles.tabInactive)}>
                    Products
                </Tab>
                <Tab as="div" {...css(styles.tab)} {...tabIndex !== 1 && css(styles.tabInactive)}>
                    Factories
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel {...css({ outline: 'none' })}>
                    {!loading && data.products.map(product => <div key={product.id}>{product.id}</div>)}
                </TabPanel>
                <TabPanel {...css({ outline: 'none' })}>factories</TabPanel>
            </TabPanels>
        </Tabs>
    )
}

const styles = {
    tab: {
        display: 'flex',
        flexGrow: 1,
        width: 10,
        marginTop: -10,
        height: 42,
        fontSize: 16,
        background: 'none',
        border: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    tabInactive: {
        color: '#807A73',
    },
}
