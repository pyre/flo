#-*- coding: utf-8 -*-


# get the package
import flo


# geometric transformations from geodetic to radar coordinates
class Geo2Rdr(flo.flow.producer, family="flo.factories.geo2rdr"):
    """
    Compute a transformation from geodetic to radar coordinates for a given SLC
    """

    # framework hooks
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Supply the reference implementation of the {geo2rdr} factory
        """
        # get the {isce3} reference implementation and publish it
        return flo.isce3.factories.geo2rdr()


# end of file
