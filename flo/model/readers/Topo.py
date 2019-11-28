#-*- coding: utf-8 -*-


# support
import flo
# superclass
from .Reader import Reader
# my parts
from .. import products


# the reader
class Topo(Reader, family="flo.readers.topo"):
    """
    Readers of files with topo rasters
    """


    # user configurable state
    filename = flo.properties.path()
    filename.doc = "the path to the file with the topo raster"

    # outputs
    topo = products.topo.output()
    topo.doc = "the topo raster retrieved from  the file"


    # framework hooks
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Provide access to the default reference implementation
        """
        # invoke the foundry and publish the reader
        return flo.isce3.readers.topo()


# end of file
