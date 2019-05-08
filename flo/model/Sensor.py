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
from .Frame import Frame
from .RAW import RAW


# the specification
class Sensor(flo.flow.producer, family="flo.factories.sensors"):
    """
    A factory that reads sensor specific frames and converts them to standard isce RAW rasters
    """

    # inputs
    frame = Frame.input()
    # outputs
    raw = RAW.output()


# end of file
