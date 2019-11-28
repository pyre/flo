#-*- coding: utf-8 -*-


# support
import flo


# the geo2rdr workflow foundry
@flo.foundry(tip="compute a transformation from geodetic to radar coordinates given an SLC",
               implements=flo.model.flows.flow)
def geo2rdr():
    """
    Compute the transformation from geodetic to radar coordinates for a given SLC
    """
    # grab the flow
    from .Geo2Rdr import Geo2Rdr
    # and publish it
    return Geo2Rdr


# the rdr2geo workflow foundry
@flo.foundry(tip="compute a transformation from radar to geodetic coordinates for a given SLC",
               implements=flo.model.flows.flow)
def rdr2geo():
    """
    Compute the transformation from radar to geodetic coordinates for a given SLC
    """
    # grab the flow
    from .Rdr2Geo import Rdr2Geo
    # and publish it
    return Rdr2Geo


# the resamp workflow foundry
@flo.foundry(tip="re-sample an SLC",
               implements=flo.model.flows.flow)
def resamp():
    """
    Compute the transformation from radar to geodetic coordinates for a given SLC
    """
    # grab the flow
    from .Resamp import Resamp
    # and publish it
    return Resamp


# end of file
