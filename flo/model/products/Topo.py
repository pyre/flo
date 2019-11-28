#-*- coding: utf-8 -*-


# get the package
import flo
# superclass
from .Specification import Specification


# the topo product specification
class Topo(Specification, family="flo.products.topo"):
    """
    The topo product specification
    """


    # framework hooks
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Provide access to the reference implementation
        """
        # invoke the foundry and publish the product
        return flo.isce3.products.topo()


# end of file
