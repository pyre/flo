#-*- coding: utf-8 -*-


# support
import flo


# the reader of digital elevation models
@flo.foundry(implements=flo.model.readers.dem,
               tip="a reader of digital elevation models in standard isce3 format")
def dem():
    """
    Access the reference implementation of a digital elevation model reader
    """
    # pull the factory
    from .DEM import DEM
    # and publish it
    return DEM


# the reader of SLCs
@flo.foundry(implements=flo.model.readers.slc,
               tip="a reader of SLC products in standard isce3 format")
def slc():
    """
    Access the reference implementation of an SLC reader
    """
    # pull the factory
    from .SLC import SLC
    # and publish it
    return SLC


# the reader of topo rasters
@flo.foundry(implements=flo.model.readers.topo,
               tip="a reader of topo rasters in standard isce3 format")
def topo():
    """
    Access the reference implementation of a topo reader
    """
    # pull the factory
    from .Topo import Topo
    # and publish it
    return Topo


# end of file
