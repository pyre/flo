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
class SLC(flo.flow.specification, family="flo.products.slc"):
    """
    The SLC data product specification
    """


    # framework support
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Pick a default implementation
        """
        # use SLC from the isce data model
        return flo.isce.slc()


# end of file
