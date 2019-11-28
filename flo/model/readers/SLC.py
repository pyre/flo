#-*- coding: utf-8 -*-


# support
import flo
# superclass
from .Reader import Reader
# my parts
from .. import products

# the SLC reader
class SLC(Reader, family="flo.readers.slc"):
    """
    Readers of files that encode SLC
    """


    # required state
    filename = flo.properties.path()
    filename.doc = "the path to the SLC file"

    # outputs
    slc = products.slc.output()
    slc.doc = "the SLC product retrieved from the file"


    # framework hooks
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Provide access to the default reference implementation
        """
        # invoke the foundry and publish the reader
        return flo.isce3.readers.slc()


# end of file
