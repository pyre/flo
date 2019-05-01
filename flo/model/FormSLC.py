# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#

# support
import flo

# my products
from .RAW import RAW
from .SLC import SLC


# the specification
class FormSLC(flo.flow.producer, family="flo.factories.formSLC"):
    """
    The SLC factory specification
    """

    # inputs
    raw = RAW.input()
    # outputs
    slc = SLC.output()


# end of file
