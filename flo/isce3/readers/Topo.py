#-*- coding: utf-8 -*-


# support
import flo
# superclass
from .Reader import Reader


# the reader
class Topo(Reader, family="isce3.readers.topo", implements=flo.model.readers.topo):
    """
    A reader of the standard isce3 encoding of topo rasters
    """


    # user configurable state
    filename = flo.properties.path()
    filename.doc = "the path to the file with the topo raster"

    # outputs
    topo = flo.model.products.topo.output()
    topo.doc = "the topo raster retrieved from the file"


    # flow hooks
    def pyre_run(self, **kwds):
        """
        Rebuild my outputs
        """
        print(f"{self.pyre_spec}")
        # all done
        return self


# end of file
