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
class Frame(flo.flow.specification, family="flo.products.frames"):
    """
    A frame of sensor specific data acquired along a track
    """

    # product meta-data
    samples = flo.properties.int()
    samples.doc = "the number of samples in a line"

    lines = flo.properties.int()
    lines.doc = "the number of acquisition lines"


# end of file
