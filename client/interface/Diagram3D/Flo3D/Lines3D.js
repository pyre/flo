// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'

const Lines3D = () => null

export default createFragmentContainer(
    Lines3D,
    graphql`
        fragment Lines3D_producer on Producer {
            factories {
                position {
                    x
                    y
                }
                outputs {
                    product {
                        position {
                            x
                            y
                        }
                    }
                }
                inputs {
                    product {
                        position {
                            x
                            y
                        }
                    }
                }
            }
        }
    `
)
