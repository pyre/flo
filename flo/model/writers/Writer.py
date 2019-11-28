#-*- coding: utf-8 -*-


# support
import flo

# the writers
class Writer(flo.flow.producer, family="flo.writers"):
    """
    Obligations for writers of the various supported file formats
    """


class SLC(Writer, family="flo.writers.slc"):
    """
    Writers of files that encode SLC
    """


class DEM(Writer, family="flo.writers.dem"):
    """
    Writers of files with digital elevation models
    """


# end of file
