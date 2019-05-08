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
from .SLC import SLC
from .Interferogram import Interferogram


# the specification
class Resamp(flo.flow.producer, family="flo.factories.resamp"):
    """
    The interferogram factory specification
    """

    # inputs
    reference = SLC.input()
    target = SLC.input()

    # outputs
    interferogram = Interferogram.output()


# end of file
