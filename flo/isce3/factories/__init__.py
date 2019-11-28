#-*- coding: utf-8 -*-


# support
import flo


# transformation from geodetic to radar coordinates
@flo.foundry(implements=flo.model.factories.geo2rdr,
               tip="compute the transformation from geodetic to radar coordinates")
def geo2rdr():
    """
    Compute the transformation from geodetic to radar coordinates for a given SLC
    """
    # pull the factory
    from .Geo2Rdr import Geo2Rdr
    # and publish it
    return Geo2Rdr


# transformation from radar to geodetic coordinates
@flo.foundry(implements=flo.model.factories.rdr2geo,
               tip="compute the transformation from radar to geodetic coordinates")
def rdr2geo():
    """
    Compute the transformation from radar to geodetic coordinates for a given SLC
    """
    # pull the factory
    from .Rdr2Geo import Rdr2Geo
    # and publish it
    return Rdr2Geo


@flo.foundry(implements=flo.model.factories.resamp,
               tip="resample an SLC")
def resamp():
    """
    Resample an SLC
    """
    # pull the factory
    from .Resamp import Resamp
    # and publish it
    return Resamp


# end of file
