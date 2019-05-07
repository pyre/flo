# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#

# support
import flo


# the specification
class SLC(flo.flow.product, family="isce.products.slc", implements=flo.model.slc):
    """
    The ISCE SLC data product
    """

    # public data
    uri = flo.properties.path()
    uri.doc = "the name of the file with the RAW raster"


# end of file
