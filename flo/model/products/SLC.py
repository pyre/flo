#-*- coding: utf-8 -*-


# get the package
import flo
# superclass
from .Specification import Specification


# the SLC specification
class SLC(Specification, family="flo.products.slc"):
    """
    The SLC product specification
    """


    # framework hooks
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Provide access to the reference implementation
        """
        # invoke the foundry and publish the product
        return flo.isce3.products.slc()


# end of file
