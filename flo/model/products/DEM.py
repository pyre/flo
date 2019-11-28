#-*- coding: utf-8 -*-


# get the package
import flo
# superclass
from .Specification import Specification


# the DEM specification
class DEM(Specification, family="flo.products.dem"):
    """
    The DEM product specification
    """


    # framework hooks
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Provide access to the reference implementation
        """
        # invoke the foundry and publish the product
        return flo.isce3.products.dem()


# end of file
