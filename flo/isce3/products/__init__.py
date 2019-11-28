#-*- coding: utf-8 -*-


# support
import flo


# product foundries
@flo.foundry(implements=flo.model.products.dem, tip="a digital elevation model")
def dem():
    """
    A digital elevation model
    """
    # load the product
    from .DEM import DEM
    # and publish it
    return DEM


@flo.foundry(implements=flo.model.products.slc, tip="the base SLC product")
def slc():
    """
    The base SLC product
    """
    # load the product
    from .SLC import SLC
    # and publish it
    return SLC


@flo.foundry(implements=flo.model.products.topo, tip="a topo raster")
def topo():
    """
    A topo VRT raster
    """
    # load the product
    from .Topo import Topo
    # and publish it
    return Topo


# end of file
