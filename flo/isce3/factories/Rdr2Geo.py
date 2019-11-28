#-*- coding: utf-8 -*-


# support
import flo


# the factory
class Rdr2Geo(flo.flow.factory,
              family="isce3.factories.rdr2geo",
              implements=flo.model.factories.rdr2geo):
    """
    Compute a transformation from radar to geodetic coordinates for a given SLC
    """


    # configurable state
    mask = flo.properties.bool()
    mask.default = False
    mask.doc = "indicate whether a mask raster has been provided"

    outputDir = flo.properties.path()
    outputDir.default = "rdr2geo"
    outputDir.doc = "the directory to contain the output"


    # inputs
    dem = flo.model.products.dem.input()
    dem.doc = "the SLC that defines the transform"

    slc = flo.model.products.slc.input()
    slc.doc = "the SLC that defines the transform"

    ellipsoid = flo.model.core.ellipsoid.input()
    ellipsoid.doc = "the reference ellipsoid"


    # flow hooks
    def pyre_run(self, **kwds):
        """
        Rebuild my outputs
        """
        # sign in
        print(f"{self.pyre_spec}")
        # all done
        return self


# end of file
