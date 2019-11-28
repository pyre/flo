#-*- coding: utf-8 -*-


# support
import flo
# superclass
from .Reader import Reader


# the reader
class SLC(Reader, family="isce3.readers.slc", implements=flo.model.readers.slc):
    """
    A reader of the standard isce3 encoding of SLCs
    """


    # user configurable state
    filename = flo.properties.path()
    filename.doc = "the path to the SLC file"

    # outputs
    slc = flo.model.products.slc.output()
    slc.doc = "the SLC product retrieved from the file"


# end of file
