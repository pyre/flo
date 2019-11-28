#-*- coding: utf-8 -*-

# the package
import flo


# declaration
class Ellipsoid(flo.flow.product,
                family="flo.ellipsoid", implements=flo.model.core.ellipsoid):
    """
    The reference implementation of a simple geodetic ellipsoid
    """


    # user configurable state
    a = flo.properties.dimensional()
    a.default = 6378.1370 * flo.units.length.km
    a.doc = "the ellipsoid semi-major axis"
    a.const = NotImplemented

    e2 = flo.properties.float()
    e2.default = 0.0066943799901
    e2.doc = "the ellipsoid eccentricity squared"
    e2.const = NotImplemented


    # public data
    @property
    def b(self):
        """
        The ellipsoid semi-minor axis
        """
        # don't know how to do that, since i'm not connected to {libisce}
        raise NotImplementedError("no {libisce}")


# end of file
