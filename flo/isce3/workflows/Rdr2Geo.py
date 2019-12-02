#-*- coding: utf-8 -*-

# support
import flo


# the flow
class Rdr2Geo(flo.flow.workflow, family="isce3.workflows.rdr2geo"):
    """
    Compute the transformation from radar to geodetic coordinates for a given SLC
    """

    # flow assets
    # the main engine
    rdr2geo = flo.model.factories.rdr2geo()
    rdr2geo.doc = "the SLC converter from radar to geodetic coordinates"

    # sources of input
    slcReader = flo.model.readers.slc()
    slcReader.doc = "the reader of native SLCs"

    demReader = flo.model.readers.dem()
    demReader.doc = "the digital elevation model reader"


    # flow hooks
    @flo.export
    def pyre_make(self, **kwds):
        """
        Execute the workflow
        """
        print(f"{self.pyre_spec}")
        # N.B.: this will be automated eventually
        # get the SLC reader to create the SLC
        self.slcReader.pyre_run(**kwds)
        # get the DEM reader to create the DEM
        self.demReader.pyre_run(**kwds)
        # get Rdr2Geo to build the transformation
        self.rdr2geo.pyre_run(**kwds)
        # all done
        return


    # meta-methods
    def __init__(self, **kwds):
        # chain up
        super().__init__(**kwds)

        # unpack
        rdr2geo = self.rdr2geo
        demReader = self.demReader
        slcReader = self.slcReader

        # bind
        rdr2geo.dem = demReader.dem
        rdr2geo.slc = slcReader.slc

        # all done
        return


# end of file
