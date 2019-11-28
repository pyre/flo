#-*- coding: utf-8 -*-


# support
import flo


# the factory
class Geo2Rdr(flo.flow.factory,
              family="isce3.factories.geo2rdr",
              implements=flo.model.factories.geo2rdr):
    """
    Compute a transformation from geodetic to radar coordinates for a given SLC
    """


    # configurable state
    azimuthShift = flo.properties.float()
    azimuthShift.default = 0.0
    azimuthShift.doc = "the gross azimuth offset"

    rangeShift = flo.properties.float()
    rangeShift.default = 0.0
    rangeShift.doc = "the gross range shift"

    outputDir = flo.properties.path()
    outputDir.default = "geo2rdr"
    outputDir.doc = "the directory to contain the output"


    # inputs
    slc = flo.model.products.slc.input()
    slc.doc = "the SLC that defines the transform"

    topo = flo.model.products.topo.input()
    topo.doc = "the topo raster"

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
