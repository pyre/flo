#-*- coding: utf-8 -*-


# protocols for
from . import (
    core,                # core objects
    products,            # product specifications
    factories,           # factory specifications
    readers,             # factories that extract products from files
    workflows,           # built-in workflows
)


# factories for core components; if you are looking to create instances of {isce3} core
# objects, this is probably what you are looking for
def newEllipsoid(**kwds):
    """
    Create a new ellipsoid
    """
    # invoke the foundry to get to the class with the implementation
    ellipsoid = core.ellipsoid()
    # instantiate one and return it
    return ellipsoid(**kwds)


# end of file
