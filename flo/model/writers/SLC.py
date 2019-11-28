#-*- coding: utf-8 -*-


# support
import flo
# superclass
from .Writer import Writer
# my parts
from .. import products


# the reader
class SLC(Writer, family="flo.writers.slc"):
    """
    Writers of files that encode SLC
    """


    # user configurable state
    filename = flo.properties.path()
    filename.doc = "the path to the file with the elevation data"

    # outputs
    dem = products.dem.input()
    dem.doc = "the digital elevation model retrieved from the file"


# end of file
