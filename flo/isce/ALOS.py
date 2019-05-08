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
class ALOS(flo.flow.factory, family="isce.factories.sensors.alos", implements=flo.model.sensor):
    """
    The parser of ALOS scenes
    """

    # inputs
    frame = flo.model.frame.input()
    # outputs
    raw = flo.model.raw.input()


    # flow hooks
    def pyre_run(self, requestor, stale, **kwds):
        """
        Form an ISCE RAW raster given an ALOS frame
        """
        # get my frame
        frame = self.frame
        # and my RAW raster
        raw = self.raw
        # for now, just transfer the size info to the SLC
        raw.samples = frame.samples
        raw.lines = frame.lines
        # all done
        return self


# end of file
