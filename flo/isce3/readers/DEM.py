#-*- coding: utf-8 -*-


# support
import flo
# superclass
from .Reader import Reader


# the reader
class DEM(Reader, family="isce3.readers.dem", implements=flo.model.readers.dem):
    """
    A reader of the standard isce3 encoding of digital elevation models
    """


    # user configurable state
    filename = flo.properties.path()
    filename.doc = "the path to the file with the elevation data"

    # outputs
    dem = flo.model.products.dem.output()
    dem.doc = "the digital elevation model retrieved from  the file"


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
