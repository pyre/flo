#-*- coding: utf-8 -*-


# support
import flo


# the factory
class Resamp(flo.flow.factory,
             family="isce3.factories.resamp",
              implements=flo.model.factories.resamp):
    """
    Resample an SLC
    """


    # configurable state
    linesPerTile = flo.properties.int()
    linesPerTile.default = None
    linesPerTile.doc = "number of lines to resample during each iteration"

    offsetsDir = flo.properties.path()
    offsetsDir.default = None
    offsetsDir.doc = "the directory with the offsets"

    outputDir = flo.properties.path()
    outputDir.default = "resamp"
    outputDir.doc = "the directory to contain the output"


    # inputs
    slc = flo.model.products.slc.input()
    slc.doc = "the SLC that defines the transform"


    # flow hooks
    def pyre_run(self, **kwds):
        """
        Rebuild my outputs
        """
        # sign in
        print(f"{self.pyre_spec}")
        # all done
        return self


# end of file
