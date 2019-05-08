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
class ALOSFrame(flo.flow.product, family="isce.products.frames.alos", implements=flo.model.frame):
    """
    An ALOS frame
    """

    # product meta-data
    raster = flo.properties.path()
    raster.doc = "the path to the image file"

    leader = flo.properties.path()
    leader.doc = "the path to the leader file"

    samples = flo.properties.int()
    samples.doc = "the number of samples in a line"

    lines = flo.properties.int()
    lines.doc = "the number of acquisition lines"


# end of file
