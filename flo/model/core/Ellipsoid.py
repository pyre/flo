#-*- coding: utf-8 -*-


# get the package
import flo


# protocols for the core objects
class Ellipsoid(flo.flow.specification, family="flo.core.ellipsoids"):
    """
    Specification of {flo} compatible geodetic models
    """


    # framework hooks
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Provide access to the reference implementation
        """
        # by default, use the WGS84 reference ellipsoid
        return flo.wgs84


# end of file
