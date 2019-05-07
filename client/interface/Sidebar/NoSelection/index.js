// external imports
import React, { useState } from 'react'
import { css } from 'glamor'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'
import { graphql } from 'react-relay'
// local imports
import { Query } from '~/components'
import { useQuery } from '~/hooks'
import FactoryPrototypeEntry from './FactoryPrototypeEntry'
import ProductEntry from './ProductEntry'

const NoSelectionQuery = graphql`
    query NoSelectionSidebarQuery {
        products {
            id
            ...ProductEntry_product
        }
        factories {
            id
            ...FactoryPrototypeEntry_factory
        }
    }
`

export default () => {
    // the current tab
    const [tabIndex, setTabIndex] = useState(0)

    return (
        <Query query={NoSelectionQuery} loadingState={'Loading...'}>
            {data => (
                <Tabs
                    {...css({
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        overflowY: 'hidden',
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
                    <TabPanels {...css({ overflowY: 'auto' })}>
                        <TabPanel {...css({ outline: 'none' })}>
                            {data.products.map(product => (
                                <ProductEntry key={product.id} product={product} />
                            ))}
                        </TabPanel>
                        <TabPanel {...css({ outline: 'none' })}>
                            {data.factories.map(factory => (
                                <FactoryPrototypeEntry key={factory.id} factory={factory} />
                            ))}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            )}
        </Query>
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
