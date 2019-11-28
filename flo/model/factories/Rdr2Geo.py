#-*- coding: utf-8 -*-


# get the package
import flo


# geometric transformations from radar to geodetic coordinates
class Rdr2Geo(flo.flow.producer, family="flo.factories.rdr2geo"):
    """
    Compute a transformation from radar to geodetic coordinates for a given SLC
    """

    # framework hooks
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Supply the reference implementation of the {rdr2geo} factory
        """
        # get the {isce3} reference implementation and publish it
        return flo.isce3.factories.rdr2geo()


# end of file
