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
class Resamp(flo.flow.factory, family="flo.isce.resamp", implements=flo.model.resamp):
    """
    The ISCE SLC factory
    """

    # inputs
    reference = flo.model.slc.input()
    target = flo.model.slc.input()
    # output
    interferogram = flo.model.interferogram.output()



    # flow hooks
    def pyre_run(self, **kwds):
        """
        Form an SLC given a RAW raster
        """
        # get my slc
        reference = self.reference
        target = self.target
        # check
        assert reference.lines == target.lines
        assert reference.samples == target.samples

        # get my interferogram
        interferogram = self.interferogram
        # for now, just transfer the size info to the SLC
        interferogram.samples = reference.samples
        interferogram.lines = reference.lines

        # all done
        return self


# end of file
