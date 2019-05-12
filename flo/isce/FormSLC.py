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
class FormSLC(flo.flow.factory, family="flo.isce.formSLC", implements=flo.model.formSLC):
    """
    The ISCE SLC factory
    """

    # inputs
    raw = flo.model.raw.input()
    # outputs
    slc = flo.model.slc.output()

    # configurable state
    prf = flo.properties.float(default=1.0)


    # flow hooks
    def pyre_run(self, requestor, stale, **kwds):
        """
        Form an SLC given a RAW raster
        """
        # get my RAW raster
        raw = self.raw
        # and my SLC
        slc = self.slc
        # for now, just transfer the size info to the SLC
        slc.samples = raw.samples
        slc.lines = raw.lines
        # all done
        return self


# end of file
