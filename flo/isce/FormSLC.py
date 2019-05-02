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
class FormSLC(flo.flow.factory, family="isce.factories.formSLC", implements=flo.model.formSLC):
    """
    The ISCE SLC factory
    """

    # inputs
    raw = flo.model.raw.input()
    # outputs
    slc = flo.model.slc.output()

    # configurable state
    prf = flo.properties.float(default=1.0)


# end of file
